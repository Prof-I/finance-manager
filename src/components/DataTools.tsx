import { useRef, useState } from "react";
import { emptySnapshot, parseSnapshot, replace, useSnapshot } from "../store/store.ts";

export function DataTools() {
  const snapshot = useSnapshot();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  function exportJson() {
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "finance-manager.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importJson(file: File) {
    try {
      replace(parseSnapshot(JSON.parse(await file.text())));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read that file.");
    }
  }

  return (
    <section className="panel">
      <h2>Your data</h2>
      <p className="muted">Everything is stored in this browser only. Export a backup or move it to another device.</p>
      <div className="row">
        <button onClick={exportJson}>Export JSON</button>
        <button className="secondary" onClick={() => fileRef.current?.click()}>Import JSON</button>
        <button className="danger" onClick={() => confirm("Delete all data?") && replace(emptySnapshot)}>Delete all data</button>
        <input ref={fileRef} type="file" accept="application/json" hidden
          onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
      </div>
      {error && <p role="alert" className="error">{error}</p>}
    </section>
  );
}
