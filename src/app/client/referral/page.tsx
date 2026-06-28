"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Gift, 
  Copy, 
  Wallet, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Loader2, 
  MessageSquare,
  TrendingUp,
  UserCheck,
  Plus} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ReferralStats {
  sale: number;
  purchase: number;
  commission: number;
  cashEarned: number;
}

interface ReferralCode {
  _id: string;
  code: string;
  name: string;
  is_active: boolean;
}

export default function ClientReferralPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "links">("dashboard");
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<ReferralStats>({ sale: 0, purchase: 0, commission: 0, cashEarned: 0 });
  const [codes, setCodes] = useState<ReferralCode[]>([]);
  const [shareLinks, setShareLinks] = useState<{ referralLink: string; whatsapp: string; email: string; twitter: string } | null>(null);
  
  const [generatingCode, setGeneratingCode] = useState(false);
  const [newLinkName, setNewLinkName] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Get referral profile stats
      const profileRes = await fetch("/api/customer/referral/profile");
      const profileData = await profileRes.json();
      if (profileData.stats) {
        setStats(profileData.stats);
      }

      // 2. Get referral codes
      const codesRes = await fetch("/api/customer/referral/code");
      const codesData = await codesRes.json();
      if (codesData.referralCodes) {
        setCodes(codesData.referralCodes);
        
        // Fetch share links for the active code (or first)
        const linksRes = await fetch("/api/customer/referral/share-links");
        const linksData = await linksRes.json();
        if (linksData.shareLinks) {
          setShareLinks(linksData.shareLinks);
        }
      }
    } catch (err) {
      console.error("Failed to load customer referral page data:", err);
      toast.error("Error loading referral records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      fetchAllData();
    }, 0);
  }, [fetchAllData]);

  const handleGenerateCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newLinkName) {
      toast.error("Please provide a name for this referral link.");
      return;
    }
    setGeneratingCode(true);
    try {
      const res = await fetch("/api/customer/referral/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkName: newLinkName })
      });
      const data = await res.json();
      if (res.ok && data.referralCode) {
        toast.success(`Referral link "${data.referralCode.code}" generated successfully!`);
        setNewLinkName("");
        fetchAllData();
      } else {
        throw new Error(data.error || "Generation failed.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate code.");
    } finally {
      setGeneratingCode(false);
    }
  };

  const handleCopyLink = (code: string) => {
    const appUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const link = `${appUrl}/ref/${code}`;
    navigator.clipboard.writeText(link);
    setCopied(code);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading && codes.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
        <span>Loading referral dashboard...</span>
      </div>
    );
  }

  const activeCode = codes.find(c => c.is_active) || codes[0];

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 bg-background relative overflow-y-auto">
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-15%] w-[45%] h-[45%] bg-brand/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-gradient">
            Refer &amp; Earn Rewards
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Share SpendSmart with your network. Earn cash and free months.
          </p>
        </div>
        <Button
          onClick={fetchAllData}
          className="inline-flex items-center gap-2 rounded-xl border border-border/15 bg-card/45 backdrop-blur-md px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-card/70 transition-all cursor-pointer shadow-soft"
        >
          <RefreshCw className="h-4 w-4" />
          Sync Data
        </Button>
      </div>

      {/* Primary Referral Action */}
      {codes.length === 0 ? (
        <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 shadow-elegant">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-brand text-primary-foreground flex items-center justify-center shrink-0">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Generate Your First Referral Link</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Activate your personalized invite link and start earning today.</p>
            </div>
          </div>
          <form onSubmit={handleGenerateCode} className="flex gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="e.g. My Link"
              value={newLinkName}
              onChange={e => setNewLinkName(e.target.value)}
              className="px-4 py-2 rounded-xl bg-soft/30 border border-border/10 focus:outline-none"
            />
            <Button
              type="submit"
              disabled={generatingCode || !newLinkName}
              className="inline-flex h-11 items-center justify-center px-6 rounded-xl bg-gradient-brand text-primary-foreground font-bold hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              {generatingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
            </Button>
          </form>
        </div>
      ) : (
        <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-3xl p-6 sm:p-8 relative z-10 shadow-elegant flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-brand-soft/20 px-2.5 py-0.5 text-xs font-bold text-brand">
              <Sparkles className="h-3 w-3" /> Active Invite Link
            </span>
            <h3 className="font-display font-extrabold text-2xl">Share the savings, pocket the cash!</h3>
            <p className="text-sm text-muted-foreground">Invite friends. When they buy, you get paid automatically.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="flex items-center border border-border/15 bg-soft/30 rounded-xl px-4 py-3 justify-between w-full sm:w-64 font-mono font-bold text-foreground">
              <span>{activeCode?.code}</span>
              <Button 
                onClick={() => handleCopyLink(activeCode?.code || "")} 
                className="text-brand hover:text-gold transition-colors ml-4 cursor-pointer"
                title="Copy Invite Link"
              >
                {copied === activeCode?.code ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            {shareLinks && (
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold text-white px-5 shadow-soft transition-all"
              >
                <MessageSquare className="h-4 w-4" /> WhatsApp
              </a>
            )}
          </div>
        </div>
      )}

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <div className="bg-card/25 backdrop-blur-xl border border-border/10 rounded-2xl p-5 shadow-elegant flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Sales Driven</p>
            <h3 className="text-2xl font-bold font-display mt-2 text-emerald-400">₹{stats.sale}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-card/25 backdrop-blur-xl border border-border/10 rounded-2xl p-5 shadow-elegant flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Commissions</p>
            <h3 className="text-2xl font-bold font-display mt-2 text-brand">₹{stats.commission}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-card/25 backdrop-blur-xl border border-border/10 rounded-2xl p-5 shadow-elegant flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Personal Purchases</p>
            <h3 className="text-2xl font-bold font-display mt-2">₹{stats.purchase}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-card/25 backdrop-blur-xl border border-border/10 rounded-2xl p-5 shadow-elegant flex items-center justify-between bg-gradient-to-r from-brand/5 to-transparent">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cash Earned</p>
            <h3 className="text-2xl font-bold font-display text-brand mt-2">₹{stats.cashEarned}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border/10 relative z-10">
        {(["dashboard", "links"] as const).map(tab => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold text-sm capitalize transition-all border-b-2 cursor-pointer ${
              activeTab === tab
                ? "border-brand text-brand font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl shadow-elegant overflow-hidden p-8 text-center text-muted-foreground">
                <p>Welcome to your referral dashboard. Share your links to start generating sales and earning commissions.</p>
              </div>
            </motion.div>
          )}

          {activeTab === "links" && (
            <motion.div
              key="links"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-card/25 backdrop-blur-xl border border-border/10 rounded-2xl p-6 shadow-elegant">
                <h3 className="font-bold text-base mb-4 text-foreground flex items-center gap-2">Generate New Referral Link</h3>
                <form onSubmit={handleGenerateCode} className="flex flex-col sm:flex-row gap-4 items-end max-w-xl">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">Link Name</label>
                    <input
                      type="text"
                      placeholder="e.g. YouTube Promo"
                      value={newLinkName}
                      onChange={e => setNewLinkName(e.target.value)}
                      className="w-full bg-soft/30 border border-border/10 rounded-xl px-3 py-2.5 text-sm text-foreground focus:border-brand/40 focus:outline-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={generatingCode || codes.length >= 5}
                    className="w-full sm:w-auto h-11 px-6 bg-gradient-brand text-primary-foreground font-bold rounded-xl text-sm hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {generatingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Generate Link</>}
                  </Button>
                </form>
                {codes.length >= 5 && <p className="text-xs text-destructive mt-2 font-semibold">You have reached the maximum of 5 referral links.</p>}
              </div>

              <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl shadow-elegant overflow-hidden">
                <div className="p-5 border-b border-border/5 bg-soft/10">
                  <h3 className="font-bold text-base text-foreground">Your Active Links</h3>
                </div>
                {codes.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground text-sm">No referral links generated yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-border/15 bg-soft/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          <th className="px-6 py-4">Link Name</th>
                          <th className="px-6 py-4">Code</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/10">
                        {codes.map(c => (
                          <tr key={c._id} className="hover:bg-soft/5">
                            <td className="px-6 py-4 font-semibold text-foreground">{c.name || "N/A"}</td>
                            <td className="px-6 py-4 font-mono text-brand font-bold">{c.code}</td>
                            <td className="px-6 py-4">
                              {c.is_active ? (
                                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">Active</span>
                              ) : (
                                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-muted text-muted-foreground border border-border/10">Inactive</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button 
                                onClick={() => handleCopyLink(c.code)} 
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/10 hover:bg-soft transition-all text-xs font-semibold cursor-pointer"
                              >
                                {copied === c.code ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                Copy
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
