import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Loader2, Trash2, Search, ShoppingBag, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ClientItem, ClientPurchaseItem } from './types';
import { PurchaseHistoryDialog } from './purchase-history-dialog';
import { GlobalPurchaseDialog } from './global-purchase-dialog';

interface ClientsTabProps {
  clients: ClientItem[];
  fetchingClients: boolean;
  handleDeleteClient: (id: string) => void;
  reloadClients: () => void;
}

export function ClientsTab({ clients, fetchingClients, handleDeleteClient, reloadClients }: ClientsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");

  // Purchase Dialog States
  const [selectedClient, setSelectedClient] = useState<ClientItem | null>(null);
  const [purchases, setPurchases] = useState<ClientPurchaseItem[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [globalDialogOpen, setGlobalDialogOpen] = useState(false);

  const sources = useMemo(() => {
    const uniqueSources = new Set(clients.map(c => c.source).filter(Boolean));
    return Array.from(uniqueSources);
  }, [clients]);

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (c.phone !== "N/A" && c.phone.includes(searchQuery));
      
      const matchesSource = sourceFilter === "all" || c.source === sourceFilter;

      return matchesSearch && matchesSource;
    });
  }, [clients, searchQuery, sourceFilter]);

  const fetchPurchases = async (clientId: string) => {
    setLoadingPurchases(true);
    try {
      const res = await fetch(`/api/admin/referrals/purchases?clientId=${clientId}`);
      const data = await res.json();
      if (data.success) {
        setPurchases(data.purchases);
      } else {
        toast.error(data.error || "Failed to load purchases");
      }
    } catch {
      toast.error("Error loading purchases");
    } finally {
      setLoadingPurchases(false);
    }
  };

  const handleOpenPurchases = (client: ClientItem) => {
    setSelectedClient(client);
    fetchPurchases(client._id);
  };

  const handlePurchaseAdded = () => {
    if (selectedClient) {
      fetchPurchases(selectedClient._id);
    }
    reloadClients();
  };

  return (
    <motion.div
      key="clients"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl shadow-elegant overflow-hidden">
        <div className="p-5 border-b border-border/5 bg-soft/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-brand" /> Referral Clients Directory
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Button 
              onClick={() => setGlobalDialogOpen(true)}
              className="h-9 bg-brand text-primary-foreground hover:brightness-110 px-4 w-full sm:w-auto gap-1.5"
            >
              <PlusCircle className="h-4 w-4" /> Record Purchase
            </Button>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 bg-background border-border/15 h-9 text-sm w-full"
              />
            </div>
            <div className="w-full sm:w-40">
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="bg-background border-border/15 h-9 text-sm">
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.map(source => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {fetchingClients ? (
          <div className="py-14 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div>
        ) : clients.length === 0 ? (
          <div className="py-14 text-center text-muted-foreground text-sm">No clients found.</div>
        ) : filteredClients.length === 0 ? (
          <div className="py-14 text-center text-muted-foreground text-sm">No clients match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-soft/20 hover:bg-soft/20">
                <TableRow className="border-border/15 hover:bg-transparent">
                  <TableHead className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Client</TableHead>
                  <TableHead className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Source</TableHead>
                  <TableHead className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Sales Driven</TableHead>
                  <TableHead className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Commission</TableHead>
                  <TableHead className="text-right font-semibold text-muted-foreground uppercase tracking-wider text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map(c => (
                  <TableRow 
                    key={c._id} 
                    className="hover:bg-soft/5 transition-colors cursor-pointer border-border/10" 
                    onClick={() => window.location.href = `/admin/users/${c._id}`}
                  >
                    <TableCell className="py-4">
                      <div className="font-semibold text-foreground text-xs">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground">{c.phone !== "N/A" ? c.phone : c.email}</div>
                    </TableCell>
                    <TableCell className="py-4 text-xs text-muted-foreground">
                      {c.source}
                    </TableCell>
                    <TableCell className="py-4 text-xs font-semibold text-emerald-400">
                      ₹{c.sale}
                    </TableCell>
                    <TableCell className="py-4 text-xs font-bold text-brand">
                      ₹{c.commission}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={(e) => { e.stopPropagation(); handleOpenPurchases(c); }}
                          className="h-8 rounded-lg border border-border/15 bg-background hover:bg-soft transition-all text-foreground cursor-pointer inline-flex gap-1.5 px-3 text-xs"
                          variant="outline"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" /> Purchases
                        </Button>
                        <Button
                          onClick={(e) => { e.stopPropagation(); handleDeleteClient(c._id); }}
                          className="h-8 w-8 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-all cursor-pointer inline-flex p-0"
                          title="Delete Client"
                          variant="ghost"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <PurchaseHistoryDialog
        selectedClient={selectedClient}
        onClose={() => setSelectedClient(null)}
        purchases={purchases}
        loadingPurchases={loadingPurchases}
        allClients={clients}
        onPurchaseAdded={handlePurchaseAdded}
      />

      <GlobalPurchaseDialog
        isOpen={globalDialogOpen}
        onClose={() => setGlobalDialogOpen(false)}
        allClients={clients}
        onPurchaseAdded={handlePurchaseAdded}
      />
    </motion.div>
  );
}
