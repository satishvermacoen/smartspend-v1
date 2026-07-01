'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Save, UserCheck } from 'lucide-react';
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

interface ClientItem {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  status: 'pending' | 'contacted' | 'resolved' | 'ignored' | 'active' | 'inactive';
  notes?: string;
}

interface EditClientDialogProps {
  client: ClientItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditClientDialog({
  client,
  isOpen,
  onOpenChange,
  onSuccess,
}: EditClientDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    mobile: string;
    email: string;
    password: string;
    status: ClientItem['status'];
    notes: string;
  }>({
    name: '',
    mobile: '',
    email: '',
    password: '',
    status: 'active',
    notes: '',
  });

  const [prevClient, setPrevClient] = useState<ClientItem | null>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  if (client !== prevClient || isOpen !== prevIsOpen) {
    setPrevClient(client);
    setPrevIsOpen(isOpen);
    if (client) {
      setFormData({
        name: client.name || '',
        mobile: client.mobile || '',
        email: client.email || '',
        password: '',
        status: client.status || 'active',
        notes: client.notes || '',
      });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;

    if (!formData.name.trim() || !formData.mobile.trim()) {
      toast.error('Name and Mobile number are required.');
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, string> = {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        status: formData.status,
        notes: formData.notes,
      };

      if (formData.password.trim() !== '') {
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        payload.password = formData.password;
      }

      const res = await fetch(`/api/admin/clients/${client._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update client.');
      }

      toast.success(data.message || 'Client profile updated successfully.');
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update client.';
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
            <UserCheck className="h-5 w-5 text-brand" />
            Edit Client Information
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Modify the client&apos;s details. If you enter a new password, it will be updated and emailed to the client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name" className="text-xs font-semibold text-muted-foreground">Full Name *</Label>
              <Input
                id="edit-name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-soft/40 border border-border/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand/40"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-mobile" className="text-xs font-semibold text-muted-foreground">Mobile Number *</Label>
              <Input
                id="edit-mobile"
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
              <Label htmlFor="edit-email" className="text-xs font-semibold text-muted-foreground">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="bg-soft/40 border border-border/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand/40"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-status" className="text-xs font-semibold text-muted-foreground">Status</Label>
              <select
                id="edit-status"
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as ClientItem['status'] }))}
                className="w-full bg-soft/40 border border-border/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand/40"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="resolved">Resolved</option>
                <option value="ignored">Ignored</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-password" className="text-xs font-semibold text-muted-foreground">
              New Password (Optional)
            </Label>
            <Input
              id="edit-password"
              type="text"
              placeholder="Leave blank to keep current password"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              className="bg-soft/40 border border-border/10 rounded-xl px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-brand/40"
            />
            <p className="text-[10px] text-muted-foreground">
              Min 6 characters. If set, an email will be sent containing the new password.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-notes" className="text-xs font-semibold text-muted-foreground">Administrative Notes (Optional)</Label>
            <textarea
              id="edit-notes"
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
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
