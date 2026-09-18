export function Badge({
  children,
  tone = "gold",
}: {
  children: React.ReactNode;
  tone?: "gold" | "green" | "red" | "blue" | "slate";
}) {
  const tones: Record<string, string> = {
    gold: "bg-gold/10 text-gold border-gold/30",
    green: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
    red: "bg-red-500/10 text-red-600 border-red-500/30",
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    slate: "bg-white/5 text-ivory/60 border-white/10",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
