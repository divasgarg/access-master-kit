// Tiny theme manager — persists preference and reflects it on <html>.
// Avoids next-themes to stay framework-light.

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "nak-theme";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "dark";
}

export function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const resolved = resolveTheme(theme);
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.classList.toggle("light", resolved === "light");
  root.style.colorScheme = resolved;
}

export function setTheme(theme: Theme) {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
}
