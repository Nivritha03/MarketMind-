import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BarChart3, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "3s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">MarketMind</span>
        </div>
        <button
          onClick={() => navigate("/auth")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign In
        </button>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            AI-Powered Intelligence Platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight max-w-4xl mb-6"
        >
          <span className="text-foreground">MarketMind</span>
          <br />
          <span className="text-gradient-hero">Sales & Marketing</span>
          <br />
          <span className="text-foreground">Intelligence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
        >
          Generate campaigns, personalize pitches, score leads, and gain business insights — all in one intelligent platform.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/dashboard")}
          className="gradient-btn px-8 py-4 rounded-2xl text-lg font-semibold flex items-center gap-3 transition-all"
        >
          Go to Dashboard
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Floating dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-20 w-full max-w-5xl"
        >
          <div className="glass-strong rounded-2xl p-1 animate-float" style={{ animationDuration: "8s" }}>
            <div className="rounded-xl bg-card/50 p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { icon: BarChart3, label: "Campaigns", value: "2,847" },
                  { icon: Users, label: "Leads", value: "12.4K" },
                  { icon: Zap, label: "Conversion", value: "24.8%" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.15 }}
                    className="glass rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </div>
                    <div className="text-2xl font-bold text-foreground">{item.value}</div>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4 h-32">
                  <div className="text-sm text-muted-foreground mb-3">Performance</div>
                  <div className="flex items-end gap-1 h-16">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 1.5 + i * 0.05, duration: 0.5 }}
                        className="flex-1 rounded-sm bg-gradient-to-t from-indigo-500 to-purple-500 opacity-80"
                      />
                    ))}
                  </div>
                </div>
                <div className="glass rounded-xl p-4 h-32">
                  <div className="text-sm text-muted-foreground mb-3">Lead Quality</div>
                  <div className="flex items-end gap-1 h-16">
                    {[70, 55, 85, 60, 90, 45, 80, 65, 75, 50, 88, 72].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 1.5 + i * 0.05, duration: 0.5 }}
                        className="flex-1 rounded-sm bg-gradient-to-t from-emerald-500 to-teal-500 opacity-80"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
