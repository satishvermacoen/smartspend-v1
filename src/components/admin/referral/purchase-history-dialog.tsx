import React, { useState, useMemo } from 'react';
import { Loader2, PlusCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ClientItem, ClientPurchaseItem } from './types';

interface PurchaseHistoryDialogProps {
  selectedClient: ClientItem | null;
  onClose: () => void;
  purchases: ClientPurchaseItem[];
  loadingPurchases: boolean;
  allClients: ClientItem[];
  onPurchaseAdded: () => void;
}

export function PurchaseHistoryDialog({
  selectedClient,
  onClose,
  purchases,
  loadingPurchases,
  allClients,
  onPurchaseAdded
}: PurchaseHistoryDialogProps) {
  const [serviceName, setServiceName] = useState("");
  const [amount, setAmount] = useState("");
  const [addingPurchase, setAddingPurchase] = useState(false);
  const [targetClientId, setTargetClientId] = useState<string>("");
  const [prevSelectedClientId, setPrevSelectedClientId] = useState<string | undefined>();

  // Determine who the purchase can be made for (the client themselves, or their referred clients)
  const availableClients = useMemo(() => {
    if (!selectedClient) return [];
    return allClients.filter(c => c.referrerId === selectedClient._id);
  }, [selectedClient, allClients]);

  // Set default target client when dialog opens
  if (selectedClient?._id !== prevSelectedClientId) {
    setPrevSelectedClientId(selectedClient?._id);
    if (availableClients.length > 0) {
      setTargetClientId(availableClients[0]._id);
    } else {
      setTargetClientId("");
    }
  }

  const handleAddPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetClientId) return;

    if (!serviceName || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    setAddingPurchase(true);
    try {
      const res = await fetch('/api/admin/referrals/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: targetClientId,
          service_name: serviceName,
          amount: Number(amount)
        })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Purchase recorded successfully");
        setServiceName("");
        setAmount("");
        onPurchaseAdded();
      } else {
        toast.error(data.error || "Failed to record purchase");
      }
    } catch {
      toast.error("An error occurred while adding purchase");
    } finally {
      setAddingPurchase(false);
    }
  };

  return (
    <Dialog open={!!selectedClient} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-card border border-border/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5 text-brand" /> 
            Purchase History - {selectedClient?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          {/* Add New Purchase Form */}
          <div className="bg-soft/10 p-4 rounded-xl border border-border/10 w-full">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-1.5"><PlusCircle className="h-4 w-4 text-brand" /> Record New Purchase</h4>
            <form onSubmit={handleAddPurchase} className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="w-full sm:w-1/3">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Who made the purchase?</label>
                  <Select value={targetClientId} onValueChange={setTargetClientId}>
                    <SelectTrigger className="h-9 text-sm bg-background border-border/15">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableClients.map(c => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Service / Plan Name</label>
                  <Input 
                    required 
                    placeholder="e.g. Pro Subscription" 
                    value={serviceName} 
                    onChange={e => setServiceName(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="w-full sm:w-32">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Amount (₹)</label>
                  <Input 
                    required 
                    type="number" 
                    placeholder="0.00" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-1">
                <Button 
                  type="submit" 
                  disabled={addingPurchase}
                  className="h-9 bg-brand text-primary-foreground hover:brightness-110 w-full sm:w-auto px-6"
                >
                  {addingPurchase ? <Loader2 className="h-4 w-4 animate-spin" /> : "Record Purchase"}
                </Button>
              </div>
            </form>
          </div>

          {/* Past Purchases List */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Previous Purchases</h4>
            {loadingPurchases ? (
              <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : purchases.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground bg-soft/5 rounded-xl border border-dashed border-border/10">
                No purchase history found for this client.
              </div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                {purchases.map(p => (
                  <div key={p._id} className="p-3 bg-background border border-border/10 rounded-xl flex items-center justify-between hover:bg-soft/5 transition-colors">
                    <div>
                      <div className="font-semibold text-sm">{p.service_name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(p.purchase_date).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">₹{p.amount}</div>
                      {p.commission_calculated && p.commission_amount > 0 && (
                        <div className="text-[9px] text-brand bg-brand/10 px-1.5 py-0.5 rounded-full inline-block mt-1">
                          Comm: ₹{p.commission_amount}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
