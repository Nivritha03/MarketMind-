import { useState } from "react";
import { motion } from "framer-motion";
import { getCompetitorAnalysis } from "../lib/api";
import { TrendingUp, Target, ShieldCheck, Zap } from "lucide-react";

type CompetitorResult = {
  strengths: string[];
  weaknesses: string[];
  differentiation_strategy: string;
  positioning_angle: string;
};

export default function CompetitorAnalysis() {
  const [competitor, setCompetitor] = useState("");
  const [industry, setIndustry] = useState("");
  const [result, setResult] = useState<CompetitorResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!competitor || !industry) return;
    setLoading(true);
    const data = await getCompetitorAnalysis(competitor, industry);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-indigo-500" />
          Competitor Intelligence
        </h1>
        <p className="text-muted-foreground mt-2">
          AI-powered strategic competitor positioning engine.
        </p>
      </motion.div>

      {/* Input Card */}
      <div className="p-6 rounded-2xl bg-card shadow-lg border border-border">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            placeholder="Competitor Name (e.g. HubSpot)"
            value={competitor}
            onChange={(e) => setCompetitor(e.target.value)}
            className="px-4 py-3 rounded-xl bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <input
            placeholder="Industry (e.g. Marketing SaaS)"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="px-4 py-3 rounded-xl bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <button
          onClick={handleAnalyze}
          className="w-full md:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
        >
          {loading ? "Analyzing..." : "Analyze Competitor"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Strengths */}
          <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/30 shadow">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-green-400">
              <TrendingUp className="w-5 h-5" />
              Strengths
            </h2>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="text-sm">
                  • {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 shadow">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-red-400">
              <Target className="w-5 h-5" />
              Weaknesses
            </h2>
            <ul className="space-y-2">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="text-sm">
                  • {w}
                </li>
              ))}
            </ul>
          </div>

          {/* Differentiation Strategy */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 shadow">
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2 text-indigo-400">
              <Zap className="w-5 h-5" />
              Differentiation Strategy
            </h2>
            <p className="text-sm leading-relaxed">
              {result.differentiation_strategy}
            </p>
          </div>

          {/* Positioning */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-purple-500/10 border border-purple-500/30 shadow">
            <h2 className="font-semibold text-lg mb-3 text-purple-400">
              Positioning Angle
            </h2>
            <p className="text-sm leading-relaxed">
              {result.positioning_angle}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}