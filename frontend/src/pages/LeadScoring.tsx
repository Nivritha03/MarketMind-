import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, Trash2, Loader2 } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { scoreLeads } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface Lead {
  name: string;
  engagement: number;
  budget: number;
}

const emptyLead: Lead = { name: "", engagement: 0, budget: 0 };

export default function LeadScoring() {
  const [leads, setLeads] = useState<Lead[]>([{ ...emptyLead }]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const updateLead = (i: number, field: keyof Lead, value: string | number) => {
    const updated = [...leads];
    (updated[i] as any)[field] = value;
    setLeads(updated);
  };

  const handleScore = async () => {
    if (leads.some((l) => !l.name)) return toast({ title: "Please fill name for all leads", variant: "destructive" });
    setLoading(true);
    const data = await scoreLeads(leads);
    setResults(Array.isArray(data) ? data : [data]);
    setLoading(false);
  };

  const inputClass = "w-full bg-muted/30 border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  const statusColors: Record<string, string> = {
    Hot: "bg-destructive/20 text-destructive glow-rose",
    Warm: "bg-warning/20 text-warning glow-amber",
    Cold: "bg-primary/20 text-primary glow-indigo",
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Target className="w-6 h-6 text-accent" />
          Lead Scoring
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Score and prioritize your leads with AI.</p>
      </motion.div>

      <GlassCard gradient="indigo">
        <div className="space-y-4">
          {leads.map((lead, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
              <div><label className="text-xs text-muted-foreground">Name</label><input value={lead.name} onChange={(e) => updateLead(i, "name", e.target.value)} placeholder="Name" className={inputClass} /></div>
              <div><label className="text-xs text-muted-foreground">Engagement Score</label><input type="number" value={lead.engagement} onChange={(e) => updateLead(i, "engagement", Number(e.target.value))} placeholder="0" className={inputClass} /></div>
              <div><label className="text-xs text-muted-foreground">Budget</label><input type="number" value={lead.budget} onChange={(e) => updateLead(i, "budget", Number(e.target.value))} placeholder="0" className={inputClass} /></div>
              <button onClick={() => setLeads(leads.filter((_, j) => j !== i))} className="p-2 rounded-lg text-muted-foreground hover:text-destructive transition-colors self-end" disabled={leads.length === 1}>
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={() => setLeads([...leads, { ...emptyLead }])} className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleScore} disabled={loading} className="gradient-btn px-6 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
            {loading ? "Scoring..." : "Score Leads"}
          </motion.button>
        </div>
      </GlassCard>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard hover={false}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Name", "Lead Score %", "Status", "AI Recommended Action"].map((h) => (
                        <th key={h} className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r: any, i: number) => {
                      const isTop = i === 0 && r.score >= 75;
                      return (
                        <motion.tr
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className={`border-b border-border/50 ${isTop ? "glow-rose" : ""}`}
                        >
                          <td className="py-3 px-3 text-foreground font-medium">{r.name}</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${r.score}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" />
                              </div>
                              <span className="text-foreground font-semibold">{r.score}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[r.status] || ""}`}>{r.status}</span>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground text-xs">{r.action}</td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
