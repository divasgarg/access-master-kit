// Pure-client password strength scoring. Not a cryptographic check —
// purely a UX signal. Returns 0–4 (very weak → very strong).
export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: "very weak" | "weak" | "fair" | "good" | "strong";
  hints: string[];
}

export function scorePassword(input: string): PasswordStrength {
  const hints: string[] = [];
  let score = 0;

  if (input.length >= 8) score++;
  else hints.push("at least 8 characters");

  if (input.length >= 14) score++;
  else if (input.length >= 8) hints.push("14+ characters is stronger");

  const hasLower = /[a-z]/.test(input);
  const hasUpper = /[A-Z]/.test(input);
  const hasNumber = /\d/.test(input);
  const hasSymbol = /[^a-zA-Z0-9]/.test(input);

  const variety = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  if (variety >= 3) score++;
  else hints.push("mix upper, lower, numbers, symbols");

  if (variety === 4 && input.length >= 12) score++;

  // Common-password penalty
  const common = /^(password|123456|qwerty|letmein|admin|welcome)/i;
  if (common.test(input)) {
    score = Math.max(0, score - 2);
    hints.unshift("avoid common passwords");
  }

  const labels = ["very weak", "weak", "fair", "good", "strong"] as const;
  const clamped = Math.max(0, Math.min(4, score)) as 0 | 1 | 2 | 3 | 4;
  return { score: clamped, label: labels[clamped], hints };
}
