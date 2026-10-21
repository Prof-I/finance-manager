import { useState } from "react";
import { features } from "./features/registry.ts";

export default function App() {
  const [active, setActive] = useState(features[0].id);
  const Current = (features.find((f) => f.id === active) ?? features[0]).component;

  return (
    <div className="app">
      <header className="top">
        <h1>Finance Manager</h1>
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
