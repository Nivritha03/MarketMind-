import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Loader2, Lightbulb, Rocket, Target, ArrowRight } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { getInsights } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function Insights() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!product || !audience) return toast({ title: "Please fill all fields", variant: "destructive" });
    setLoading(true);
    const data = await getInsights(product, audience);
    setResult(data);
    setLoading(false);
  };

  const inputClass = "w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-accent" />
          Market Insights
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Discover market trends and growth opportunities.</p>
      </motion.div>

      <GlassCard gradient="indigo">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Product</label>
            <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g., MarTech Platform" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Audience</label>
            <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Enterprise marketing teams" className={inputClass} />
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGenerate} disabled={loading} className="gradient-btn px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
          {loading ? "Analyzing..." : "Get Insights"}
        </motion.button>
      </GlassCard>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard gradient="emerald">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-success" />
                <h3 className="text-sm font-semibold text-foreground">Market Trends</h3>
              </div>
              <ul className="space-y-3">
                {result.market_trends?.map((t: string, i: number) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-success shrink-0" />
                    {t}
                  </motion.li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard gradient="amber">
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="w-5 h-5 text-warning" />
                <h3 className="text-sm font-semibold text-foreground">Growth Opportunities</h3>
              </div>
              <ul className="space-y-3">
                {result.growth_opportunities?.map((t: string, i: number) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ArrowRight className="w-3.5 h-3.5 mt-0.5 text-warning shrink-0" />
                    {t}
                  </motion.li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard gradient="indigo" className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Recommended Strategy</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{result.recommended_strategy}</p>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Next Best Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {result.next_best_actions?.map((a: string, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-2 glass rounded-lg px-3 py-2 text-sm text-foreground">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">{i + 1}</span>
                    {a}
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
