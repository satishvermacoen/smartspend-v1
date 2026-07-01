'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, FilePlus, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PRODUCTS, Product } from '@/data/products';
import { ToolLogo } from '@/components/marketing/layout/tool-logo';
import { Client } from '@/types';

interface CreateInvoiceDialogProps {
  client: Client;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface InvoiceItemInput {
  service_name: string;
  amount: number;
  quantity: number;
}

export default function CreateInvoiceDialog({
  client,
  isOpen,
  onOpenChange,
  onSuccess,
}: CreateInvoiceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<InvoiceItemInput[]>([
    { service_name: '', amount: 0, quantity: 1 }
  ]);
  const [discountApplied, setDiscountApplied] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [status, setStatus] = useState<'pending' | 'paid' | 'cancelled'>('paid');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);

  // Product Catalog search/category state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleAddItem = () => {
    setItems((prev) => [...prev, { service_name: '', amount: 0, quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItemInput, value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSelectProduct = (product: Product) => {
    setItems((prev) => {
      // If there is only one line item, and it is empty (no name, 0 price), replace it.
      // Otherwise, append the product to the list.
      const isFirstItemEmpty = prev.length === 1 && prev[0].service_name === '' && prev[0].amount === 0;
      const newItem = { service_name: product.name, amount: 0, quantity: 1 };
      
      if (isFirstItemEmpty) {
        return [newItem];
      } else {
        return [...prev, newItem];
      }
    });
    toast.success(`Added ${product.name} to invoice`);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
  const total = Math.max(0, subtotal - discountApplied + taxAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client?._id) return;

    // Validation
    const emptyItems = items.some((item) => !item.service_name || item.amount <= 0);
    if (emptyItems) {
      toast.error('All items must have a description and a positive amount.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client._id,
          items,
          discount_applied: discountApplied,
          tax_amount: taxAmount,
          status,
          purchase_date: new Date(purchaseDate)
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create invoice.');
      }

      toast.success(data.message || 'Invoice created successfully.');
      onSuccess();
      onOpenChange(false);
      // Reset state
      setItems([{ service_name: '', amount: 0, quantity: 1 }]);
      setDiscountApplied(0);
      setTaxAmount(0);
      setStatus('paid');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create invoice.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl lg:max-w-5xl bg-card/95 border border-border/10 backdrop-blur-xl shadow-elegant text-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <FilePlus className="h-5 w-5 text-brand" />
            Create Invoice
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Generate a bill or record a purchase for <strong className="text-foreground">{client?.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
          {/* Left Column: Form inputs and calculations */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4 py-2 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Client summary and Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-soft/20 border border-border/5 rounded-xl p-4 text-xs">
                <div className="space-y-1">
                  <span className="text-muted-foreground">Client Name:</span>
                  <p className="font-semibold text-foreground">{client?.name}</p>
                  <span className="text-muted-foreground block mt-1">Mobile:</span>
                  <p className="font-semibold text-foreground">{client?.mobile}</p>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="invoice-date" className="text-muted-foreground text-[11px] font-semibold">Purchase Date</Label>
                    <Input
                      id="invoice-date"
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="bg-card border border-border/10 rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="invoice-status" className="text-muted-foreground text-[11px] font-semibold">Invoice Status</Label>
                    <select
                      id="invoice-status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'pending' | 'paid' | 'cancelled')}
                      className="w-full bg-card border border-border/10 rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none"
                    >
                      <option value="paid">Paid (Resolves commissions)</option>
                      <option value="pending">Pending (Unpaid bill)</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Invoice Items */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Line Items</h5>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddItem}
                    className="px-2.5 py-1 text-[11px] rounded-lg border border-border/15 bg-transparent hover:bg-soft/10 text-foreground flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="h-3 w-3" /> Add Item
                  </Button>
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-soft/10 p-2.5 rounded-xl border border-border/5">
                      <div className="flex-1 space-y-1">
                        <Input
                          placeholder="Service Name / Item description"
                          value={item.service_name}
                          onChange={(e) => handleItemChange(idx, 'service_name', e.target.value)}
                          className="bg-card border border-border/10 rounded-lg px-3 py-1.5 text-xs text-foreground"
                          required
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          placeholder="Rate"
                          value={item.amount || ''}
                          onChange={(e) => handleItemChange(idx, 'amount', parseFloat(e.target.value) || 0)}
                          className="bg-card border border-border/10 rounded-lg px-2 py-1.5 text-xs text-foreground"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="w-16">
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity || ''}
                          onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                          className="bg-card border border-border/10 rounded-lg px-2 py-1.5 text-xs text-foreground"
                          min="1"
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        disabled={items.length === 1}
                        onClick={() => handleRemoveItem(idx)}
                        className="p-2 h-8 w-8 rounded-lg border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/15 disabled:opacity-30 disabled:pointer-events-none transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Calculations Panel */}
              <div className="border-t border-border/10 pt-4 flex flex-col sm:flex-row justify-between gap-4">
                <div className="w-full sm:max-w-[200px] space-y-2">
                  <div className="flex justify-between items-center gap-2">
                    <Label htmlFor="discount" className="text-xs text-muted-foreground">Discount (₹)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={discountApplied || ''}
                      onChange={(e) => setDiscountApplied(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-20 bg-soft/35 border border-border/10 rounded-lg px-2 py-1 text-xs text-right"
                      min="0"
                    />
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <Label htmlFor="tax" className="text-xs text-muted-foreground">Tax (₹)</Label>
                    <Input
                      id="tax"
                      type="number"
                      value={taxAmount || ''}
                      onChange={(e) => setTaxAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-20 bg-soft/35 border border-border/10 rounded-lg px-2 py-1 text-xs text-right"
                      min="0"
                    />
                  </div>
                </div>

                <div className="bg-soft/10 border border-border/5 rounded-xl p-3.5 flex-1 space-y-1.5 text-xs flex flex-col justify-center">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discountApplied > 0 && (
                    <div className="flex justify-between text-destructive">
                      <span>Discount:</span>
                      <span>-₹{discountApplied.toFixed(2)}</span>
                    </div>
                  )}
                  {taxAmount > 0 && (
                    <div className="flex justify-between text-foreground">
                      <span>Tax:</span>
                      <span>+₹{taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-border/10 pt-1.5 flex justify-between font-bold text-sm text-foreground">
                    <span>Grand Total:</span>
                    <span className="text-brand">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6 border-t border-border/5 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl border border-border/15 bg-transparent px-4 py-2.5 text-xs font-semibold hover:bg-soft/10 text-foreground transition-all"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-brand hover:bg-brand/90 px-4 py-2.5 text-xs font-semibold text-white shadow-soft transition-all flex items-center gap-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <FilePlus className="h-3.5 w-3.5" /> Issue Invoice
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>

          {/* Right Column: Searchable Product Catalog */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-border/10 pt-4 lg:pt-0 lg:pl-6 flex flex-col max-h-[75vh]">
            <div className="space-y-3 pb-3">
              <div className="flex justify-between items-center">
                <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Catalog</h5>
                <span className="text-[10px] text-muted-foreground bg-soft/20 px-2 py-0.5 rounded-full font-mono">
                  {PRODUCTS.length} items
                </span>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search app or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-card border border-border/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground focus:outline-none"
                />
              </div>

              {/* Category Filter Scrollable Tabs */}
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none whitespace-nowrap">
                {['All', 'AI', 'Developer', 'Creative', 'Professional', 'Productivity', 'Marketing', 'Credits', 'OTT'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-brand text-white border-brand shadow-sm'
                        : 'bg-soft/10 text-muted-foreground border-border/5 hover:bg-soft/20 hover:text-foreground'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable list of products */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
              {PRODUCTS.filter((p) => {
                const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.category.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
                return matchesSearch && matchesCategory;
              }).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center">
                  <Search className="h-6 w-6 opacity-30 mb-2" />
                  <p className="text-xs">No products match &quot;{searchQuery}&quot;</p>
                </div>
              ) : (
                PRODUCTS.filter((p) => {
                  const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.category.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
                  return matchesSearch && matchesCategory;
                }).map((product) => (
                  <button
                    key={`${product.name}-${product.category}`}
                    type="button"
                    onClick={() => handleSelectProduct(product)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-border/5 bg-soft/5 hover:bg-soft/15 hover:border-brand/20 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-card flex items-center justify-center p-1 border border-border/10 group-hover:scale-105 transition-transform flex-shrink-0">
                        <ToolLogo tool={product} className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <h6 className="text-[11px] font-semibold text-foreground truncate group-hover:text-brand transition-colors">
                          {product.name}
                        </h6>
                        <span className="text-[9px] text-muted-foreground block">
                          {product.category}
                        </span>
                      </div>
                    </div>
                     <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="p-0.5 rounded-md bg-brand/10 text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="h-3 w-3" />
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

