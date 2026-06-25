import { CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

export interface SecurityFactor {
  label: string;
  ok: boolean;
  hint?: string;
}

export function SecurityScoreCard({ factors }: { factors: SecurityFactor[] }) {
  const total = factors.length;
  const passed = factors.filter((f) => f.ok).length;
  const score = total === 0 ? 100 : Math.round((passed / total) * 100);
  const grade = score >= 90 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Fair" : "At risk";
  const color = score >= 90 ? "text-success" : score >= 70 ? "text-primary" : score >= 50 ? "text-warning" : "text-destructive";
  const ring = score >= 90 ? "ring-success/30" : score >= 70 ? "ring-primary/30" : score >= 50 ? "ring-warning/30" : "ring-destructive/30";

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-7 rounded-md bg-primary/10 ring-1 ring-primary/25 flex items-center justify-center">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="font-semibold text-sm">Security score</div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className={`h-16 w-16 rounded-full ring-2 ${ring} flex items-center justify-center font-display`}>
          <span className={`text-xl font-bold ${color}`}>{score}</span>
        </div>
        <div className="min-w-0">
          <div className={`font-display text-lg font-semibold ${color}`}>{grade}</div>
          <div className="text-xs text-muted-foreground font-mono">
            {passed}/{total} checks passed
          </div>
        </div>
      </div>
      <ul className="space-y-1.5">
        {factors.map((f) => (
          <li key={f.label} className="flex items-start gap-2 text-xs">
            {f.ok ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
            )}
            <div className="min-w-0">
              <div className={f.ok ? "text-muted-foreground" : "text-foreground"}>{f.label}</div>
              {!f.ok && f.hint && <div className="text-[11px] text-muted-foreground">{f.hint}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
