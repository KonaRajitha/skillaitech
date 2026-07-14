import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

function readInitial(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem("skillai-theme") as Theme | null;
  return saved === "light" || saved === "dark" ? saved : "dark";
}

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const t = readInitial();
    setTheme(t);
    apply(t);
    setHydrated(true);
  }, []);

  const update = (t: Theme) => {
    setTheme(t);
    apply(t);
    try {
      window.localStorage.setItem("skillai-theme", t);
    } catch { /* ignore */ }
  };

  const toggle = () => update(theme === "dark" ? "light" : "dark");

  return { theme, toggle, setTheme: update, hydrated };
}
