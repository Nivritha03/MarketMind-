import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Megaphone,
  Mail,
  TrendingUp,
  SmilePlus,
  Target,
  Shield,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/campaigns", label: "Campaign Generator", icon: Megaphone },
  { path: "/pitch", label: "Sales Pitch", icon: Mail },
  { path: "/insights", label: "Market Insights", icon: TrendingUp },
  { path: "/sentiment", label: "Sentiment Analysis", icon: SmilePlus },
  { path: "/leads", label: "Lead Scoring", icon: Target },
  { path: "/competitor-analysis", label: "Competitor Analysis", icon: Shield }, // ✅ ADDED
  { path: "/admin", label: "Admin Panel", icon: Shield },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AppSidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col bg-sidebar border-r border-sidebar-border"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-lg font-bold text-foreground whitespace-nowrap overflow-hidden"
            >
              MarketMind
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
                ${isActive
                  ? "bg-sidebar-accent text-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-sidebar-accent glow-indigo"
                  transition={{ duration: 0.3 }}
                />
              )}
              <item.icon className="w-5 h-5 relative z-10 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="relative z-10 whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-12 border-t border-sidebar-border text-sidebar-foreground hover:text-foreground transition-colors"
      >
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronLeft className="w-5 h-5" />
        </motion.div>
      </button>
    </motion.aside>
  );
}