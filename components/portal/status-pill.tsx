interface StatusPillProps {
  tone: "success" | "warning" | "neutral";
  label: string;
}

export default function StatusPill({ tone, label }: StatusPillProps) {
  return (
    <span className={`portal-pill portal-pill-${tone}`}>
      <span className="portal-pill-dot" aria-hidden="true" />
      {label}
    </span>
  );
}
