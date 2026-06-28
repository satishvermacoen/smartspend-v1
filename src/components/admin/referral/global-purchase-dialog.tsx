import React, { useState } from 'react';
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
import { ClientItem } from './types';

interface GlobalPurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  allClients: ClientItem[];
  onPurchaseAdded: () => void;
}

export function GlobalPurchaseDialog({
  isOpen,
  onClose,
  allClients,
  onPurchaseAdded
}: GlobalPurchaseDialogProps) {
  const [serviceName, setServiceName] = useState("");
  const [amount, setAmount] = useState("");
  const [addingPurchase, setAddingPurchase] = useState(false);
  const [targetClientId, setTargetClientId] = useState<string>("");

  const handleAddPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetClientId) {
      toast.error("Please select a client first");
      return;
    }

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
        setTargetClientId("");
        onPurchaseAdded();
        onClose();
      } else {
        toast.error(data.error || "Failed to record purchase");
      }
    } catch (err) {
      toast.error("An error occurred while adding purchase");
    } finally {
      setAddingPurchase(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-card border border-border/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5 text-brand" /> 
            Record Global Purchase
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="bg-soft/10 p-4 rounded-xl border border-border/10">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-1.5"><PlusCircle className="h-4 w-4 text-brand" /> Record New Purchase</h4>
            <form onSubmit={handleAddPurchase} className="flex flex-col gap-3">
              <div className="w-full">
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Select Client</label>
                <Select value={targetClientId} onValueChange={setTargetClientId}>
                  <SelectTrigger className="h-9 text-sm bg-background border-border/15">
                    <SelectValue placeholder="Search or select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {allClients.map(c => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name} ({c.email || c.phone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-end mt-2">
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

              <div className="flex justify-end mt-2">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
