import { useEffect, useState } from "react";
import { features } from "./features/registry.ts";

type Theme = "light" | "dark";
const THEME_KEY = "finance-manager-theme";

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* storage unavailable: fall back to system */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const [active, setActive] = useState(features[0].id);
  const Current = (features.find((f) => f.id === active) ?? features[0]).component;

  return (
    <div className="app">
      <header className="top">
        <div className="top-bar">
          <h1>Finance Manager</h1>
          <button type="button" className="secondary theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
        <nav aria-label="Sections">
          {features.map((f) => (
            <button key={f.id} className={f.id === active ? "tab active" : "tab"} aria-current={f.id === active} onClick={() => setActive(f.id)}>
              {f.title}
            </button>
          ))}
        </nav>
      </header>
      <main><Current /></main>
    </div>
  );
}
