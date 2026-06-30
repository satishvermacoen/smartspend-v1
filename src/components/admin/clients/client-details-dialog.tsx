'use client';

import { Calendar, Mail, Phone, Shield, FileText, User, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Client } from '@/types';

interface ClientDetailsDialogProps {
  client: Client | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ClientDetailsDialog({
  client,
  isOpen,
  onOpenChange,
}: ClientDetailsDialogProps) {
  if (!client) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'website_enquiry':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-medium">Website Enquiry</Badge>;
      case 'referral':
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 font-medium">Referral</Badge>;
      case 'wishlist':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 font-medium">Wishlist</Badge>;
      case 'admin':
        return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-medium">Added by Admin</Badge>;
      default:
        return <Badge variant="outline">{source}</Badge>;
    }
  };

  const getStatusBadge = (statusVal: string) => {
    switch (statusVal) {
      case 'active':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-medium">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border/10 font-medium">Inactive</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 font-medium">Pending</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-medium">Contacted</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-teal-500/10 text-teal-400 border-teal-500/20 font-medium">Resolved</Badge>;
      case 'ignored':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-medium">Ignored</Badge>;
      default:
        return <Badge variant="outline">{statusVal}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-card/95 border border-border/10 backdrop-blur-xl shadow-elegant text-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-brand" />
            Client Details
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Full registration profile and status metadata for the client.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Main profile banner card */}
          <div className="bg-soft/20 border border-border/5 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center font-bold text-lg uppercase shrink-0">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-foreground flex items-center gap-1.5">
                  {client.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">{client.email || 'No email provided'}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {getStatusBadge(client.status)}
              {getSourceBadge(client.source)}
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-soft/10 border border-border/5 rounded-xl p-4 space-y-3">
              <h5 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Contact Information</h5>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 opacity-75 shrink-0" />
                  <span>Phone: <strong className="text-foreground">{client.mobile || 'N/A'}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 opacity-75 shrink-0" />
                  <span>Email: <strong className="text-foreground">{client.email || 'N/A'}</strong></span>
                </div>
              </div>
            </div>

            <div className="bg-soft/10 border border-border/5 rounded-xl p-4 space-y-3">
              <h5 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">System Metadata</h5>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 opacity-75 shrink-0" />
                  <span>Added On: <strong className="text-foreground">{formatDate(client.createdAt || "")}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 opacity-75 shrink-0" />
                  <span>Last Updated: <strong className="text-foreground">{formatDate(client.updatedAt || "")}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Referral attribution details */}
          <div className="bg-soft/10 border border-border/5 rounded-xl p-4 space-y-3 text-xs">
            <h5 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-brand" /> Referral Attribution
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              <div>
                <span className="text-muted-foreground">Referral Partner Code:</span>
                <p className="font-mono font-semibold text-foreground mt-0.5">{client.referralCode || 'None'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Referred By Referrer:</span>
                <p className="font-semibold text-foreground mt-0.5">{client.referredBy?.referrerEmail ? `${client.referredBy.referrerEmail}` : 'Direct / No Referrer'}</p>
              </div>
            </div>
          </div>

          {/* Notes area */}
          <div className="space-y-2 text-xs">
            <h5 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" /> CRM Notes
            </h5>
            <div className="bg-soft/10 border border-border/5 rounded-xl p-4 text-muted-foreground min-h-[70px] italic">
              {client.notes ? client.notes : 'No administrative notes recorded for this client.'}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end border-t border-border/10 pt-4 mt-2">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-border/15 bg-card/40 backdrop-blur-md px-5 py-2 text-xs font-semibold text-foreground hover:bg-card/70 transition-all"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
