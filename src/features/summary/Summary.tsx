import { useEffect, useState } from "react";
import { advisor } from "../../advisor/index.ts";
import { DataTools } from "../../components/DataTools.tsx";
import { formatMoney, formatPercent, summarize } from "../../engine/index.ts";
import { useSettings, useSnapshot } from "../../store/store.ts";
import type { Suggestion } from "../../types/index.ts";

export function Summary() {
  const snapshot = useSnapshot();
  const settings = useSettings();
  const { currency } = settings;
  const b = summarize(snapshot);
  const [advice, setAdvice] = useState<Suggestion[]>([]);

  useEffect(() => {
    let live = true;
    advisor.getAdvice(snapshot, settings).then((a) => live && setAdvice(a));
    return () => { live = false; };
  }, [snapshot, settings]);

  const buckets = [
    { name: "Needs", share: b.needsShare, target: 0.5, note: "Fixed expenses and EMIs" },
    { name: "Wants", share: b.wantsShare, target: 0.3, note: "Variable expenses" },
    { name: "Savings", share: b.savingsShare, target: 0.2, note: "What is left over" },
  ];

  return (
    <>
      <section className="panel hero">
        <p className="muted">Left to save each month</p>
        <p className={`big num ${b.monthlySavings < 0 ? "neg" : ""}`}>{formatMoney(b.monthlySavings, currency)}</p>
        <p className="muted">
          {formatMoney(b.totalIncome, currency)} income − {formatMoney(b.totalSpending, currency)} expenses and EMIs
        </p>
      </section>

      <section className="panel">
        <h2>Where your income goes</h2>
        {buckets.map((x) => (
          <div key={x.name} className="bucket">
            <div className="bucket-head">
              <span>{x.name} <small>{x.note}</small></span>
              <span className="num">{formatPercent(x.share)} <small>of {formatPercent(x.target)} target</small></span>
            </div>
            <div className="bar"><div style={{ width: `${Math.min(100, Math.max(0, x.share * 100))}%` }} /></div>
          </div>
        ))}
      </section>

      <section className="panel">
        <h2>Suggestions</h2>
        {advice.length === 0 ? (
          <p className="empty">Add your income and expenses to get suggestions.</p>
        ) : (
          <ul className="advice">
            {advice.map((a) => <li key={a.id} className={a.severity}>{a.message}</li>)}
          </ul>
        )}
        <p className="muted">Estimates for learning, not financial advice.</p>
      </section>

      <DataTools />
    </>
  );
}
