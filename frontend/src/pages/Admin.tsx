import { motion } from "framer-motion";
import { Shield, Users, Activity } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const users = [
  { name: "Alex Johnson", role: "Admin", status: "Active" },
  { name: "Sarah Chen", role: "Marketing", status: "Active" },
  { name: "James Wilson", role: "Sales", status: "Active" },
  { name: "Maria Garcia", role: "Analyst", status: "Inactive" },
  { name: "David Park", role: "Marketing", status: "Active" },
];

const apiData = [
  { day: "Mon", calls: 1200 },
  { day: "Tue", calls: 1800 },
  { day: "Wed", calls: 2400 },
  { day: "Thu", calls: 2100 },
  { day: "Fri", calls: 2800 },
  { day: "Sat", calls: 900 },
  { day: "Sun", calls: 600 },
];

const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 24000 },
  { month: "Apr", revenue: 22000 },
  { month: "May", revenue: 31000 },
  { month: "Jun", revenue: 38000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 text-sm">
      <p className="text-foreground font-medium">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="text-xs">{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function Admin() {
  const statusBadge = (status: string) =>
    status === "Active"
      ? "bg-success/20 text-success"
      : "bg-muted/30 text-muted-foreground";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Shield className="w-6 h-6 text-accent" />
          Admin Panel
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage users and monitor platform usage.</p>
      </motion.div>

      <GlassCard gradient="indigo" hover={false}>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">User Management</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Role", "Status"].map((h) => (
                  <th key={h} className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 text-foreground font-medium">{u.name}</td>
                  <td className="py-3 px-3 text-muted-foreground">{u.role}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(u.status)}`}>{u.status}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard gradient="emerald" hover={false}>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-success" />
            <h3 className="text-sm font-semibold text-foreground">API Calls per Day</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={apiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="calls" stroke="#34d399" strokeWidth={2} dot={{ fill: "#34d399", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard gradient="amber" hover={false}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
}
