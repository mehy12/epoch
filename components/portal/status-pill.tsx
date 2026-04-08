interface StatusPillProps {
  tone: "success" | "warning" | "neutral";
  label: string;
}

const toneClasses: Record<StatusPillProps["tone"], string> = {
  success: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  warning: "bg-amber-50 text-amber-900 ring-amber-200",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
};

const toneDotClasses: Record<StatusPillProps["tone"], string> = {
  success: "bg-emerald-600",
  warning: "bg-amber-600",
  neutral: "bg-slate-500",
};

export default function StatusPill({ tone, label }: StatusPillProps) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${toneClasses[tone]}`}>
      <span className={`h-2 w-2 rounded-full ${toneDotClasses[tone]}`} aria-hidden="true" />
      {label}
    </span>
  );
}
