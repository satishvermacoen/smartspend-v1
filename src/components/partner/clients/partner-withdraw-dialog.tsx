import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface PartnerWithdrawDialogProps {
  availableBalance: number;
}

export function PartnerWithdrawDialog({ availableBalance }: PartnerWithdrawDialogProps) {
  const [claimAmount, setClaimAmount] = React.useState("")
  const [isClaiming, setIsClaiming] = React.useState(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleClaimSubmit = async () => {
    const amount = parseFloat(claimAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if (amount > availableBalance) {
      toast.error("Insufficient balance.");
      return;
    }

    setIsClaiming(true);
    try {
      const res = await fetch('/api/partner/referral/rewards/claim-cash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process withdrawal request.");
      }

      toast.success("Withdrawal request submitted successfully!");
      setIsDialogOpen(false);
      setClaimAmount("");
      // Ideally trigger a refresh here, but for now we just show success
      window.location.reload(); 
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsClaiming(false);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button disabled={availableBalance <= 0} className="bg-brand text-white hover:bg-brand/90">
          Withdraw Funds
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Commission</DialogTitle>
          <DialogDescription>
            Enter the amount you would like to withdraw. Your available balance is {formatCurrency(availableBalance)}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (INR)</Label>
            <Input 
              id="amount" 
              type="number" 
              value={claimAmount}
              onChange={(e) => setClaimAmount(e.target.value)}
              placeholder={`Max ${formatCurrency(availableBalance)}`}
              max={availableBalance}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClaimSubmit} disabled={isClaiming || !claimAmount}>
            {isClaiming ? "Processing..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
