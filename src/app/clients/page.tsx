"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Sparkles, 
  CreditCard, 
  MessageSquare, 
  PlusCircle, 
  FileText, 
  RefreshCw, 
  Activity, 
  Clock, 
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface InvoiceItem {
  service_name: string;
  amount: number;
  quantity?: number;
}

interface Invoice {
  _id: string;
  invoice_number: string;
  items: InvoiceItem[];
  amount: number;
  discount_applied?: number;
  tax_amount?: number;
  purchase_date: string;
  status: 'pending' | 'paid' | 'cancelled';
}

interface EnquiryItem {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  subscription?: string;
  message?: string;
  status: 'pending' | 'contacted' | 'resolved' | 'ignored' | 'active' | 'inactive';
  notes?: string;
  createdAt: string;
}

export default function ClientsPage() {
  const { data: session } = useSession()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([])
  const [loading, setLoading] = useState(true)

  const userName = session?.user?.name || (session?.user?.email ? session.user.email.split('@')[0] : "Valued Client")

  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    let active = true
    const fetchDashboardData = async () => {
      try {
        const [invRes, enqRes] = await Promise.all([
          fetch("/api/clients/invoices"),
          fetch("/api/clients/enquiry")
        ])

        if (!active) return

        if (invRes.ok) {
          const invData = await invRes.json()
          setInvoices(invData?.invoices || [])
        }

        if (enqRes.ok) {
          const enqData = await enqRes.json()
          setEnquiries(enqData?.enquiries || [])
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchDashboardData()

    return () => {
      active = false
    }
  }, [refreshTrigger])

  const handleRefresh = () => {
    setLoading(true)
    setRefreshTrigger(prev => prev + 1)
  }

  // Calculation of KPIs
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
  const totalPendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0)
  const pendingInvoicesCount = invoices.filter(inv => inv.status === 'pending').length
  
  // Calculate active subscriptions (resolved enquiries or active items from paid invoices)
  const activeEnquiriesCount = enquiries.filter(enq => ['active', 'resolved', 'contacted'].includes(enq.status)).length
  const pendingSupportCount = enquiries.filter(enq => enq.status === 'pending').length

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }

  const renderEnquiryStatusBadge = (statusVal: string) => {
    switch (statusVal) {
      case "pending":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-medium">Pending</Badge>;
      case "contacted":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-medium">Contacted</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-medium">Resolved</Badge>;
      case "ignored":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border/10 font-medium">Ignored</Badge>;
      case "active":
        return <Badge variant="outline" className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-medium">Active</Badge>;
      default:
        return <Badge variant="outline">{statusVal}</Badge>;
    }
  }

  const renderInvoiceStatusBadge = (statusVal: string) => {
    switch (statusVal) {
      case "paid":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-medium">Paid</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-medium">Pending</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-medium">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{statusVal}</Badge>;
    }
  }

  if (loading) {
    return (
      <div className="flex-1 p-6 md:p-10 space-y-8 bg-background relative overflow-y-auto">
        <div className="space-y-4">
          <div className="h-10 w-64 bg-muted/60 animate-pulse rounded-xl" />
          <div className="h-5 w-96 bg-muted/40 animate-pulse rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted/40 animate-pulse rounded-2xl border border-border/10" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-96 bg-muted/40 animate-pulse rounded-3xl" />
          <div className="lg:col-span-5 h-96 bg-muted/40 animate-pulse rounded-3xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 bg-background relative overflow-y-auto">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand/5 dark:bg-brand/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-soft/10 dark:bg-teal-deep/20 blur-[100px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-soft/20 text-brand dark:text-gold mb-2 border border-brand/10">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Client Dashboard
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
            Welcome back, <span className="text-gradient font-extrabold">{userName}</span>!
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            Monitor subscriptions, request customized tools, and track your invoices in one secure space.
          </p>
        </div>

        <Button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 rounded-xl border border-border/15 bg-card/40 backdrop-blur-md px-4 py-2 text-sm font-medium text-foreground hover:bg-card/75 hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer shadow-soft"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {/* KPI 1: Active Subscriptions */}
        <Card className="bg-card/35 backdrop-blur-md border border-border/10 shadow-soft hover:-translate-y-1 hover:border-brand/35 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Services</CardTitle>
            <div className="p-2 bg-brand/10 rounded-xl">
              <Activity className="h-4 w-4 text-brand dark:text-gold" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{activeEnquiriesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Managed software utilities</p>
          </CardContent>
        </Card>

        {/* KPI 2: Total Spent */}
        <Card className="bg-card/35 backdrop-blur-md border border-border/10 shadow-soft hover:-translate-y-1 hover:border-emerald-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Invested</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-emerald-500">{formatCurrency(totalPaid)}</div>
            <div className="flex flex-col gap-0.5 mt-1">
              <p className="text-xs text-muted-foreground">Across all paid subscriptions</p>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                Saved 60% from the original retail price
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Unpaid / Pending Billing */}
        <Card className="bg-card/35 backdrop-blur-md border border-border/10 shadow-soft hover:-translate-y-1 hover:border-amber-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pending Dues</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <CreditCard className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-amber-500">{formatCurrency(totalPendingAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1">{pendingInvoicesCount} invoices awaiting payment</p>
          </CardContent>
        </Card>

        {/* KPI 4: Support / Pending Enquiries */}
        <Card className="bg-card/35 backdrop-blur-md border border-border/10 shadow-soft hover:-translate-y-1 hover:border-brand-soft/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pending Requests</CardTitle>
            <div className="p-2 bg-brand-soft/20 rounded-xl">
              <MessageSquare className="h-4 w-4 text-brand dark:text-gold" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{pendingSupportCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting admin moderation</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Shortcuts */}
      <div className="relative z-10 bg-gradient-soft border border-border/10 p-6 md:p-8 rounded-3xl shadow-elegant">
        <h3 className="text-lg font-bold text-foreground mb-4">Quick Client Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link href="/clients/enquiries" className="group">
            <div className="h-full bg-card/50 hover:bg-card border border-border/10 hover:border-brand/40 p-5 rounded-2xl transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="p-2.5 bg-brand-soft/20 text-brand dark:text-gold rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-foreground group-hover:text-brand dark:group-hover:text-gold transition-colors">Request Subscription</h4>
                <p className="text-xs text-muted-foreground mt-1">Submit inquiries for ChatGPT Plus, Cursor, Sales Nav, and custom tools.</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand dark:text-gold mt-4">
                Proceed to request <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href="/clients/invoices" className="group">
            <div className="h-full bg-card/50 hover:bg-card border border-border/10 hover:border-brand/40 p-5 rounded-2xl transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-foreground group-hover:text-emerald-500 transition-colors">Billing & Invoices</h4>
                <p className="text-xs text-muted-foreground mt-1">Access billing logs, complete pending invoices, or print historical invoices.</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 mt-4">
                View billing history <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href="/clients/enquiries" className="group">
            <div className="h-full bg-card/50 hover:bg-card border border-border/10 hover:border-brand/40 p-5 rounded-2xl transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-foreground group-hover:text-amber-500 transition-colors">Support Center</h4>
                <p className="text-xs text-muted-foreground mt-1">Get updates on your requested services and contact administrative support.</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 mt-4">
                Open support desk <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Grid: Split Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Side: Recent Invoices */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-brand dark:text-gold" />
              Recent Invoices
            </h3>
            <Link href="/clients/invoices">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-brand dark:text-gold hover:text-brand/80 gap-1 rounded-xl">
                View All <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-5 shadow-elegant">
            {invoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground opacity-30 mb-2" />
                <p className="text-sm">No billing records found.</p>
                <p className="text-xs text-muted-foreground mt-0.5">Purchased items will generate invoices here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/10 pb-2 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                      <th className="py-3 px-2">Invoice #</th>
                      <th className="py-3 px-2">Date</th>
                      <th className="py-3 px-2">Items</th>
                      <th className="py-3 px-2">Total</th>
                      <th className="py-3 px-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10 text-sm">
                    {invoices.slice(0, 4).map((invoice) => (
                      <tr key={invoice._id} className="hover:bg-soft/20 dark:hover:bg-soft/10 transition-colors">
                        <td className="py-3.5 px-2 font-mono font-medium text-xs text-foreground">
                          {invoice.invoice_number}
                        </td>
                        <td className="py-3.5 px-2 text-muted-foreground text-xs">
                          {formatDate(invoice.purchase_date)}
                        </td>
                        <td className="py-3.5 px-2 max-w-[180px] truncate text-foreground font-medium text-xs">
                          {invoice.items.map(i => i.service_name).join(', ')}
                        </td>
                        <td className="py-3.5 px-2 text-foreground font-semibold text-xs">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          {renderInvoiceStatusBadge(invoice.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Recent Enquiries */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <MessageSquare className="h-4.5 w-4.5 text-brand dark:text-gold" />
              Recent Enquiries & Tickets
            </h3>
            <Link href="/clients/enquiries">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-brand dark:text-gold hover:text-brand/80 gap-1 rounded-xl">
                View All <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-5 shadow-elegant">
            {enquiries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-center">
                <MessageSquare className="h-10 w-10 text-muted-foreground opacity-30 mb-2" />
                <p className="text-sm">No active enquiries found.</p>
                <p className="text-xs text-muted-foreground mt-0.5">Need a utility? Submit your first support ticket.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {enquiries.slice(0, 3).map((enquiry) => (
                  <div 
                    key={enquiry._id} 
                    className="p-3.5 rounded-2xl bg-card/40 border border-border/10 hover:border-brand-soft/30 hover:bg-card/60 transition-all flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-xs text-foreground">
                          {enquiry.subscription}
                        </h4>
                        <span className="text-[10px] text-muted-foreground">
                          Submitted: {formatDate(enquiry.createdAt)}
                        </span>
                      </div>
                      {renderEnquiryStatusBadge(enquiry.status)}
                    </div>
                    {enquiry.message && (
                      <p className="text-xs text-muted-foreground line-clamp-1 italic bg-background/50 p-2 rounded-lg">
                        &quot;{enquiry.message}&quot;
                      </p>
                    )}
                    {enquiry.notes && (
                      <div className="text-[10px] font-medium text-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/10">
                        <span className="font-bold">Admin response:</span> {enquiry.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
