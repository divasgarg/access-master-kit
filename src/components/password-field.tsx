import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { scorePassword } from "@/lib/password";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  showStrength?: boolean;
  autoComplete?: string;
  required?: boolean;
  id?: string;
}

export function PasswordField({
  value,
  onChange,
  placeholder = "At least 8 characters",
  showStrength = false,
  autoComplete = "current-password",
  required = true,
  id,
}: Props) {
  const [visible, setVisible] = useState(false);
  const strength = showStrength ? scorePassword(value) : null;
  const barColor = ["bg-destructive", "bg-destructive/80", "bg-warning", "bg-success/80", "bg-success"][
    strength?.score ?? 0
  ];

  return (
    <div>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          id={id}
          type={visible ? "text" : "password"}
          required={required}
          minLength={8}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-10 py-2.5 rounded-md bg-background border border-border focus:border-primary outline-none text-sm"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </button>
      </div>
      {showStrength && value.length > 0 && strength && (
        <div className="mt-2">
          <div className="flex gap-1" role="meter" aria-valuemin={0} aria-valuemax={4} aria-valuenow={strength.score}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < Math.max(1, strength.score) ? barColor : "bg-border"
                }`}
              />
            ))}
          </div>
          <p className="mt-1.5 text-[11px] font-mono text-muted-foreground">
            Strength: <span className="text-foreground">{strength.label}</span>
            {strength.hints.length > 0 && <> — {strength.hints[0]}</>}
          </p>
        </div>
      )}
    </div>
  );
}
