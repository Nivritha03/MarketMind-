import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: "indigo" | "emerald" | "amber" | "rose" | "none";
}

const gradientBorders = {
  indigo: "before:bg-gradient-to-r before:from-indigo-500 before:to-purple-500",
  emerald: "before:bg-gradient-to-r before:from-emerald-500 before:to-teal-500",
  amber: "before:bg-gradient-to-r before:from-amber-500 before:to-orange-500",
  rose: "before:bg-gradient-to-r before:from-rose-500 before:to-pink-500",
  none: "",
};

export default function GlassCard({ children, className = "", hover = true, gradient = "none" }: GlassCardProps) {
  const hasGradient = gradient !== "none";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`
        glass rounded-2xl p-6 relative overflow-hidden
        ${hover ? "card-hover" : ""}
        ${hasGradient ? `before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] ${gradientBorders[gradient]}` : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
