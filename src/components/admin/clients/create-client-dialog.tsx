'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, UserPlus } from 'lucide-react';
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

interface CreateClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateClientDialog({
  isOpen,
  onOpenChange,
  onSuccess,
}: CreateClientDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    status: 'active',
    referralCode: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      toast.error('Name and Mobile number are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create client.');
      }

      toast.success(data.message || 'Client created successfully.');
      onSuccess();
      onOpenChange(false);
      setFormData({
        name: '',
        mobile: '',
        email: '',
        status: 'active',
        referralCode: '',
        notes: '',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save client.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card/95 border border-border/10 backdrop-blur-xl shadow-elegant text-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-brand" />
            Add New Client
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Create a client profile manually. The source will be recorded as &quot;admin&quot; unless a referral partner code is applied.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-soft/40 border border-border/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand/40"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mobile" className="text-xs font-semibold text-muted-foreground">Mobile Number *</Label>
              <Input
                id="mobile"
                placeholder="e.g. +91 9876543210"
                value={formData.mobile}
                onChange={(e) => setFormData((prev) => ({ ...prev, mobile: e.target.value }))}
                className="bg-soft/40 border border-border/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand/40"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">Email Address (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="bg-soft/40 border border-border/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand/40"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs font-semibold text-muted-foreground">Initial Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full bg-soft/40 border border-border/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand/40"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="referralCode" className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
              <span>Referral Partner Code (Optional)</span>
              <span className="text-[10px] text-muted-foreground">e.g. SSPARTNER</span>
            </Label>
            <Input
              id="referralCode"
              placeholder="SSXXXX"
              value={formData.referralCode}
              onChange={(e) => setFormData((prev) => ({ ...prev, referralCode: e.target.value.toUpperCase() }))}
              className="bg-soft/40 border border-border/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:border-brand/40"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-semibold text-muted-foreground">Administrative Notes (Optional)</Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Add client requirements, background, or meeting highlights..."
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full bg-soft/40 border border-border/10 rounded-xl p-3 text-sm text-foreground focus:outline-none focus:border-brand/40 resize-none"
            />
          </div>

          <DialogFooter className="pt-2">
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
                  <Plus className="h-3.5 w-3.5" /> Create Client
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
