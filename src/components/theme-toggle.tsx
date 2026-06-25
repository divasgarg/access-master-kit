import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, getStoredTheme, resolveTheme, setTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setLocal] = useState<Theme>("dark");

  useEffect(() => {
    const t = getStoredTheme();
    setLocal(t);
    applyTheme(t);
  }, []);

  const resolved = resolveTheme(theme);
  const toggle = () => {
    const next: Theme = resolved === "dark" ? "light" : "dark";
    setLocal(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${resolved === "dark" ? "light" : "dark"} mode`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
    >
      {resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
