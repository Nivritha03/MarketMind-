import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Copy, Download, Loader2 } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { generatePitch } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function SalesPitch() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!product || !audience) return toast({ title: "Please fill all fields", variant: "destructive" });
    setLoading(true);
    const data = await generatePitch(product, audience);
    setResult(data);
    setLoading(false);
  };

  const inputClass = "w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Mail className="w-6 h-6 text-accent" />
          Sales Pitch Generator
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Generate personalized sales pitches with AI.</p>
      </motion.div>

      <GlassCard gradient="indigo">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Product</label>
            <input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g., CRM Software" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Audience</label>
            <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., Sales managers" className={inputClass} />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={loading}
          className="gradient-btn px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          {loading ? "Generating..." : "Generate Pitch"}
        </motion.button>
      </GlassCard>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard gradient="amber">
              {/* Email preview */}
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-muted/30 px-5 py-3 border-b border-border">
                  <p className="text-xs text-muted-foreground">Subject</p>
                  <p className="text-sm font-semibold text-foreground">{result.subject_line}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{result.pitch}</p>
                </div>
                <div className="bg-muted/20 px-5 py-3 border-t border-border flex items-center justify-between">
                  <motion.button whileHover={{ scale: 1.02 }} className="gradient-btn px-4 py-2 rounded-lg text-xs font-semibold">
                    {result.call_to_action}
                  </motion.button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { navigator.clipboard.writeText(result.pitch); toast({ title: "Copied!" }); }}
                      className="p-2 rounded-lg bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([`Subject: ${result.subject_line}\n\n${result.pitch}`], { type: "text/plain" });
                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(blob);
                        a.download = "sales-pitch.txt";
                        a.click();
                      }}
                      className="p-2 rounded-lg bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
