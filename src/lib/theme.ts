import { useState, useEffect, useCallback } from "react";

export type Theme = "dark" | "light";

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = localStorage.getItem("aiel_theme") as Theme | null;
    if (saved === "light" || saved === "dark") return saved;
    if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  } catch (_) {}
  return "dark";
}

export function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("aiel_theme", theme);
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    } else {
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    }
    window.dispatchEvent(new CustomEvent("aiel:theme-change", { detail: theme }));
  } catch (_) {}
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.classList.contains("light") ? "light" : "dark";
    setThemeState(current);

    const handleThemeChange = (e: Event) => {
      const detail = (e as CustomEvent<Theme>).detail;
      if (detail === "light" || detail === "dark") {
        setThemeState(detail);
      }
    };

    window.addEventListener("aiel:theme-change", handleThemeChange);
    return () => window.removeEventListener("aiel:theme-change", handleThemeChange);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setThemeState(next);
    applyTheme(next);
  }, [theme]);

  return { theme, toggleTheme, setTheme: applyTheme };
}
