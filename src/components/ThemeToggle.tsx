import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle, hydrated } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/60 text-foreground/80 hover:text-foreground hover:bg-card transition ${className}`}
    >
      {hydrated && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
