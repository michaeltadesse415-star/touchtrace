
import { motion } from "motion/react";

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}

export function MetricCard({ label, value, detail, icon }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.16em] text-slate-500">
          {label}
        </span>
        <span className="text-cyan-400">{icon}</span>
      </div>
      <div className="mt-4 text-2xl font-semibold tracking-tight text-white">
        {value}
      </div>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </motion.div>
  );
}
