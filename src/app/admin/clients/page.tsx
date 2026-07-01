"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Search, 
  RefreshCw, 
  Users, 
  UserCheck, 
  Calendar, 
  Phone, 
  Trash2, 
  Eye, 
  Loader2,
  Activity,
  Plus,
  MoreHorizontal,
  ShoppingCart,
  Edit
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import Reusable Dialog Components
import CreateClientDialog from "@/components/admin/clients/create-client-dialog";
import ClientDetailsDialog from "@/components/admin/clients/client-details-dialog";
import ClientPurchasesDialog from "@/components/admin/clients/client-purchases-dialog";
import EditClientDialog from "@/components/admin/clients/edit-client-dialog";

interface ClientItem {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  status: 'pending' | 'contacted' | 'resolved' | 'ignored' | 'active' | 'inactive';
  source: 'website_enquiry' | 'referral' | 'wishlist' | 'admin';
  referralCode?: string;
  referredBy?: {
    referrerId?: string;
    referrerEmail?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  referrerUsers: number;
  newUsersToday: number;
}

export default function AllClientsPage() {
  const [users, setUsers] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all"); // maps to type query (all, referrer, non-referrer)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, activeUsers: 0, referrerUsers: 0, newUsersToday: 0 });
  
  // Dialog management states
  const [selectedUser, setSelectedUser] = useState<ClientItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPurchasesOpen, setIsPurchasesOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/clients?status=${status}&type=${type}&search=${encodeURIComponent(search)}&page=${page}&limit=10`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch clients.");
      }

      setUsers(data.users);
      setTotalPages(data.pagination.pages);
      setStats(data.stats);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to retrieve clients list.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [status, type, search, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  // Handle client status toggle (active / inactive)
  const handleToggleStatus = async (client: ClientItem) => {
    const newStatus = client.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/admin/clients/${client._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to toggle status.");
      }

      toast.success(data.message || `Client status updated to ${newStatus}.`);
      
      // Update local state
      setUsers(prev => 
        prev.map(u => u._id === client._id ? { ...u, status: newStatus } : u)
      );

      // Re-fetch stats
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status.");
    }
  };

  // Handle client deletion
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this client profile? This action will also delete all associated purchase records and cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/clients/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete client.");
      }

      toast.success(data.message || "Client deleted successfully.");
      setUsers(prev => prev.filter(u => u._id !== userId));
      
      if (selectedUser?._id === userId) {
        setIsDetailsOpen(false);
        setIsPurchasesOpen(false);
      }

      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete client.");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderStatusBadge = (statusVal: string) => {
    switch (statusVal) {
      case "active":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-medium">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border/10 font-medium">Inactive</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 font-medium">Pending</Badge>;
      case "contacted":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-medium">Contacted</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-teal-500/10 text-teal-400 border-teal-500/20 font-medium">Resolved</Badge>;
      case "ignored":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-medium">Ignored</Badge>;
      default:
        return <Badge variant="outline" className="capitalize">{statusVal}</Badge>;
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 bg-background relative overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <h2 className="text-xl font-display font-bold tracking-tight text-foreground">
            Client Management
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand hover:bg-brand/90 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
          <Button
            onClick={fetchUsers}
            className="inline-flex items-center gap-2 rounded-xl border border-border/15 bg-card/40 backdrop-blur-md px-4 py-2 text-sm font-medium text-foreground hover:bg-card/70 hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer shadow-soft"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {/* Total Clients */}
        <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl p-5 shadow-elegant flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Clients</p>
            <h3 className="text-2xl font-bold font-display text-foreground mt-2">{stats.totalUsers}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Active Clients */}
        <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl p-5 shadow-elegant flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Clients</p>
            <h3 className="text-2xl font-bold font-display text-emerald-400 mt-2">{stats.activeUsers}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>

        {/* Referred Clients */}
        <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl p-5 shadow-elegant flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Referred Clients</p>
            <h3 className="text-2xl font-bold font-display text-purple-400 mt-2">{stats.referrerUsers}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <ShoppingCart className="h-5 w-5" />
          </div>
        </div>

        {/* Joined Today */}
        <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl p-5 shadow-elegant flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Today</p>
            <h3 className="text-2xl font-bold font-display text-brand mt-2">{stats.newUsersToday}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
            <Calendar className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filters and Search Control Block */}
      <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl p-4 shadow-elegant flex flex-col xl:flex-row xl:items-center justify-between gap-4 relative z-10">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</label>
            <select
              value={status}
              onChange={e => { setStatus(e.target.value); setPage(1); }}
              className="bg-soft/40 border border-border/10 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand/40"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="contacted">Contacted</option>
              <option value="resolved">Resolved</option>
              <option value="ignored">Ignored</option>
            </select>
          </div>

          {/* Source filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Traffic Type</label>
            <select
              value={type}
              onChange={e => { setType(e.target.value); setPage(1); }}
              className="bg-soft/40 border border-border/10 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-brand/40"
            >
              <option value="all">All Clients</option>
              <option value="referrer">Referred Clients Only</option>
              <option value="non-referrer">Direct Signups Only</option>
              <option value="admin">Added by Admin</option>
              <option value="website_enquiry">Website Enquiry</option>
              <option value="wishlist">Wishlist</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full xl:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name, mobile, email, referral code..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-soft/50 border border-border/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand/40 focus:ring-1 focus:ring-brand/40 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Main Clients Table */}
      <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl shadow-elegant overflow-hidden relative z-10">
        {loading && users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <span>Retrieving clients registry...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground text-center px-4">
            <Users className="h-12 w-12 opacity-30 text-brand" />
            <h4 className="font-semibold text-lg text-foreground">No Clients Found</h4>
            <p className="text-sm max-w-sm">
              We couldn&apos;t find any client profiles matching the selected query or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/10 bg-soft/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-4">Client Info</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined &amp; Source</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10 text-sm text-foreground">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-soft/10 transition-colors">
                    {/* User profile (Name & Mobile) */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground/60" />
                        <span>{user.mobile}</span>
                        {user.email && (
                          <span className="border-l border-border/20 pl-2 opacity-80">{user.email}</span>
                        )}
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(user.status)}
                    </td>

                    {/* Joined Date & Source */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-mono text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Source: <span className="font-semibold text-foreground capitalize">{user.source?.replace('_', ' ') || 'direct'}</span>
                      </div>
                    </td>

                    {/* Actions dropdown */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-soft/20 rounded-lg cursor-pointer">
                            <span className="sr-only">Open Menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 bg-card border border-border/10 backdrop-blur-xl shadow-elegant">
                          <DropdownMenuItem
                            onClick={() => { setSelectedUser(user); setIsDetailsOpen(true); }}
                            className="text-xs cursor-pointer flex items-center gap-2"
                          >
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => { setSelectedUser(user); setIsEditOpen(true); }}
                            className="text-xs cursor-pointer flex items-center gap-2"
                          >
                            <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                            Edit Details
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem
                            onClick={() => { setSelectedUser(user); setIsPurchasesOpen(true); }}
                            className="text-xs cursor-pointer flex items-center gap-2"
                          >
                            <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />
                            Purchases
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(user)}
                            className="text-xs cursor-pointer flex items-center gap-2"
                          >
                            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                            Set {user.status === 'active' ? 'Inactive' : 'Active'}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-xs cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10 focus:bg-destructive/10 flex items-center gap-2"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            Delete Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="border-t border-border/10 p-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-border/15 text-xs text-foreground bg-soft/10 hover:bg-soft/30 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all"
              >
                Previous
              </Button>
              <Button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-border/15 text-xs text-foreground bg-soft/10 hover:bg-soft/30 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Render Dialog Components */}
      <CreateClientDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={fetchUsers}
      />

      {selectedUser && (
        <>
          <ClientDetailsDialog
            client={selectedUser}
            isOpen={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
          />
          <ClientPurchasesDialog
            client={selectedUser}
            isOpen={isPurchasesOpen}
            onOpenChange={setIsPurchasesOpen}
          />
          <EditClientDialog
            client={selectedUser}
            isOpen={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSuccess={fetchUsers}
          />
        </>
      )}
    </div>
  );
}
