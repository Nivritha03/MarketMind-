import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Copy, RefreshCw, Loader2 } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { generateCampaign } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function Campaigns() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);
  

  const handleGenerate = async () => {
    const res = await generateCampaign(product, audience);
    setCampaign(res);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(JSON.stringify(campaign, null, 2));
    toast({ title: "Copied to clipboard!" });
  };

  const inputClass =
    "w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Megaphone className="w-6 h-6 text-accent" />
          Campaign Generator
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Generate AI-powered marketing campaigns.
        </p>
      </motion.div>

      <GlassCard gradient="indigo">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Product
            </label>
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="e.g., AI Analytics Platform"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Audience
            </label>
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g., B2B SaaS companies"
              className={inputClass}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={loading}
          className="gradient-btn px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Megaphone className="w-4 h-4" />
          )}
          {loading ? "Generating..." : "Generate Campaign"}
        </motion.button>
      </GlassCard>

      {campaign && (
        <div className="mt-6 p-4 bg-gray-900 rounded text-white whitespace-pre-wrap">
          {campaign.campaign}
        </div>
      )}
    </div>
  );
}
