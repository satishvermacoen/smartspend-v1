"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, User as UserIcon, Settings, IndianRupee, Link as LinkIcon, ToggleLeft, ToggleRight, Plus, Clipboard, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UserProfile {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  source: string;
  status: string;
  createdAt: string;
}

interface ReferralCode {
  _id: string;
  code: string;
  name?: string;
  is_active: boolean;
  reward: { type: string; cashAmount: number; subscriptionMonths: number };
}

export default function AdminUserProfile() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"personal" | "earnings" | "settings">("personal");
  const [loading, setLoading] = useState(true);
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({ purchase: 0, sale: 0, commission: 0, cashEarned: 0 });
  const [codes, setCodes] = useState<ReferralCode[]>([]);

  const [newLinkName, setNewLinkName] = useState("");
  const [creatingCode, setCreatingCode] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/referrals/users/${id}`);
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setStats(data.stats);
        setCodes(data.referralCodes || []);
      } else {
        toast.error(data.error || "Failed to load user profile");
        router.push("/admin/partner");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    const loadProfile = async () => {
      await fetchProfile();
    };
    loadProfile();
  }, [fetchProfile]);

  const handleToggleCodeStatus = async (codeId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/referrals/codes/${codeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      if (res.ok) {
        toast.success(`Referral code status updated.`);
        fetchProfile();
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to toggle code status.");
    }
  };

  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkName) {
      toast.error("Please provide a name for this referral link.");
      return;
    }
    setCreatingCode(true);
    try {
      const res = await fetch("/api/admin/referrals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkName: newLinkName,
          userId: id
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Referral link generated successfully!");
        setNewLinkName("");
        fetchProfile();
      } else {
        throw new Error(data.error || "Creation failed.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create code.");
    } finally {
      setCreatingCode(false);
    }
  };

  const handleCopyLink = (code: string) => {
    const link = `${window.location.origin}/join/${code}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

  const handleWhatsAppShare = (code: string) => {
    const link = `${window.location.origin}/join/${code}`;
    const message = encodeURIComponent(`Here is the invite link: ${link}`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  if (loading || !user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
        <span>Loading Profile...</span>
      </div>
    );
  }

  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "N/A";

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 bg-background relative overflow-y-auto">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-15%] w-[45%] h-[45%] bg-brand/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <Link href="/admin/partner" className="inline-flex items-center gap-2 text-sm text-brand hover:underline font-semibold mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to Partners
          </Link>
          <h2 className="text-3xl font-display font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserIcon className="h-8 w-8 text-brand" /> {name}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 font-mono">
            ID: {user._id} | Status: {user.status}
          </p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-border/10 relative z-10">
        {(["personal", "earnings", "settings"] as const).map(tab => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold text-sm capitalize transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === tab
                ? "border-brand text-brand font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "personal" && <UserIcon className="h-4 w-4" />}
            {tab === "earnings" && <IndianRupee className="h-4 w-4" />}
            {tab === "settings" && <Settings className="h-4 w-4" />}
            {tab}
          </Button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "personal" && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-6 md:grid-cols-2"
            >
              <div className="bg-card/25 backdrop-blur-xl border border-border/10 rounded-2xl p-6 shadow-elegant">
                <h3 className="font-bold text-base mb-4 text-foreground">Contact Information</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-border/10 pb-2">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-semibold text-foreground">{user.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/10 pb-2">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-semibold text-foreground">{user.phone || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/10 pb-2">
                    <span className="text-muted-foreground">Registration Source</span>
                    <span className="font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-full text-xs">{user.source}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/10 pb-2">
                    <span className="text-muted-foreground">Joined</span>
                    <span className="font-semibold text-foreground">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "earnings" && (
            <motion.div
              key="earnings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-6 md:grid-cols-3"
            >
              <div className="bg-card/25 backdrop-blur-xl border border-border/10 rounded-2xl p-6 shadow-elegant flex flex-col justify-center items-center text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Sales Driven</p>
                <h3 className="text-3xl font-display font-bold text-emerald-400">₹{stats.sale}</h3>
                <p className="text-[10px] text-muted-foreground mt-2">Revenue generated by this user&apos;s referrals</p>
              </div>

              <div className="bg-card/25 backdrop-blur-xl border border-border/10 rounded-2xl p-6 shadow-elegant flex flex-col justify-center items-center text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Commissions</p>
                <h3 className="text-3xl font-display font-bold text-brand">₹{stats.commission}</h3>
                <p className="text-[10px] text-muted-foreground mt-2">Total earnings from successful referrals</p>
              </div>

              <div className="bg-card/25 backdrop-blur-xl border border-border/10 rounded-2xl p-6 shadow-elegant flex flex-col justify-center items-center text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Personal Purchases</p>
                <h3 className="text-3xl font-display font-bold text-foreground">₹{stats.purchase}</h3>
                <p className="text-[10px] text-muted-foreground mt-2">Total value of products bought by this user</p>
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="bg-card/25 backdrop-blur-xl border border-border/10 rounded-2xl p-6 shadow-elegant">
                <h3 className="font-bold text-base mb-4 text-foreground flex items-center gap-2"><LinkIcon className="h-4 w-4 text-brand" /> Generate New Referral Link</h3>
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
                    disabled={creatingCode || codes.length >= 5}
                    className="w-full sm:w-auto h-11 px-6 bg-gradient-brand text-primary-foreground font-bold rounded-xl text-sm hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {creatingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Generate Link</>}
                  </Button>
                </form>
                {codes.length >= 5 && <p className="text-xs text-destructive mt-2 font-semibold">User has reached the maximum of 5 referral links.</p>}
              </div>

              <div className="bg-card/30 backdrop-blur-xl border border-border/10 rounded-2xl shadow-elegant overflow-hidden">
                <div className="p-5 border-b border-border/5 bg-soft/10">
                  <h3 className="font-bold text-base text-foreground">User&apos;s Referral Links</h3>
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
                          <th className="px-6 py-4">Link</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Toggle</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/10">
                        {codes.map(c => (
                          <tr key={c._id} className="hover:bg-soft/5">
                            <td className="px-6 py-4 font-semibold text-foreground">{c.name || "N/A"}</td>
                            <td className="px-6 py-4 font-mono text-brand font-bold">{c.code}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => handleCopyLink(c.code)}
                                  className="h-7 px-2 rounded-lg border border-border/15 bg-soft/10 text-muted-foreground hover:text-foreground hover:bg-soft transition-all inline-flex items-center gap-1 text-xs"
                                >
                                  <Clipboard className="h-3 w-3" /> Copy
                                </Button>
                                <Button
                                  onClick={() => handleWhatsAppShare(c.code)}
                                  className="h-7 px-2 rounded-lg border border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all inline-flex items-center gap-1 text-xs"
                                >
                                  <MessageCircle className="h-3 w-3" /> WhatsApp
                                </Button>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {c.is_active ? (
                                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">Active</span>
                              ) : (
                                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-muted text-muted-foreground border border-border/10">Inactive</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button
                                onClick={() => handleToggleCodeStatus(c._id, c.is_active)}
                                className="h-8 w-8 rounded-lg border border-border/15 inline-flex items-center justify-center hover:bg-soft transition-all text-foreground cursor-pointer"
                                title="Toggle Active Status"
                              >
                                {c.is_active ? <ToggleRight className="h-5 w-5 text-brand" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
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
