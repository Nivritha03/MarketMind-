import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SmilePlus, Loader2, Smile, Meh, Frown } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { analyzeSentiment } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function Sentiment() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!text) return toast({ title: "Please enter text", variant: "destructive" });
    setLoading(true);
    const data = await analyzeSentiment(text);
    setResult(data);
    setLoading(false);
  };

  const sentimentConfig: Record<string, { icon: any; color: string; bg: string; glow: string }> = {
    Positive: { icon: Smile, color: "text-success", bg: "bg-success/20", glow: "glow-emerald" },
    Neutral: { icon: Meh, color: "text-muted-foreground", bg: "bg-muted/30", glow: "" },
    Negative: { icon: Frown, color: "text-destructive", bg: "bg-destructive/20", glow: "glow-rose" },
  };

  const cfg = result ? sentimentConfig[result.sentiment] || sentimentConfig.Neutral : null;

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <SmilePlus className="w-6 h-6 text-accent" />
          Sentiment Analysis
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Analyze text sentiment with AI.</p>
      </motion.div>

      <GlassCard gradient="indigo">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Text to Analyze</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze sentiment..."
          rows={5}
          className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none mb-4"
        />
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAnalyze} disabled={loading} className="gradient-btn px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <SmilePlus className="w-4 h-4" />}
          {loading ? "Analyzing..." : "Analyze Sentiment"}
        </motion.button>
      </GlassCard>

      <AnimatePresence>
        {result && cfg && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className={cfg.glow}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl ${cfg.bg}`}>
                  <cfg.icon className={`w-8 h-8 ${cfg.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sentiment</p>
                  <span className={`text-xl font-bold ${cfg.color}`}>{result.sentiment}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="text-foreground font-semibold">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-muted/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
