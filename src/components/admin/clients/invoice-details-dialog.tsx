'use client';

import { Calendar, Wallet, Receipt, CheckCircle, Clock, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Invoice, InvoiceItem } from '@/types';

interface InvoiceDetailsDialogProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InvoiceDetailsDialog({
  invoice,
  isOpen,
  onOpenChange,
}: InvoiceDetailsDialogProps) {
  if (!invoice) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-400 shrink-0" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-destructive shrink-0" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-medium capitalize">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 font-medium capitalize">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-medium capitalize">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="capitalize">{status}</Badge>;
    }
  };

  // Calculations
  const discount = invoice.discount_applied || 0;
  const tax = invoice.tax_amount || 0;
  const subtotal = invoice.items?.reduce((sum: number, item: InvoiceItem) => sum + (item.amount * (item.quantity || 1)), 0) || invoice.amount;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-card/95 border border-border/10 backdrop-blur-xl shadow-elegant text-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Receipt className="h-5 w-5 text-brand" />
            Purchase Invoice Receipt
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Official purchase details and itemized transaction receipt.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Header Panel */}
          <div className="bg-soft/20 border border-border/5 rounded-2xl p-5 flex justify-between items-center text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground">Invoice Number:</span>
              <p className="font-mono font-bold text-foreground text-sm">{invoice.invoice_number}</p>
              <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>Date: {formatDate(invoice.purchase_date || invoice.createdAt || '')}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-muted-foreground">Payment Status:</span>
              <div className="flex items-center gap-1.5">
                {getStatusIcon(invoice.status)}
                {getStatusBadge(invoice.status)}
              </div>
            </div>
          </div>

          {/* Client Details Summary */}
          <div className="bg-soft/10 border border-border/5 rounded-xl p-4 text-xs space-y-1.5">
            <h5 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Billed To</h5>
            {invoice.client_id && typeof invoice.client_id === 'object' ? (
              <>
                <p className="font-bold text-foreground">{invoice.client_id.name}</p>
                <div className="text-muted-foreground flex gap-4 mt-1">
                  {invoice.client_id.mobile && <span>Ph: {invoice.client_id.mobile}</span>}
                  {invoice.client_id.email && <span>Email: {invoice.client_id.email}</span>}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground italic">
                {typeof invoice.client_id === 'string' ? invoice.client_id : 'Client information unavailable'}
              </p>
            )}
          </div>

          {/* Itemized Table */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Itemized List</h5>
            <div className="bg-soft/10 border border-border/5 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/10 bg-soft/20 text-muted-foreground font-semibold">
                    <th className="px-4 py-2.5">Service Description</th>
                    <th className="px-4 py-2.5 text-right w-16">Qty</th>
                    <th className="px-4 py-2.5 text-right w-24">Rate</th>
                    <th className="px-4 py-2.5 text-right w-24">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/5 text-foreground">
                  {invoice.items && invoice.items.length > 0 ? (
                    invoice.items.map((item: InvoiceItem, idx: number) => (
                      <tr key={idx} className="hover:bg-soft/5">
                        <td className="px-4 py-2.5 font-medium">{item.service_name}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">{item.quantity || 1}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">₹{item.amount.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-right font-mono font-semibold">₹{(item.amount * (item.quantity || 1)).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Subscription / Service Plan</td>
                      <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">1</td>
                      <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">₹{invoice.amount.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-semibold">₹{invoice.amount.toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Calculation Subtotals block */}
          <div className="flex justify-end">
            <div className="w-full sm:max-w-[280px] bg-soft/10 border border-border/5 rounded-xl p-4 text-xs space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span className="font-mono">₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>Discount:</span>
                  <span className="font-mono">-₹{discount.toFixed(2)}</span>
                </div>
              )}
              {tax > 0 && (
                <div className="flex justify-between text-foreground">
                  <span>Tax & Surcharge:</span>
                  <span className="font-mono">+₹{tax.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border/10 pt-1.5 flex justify-between font-bold text-sm text-foreground">
                <span>Net Total:</span>
                <span className="font-mono text-brand">₹{invoice.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Referral Reward section if referrer linked */}
          {invoice.referrer_id && typeof invoice.referrer_id === 'object' && (
            <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-4 text-xs space-y-2">
              <h5 className="font-semibold text-purple-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-purple-400" />
                Referral Partner Attribution
              </h5>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div className="text-muted-foreground">
                  <span>Referrer Email: </span>
                  <strong className="text-foreground">{invoice.referrer_id.email || invoice.referrer_id.firstName || 'Partner'}</strong>
                </div>
                <div className="flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20 text-purple-400">
                  <span className="font-semibold">Commission:</span>
                  <strong className="font-mono font-bold">₹{invoice.commission_amount || 0}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end border-t border-border/10 pt-4 mt-2">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-border/15 bg-card/40 backdrop-blur-md px-5 py-2 text-xs font-semibold text-foreground hover:bg-card/70 transition-all"
            >
              Close Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
