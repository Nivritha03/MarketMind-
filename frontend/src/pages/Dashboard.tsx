import { motion } from "framer-motion";
import { BarChart3, Users, TrendingUp, DollarSign } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";

const kpis = [
  { label: "Total Campaigns", value: 2847, icon: BarChart3, gradient: "indigo" as const, suffix: "" },
  { label: "Leads Generated", value: 12400, icon: Users, gradient: "emerald" as const, suffix: "" },
  { label: "Conversion Rate", value: 24.8, icon: TrendingUp, gradient: "amber" as const, suffix: "%", decimals: 1 },
  { label: "Revenue Estimate", value: 1.2, icon: DollarSign, gradient: "rose" as const, prefix: "$", suffix: "M", decimals: 1 },
];

const lineData = [
  { month: "Jan", campaigns: 180, leads: 800 },
  { month: "Feb", campaigns: 220, leads: 1100 },
  { month: "Mar", campaigns: 310, leads: 1400 },
  { month: "Apr", campaigns: 280, leads: 1200 },
  { month: "May", campaigns: 390, leads: 1800 },
  { month: "Jun", campaigns: 450, leads: 2200 },
];

const barData = [
  { quality: "Hot", count: 340, fill: "#f43f5e" },
  { quality: "Warm", count: 520, fill: "#f59e0b" },
  { quality: "Cold", count: 280, fill: "#6366f1" },
  { quality: "New", count: 180, fill: "#8b5cf6" },
];

const pieData = [
  { name: "Technology", value: 35 },
  { name: "Finance", value: 25 },
  { name: "Healthcare", value: 20 },
  { name: "Retail", value: 12 },
  { name: "Other", value: 8 },
];

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#64748b"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 text-sm">
      <p className="text-foreground font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="text-xs">{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back. Here's your overview.</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <GlassCard gradient={kpi.gradient}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{kpi.label}</p>
                  <AnimatedCounter end={kpi.value} suffix={kpi.suffix} prefix={kpi.prefix || ""} decimals={kpi.decimals || 0} />
                </div>
                <div className="p-2 rounded-xl bg-muted/30">
                  <kpi.icon className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard gradient="indigo" hover={false}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Campaign Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="colorCampaigns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="campaigns" stroke="#6366f1" fill="url(#colorCampaigns)" strokeWidth={2} />
              <Area type="monotone" dataKey="leads" stroke="#a855f7" fill="none" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard gradient="emerald" hover={false}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Lead Quality Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="quality" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <GlassCard gradient="amber" hover={false} className="max-w-md">
        <h3 className="text-sm font-semibold text-foreground mb-4">Industry Split</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
              {pieData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-2">
          {pieData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
              {d.name} ({d.value}%)
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
