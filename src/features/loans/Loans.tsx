import { useState, type ChangeEvent } from "react";
import { Field, toAmount } from "../../components/Field.tsx";
import { buildAmortization, formatDuration, formatINR } from "../../engine/index.ts";
import { newId, update, useSnapshot } from "../../store/store.ts";

export function Loans() {
  const { loans } = useSnapshot();
  const [form, setForm] = useState({ name: "", principal: "", annualRate: "", emi: "" });
  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  function add() {
    const principal = toAmount(form.principal);
    const annualRate = toAmount(form.annualRate);
    const emi = toAmount(form.emi);
    if (!form.name.trim() || principal === null || annualRate === null || emi === null) return;
    update((s) => ({ ...s, loans: [...s.loans, { id: newId(), name: form.name.trim(), principal, annualRate, emi }] }));
    setForm({ name: "", principal: "", annualRate: "", emi: "" });
  }

  return (
    <section className="panel">
      <h2>Loans and EMIs</h2>
      <div className="row">
        <Field label="Loan name" value={form.name} onChange={set("name")} placeholder="Home loan" />
        <Field label="Outstanding principal (₹)" type="number" min="0" value={form.principal} onChange={set("principal")} />
        <Field label="Interest rate (% per year)" type="number" min="0" step="0.1" value={form.annualRate} onChange={set("annualRate")} />
        <Field label="Monthly EMI (₹)" type="number" min="0" value={form.emi} onChange={set("emi")} />
        <button onClick={add}>Add loan</button>
      </div>

      {loans.length === 0 && <p className="empty">No loans. Add one to see when you will be debt-free.</p>}

      {loans.map((loan) => {
        const rows = buildAmortization(loan.principal, loan.annualRate, loan.emi);
        const interest = rows.reduce((a, r) => a + r.interest, 0);
        return (
          <article key={loan.id} className="loan">
            <header>
              <h3>{loan.name}</h3>
              <button className="link" onClick={() => update((s) => ({ ...s, loans: s.loans.filter((l) => l.id !== loan.id) }))}>Remove</button>
            </header>
            {rows.length === 0 ? (
              <p className="error">This EMI does not cover the monthly interest, so the loan never gets paid off. Increase the EMI.</p>
            ) : (
              <p>
                Debt-free in <strong>{formatDuration(rows.length)}</strong>. Total interest <strong>{formatINR(interest)}</strong>.
              </p>
            )}
            {rows.length > 0 && (
              <details>
                <summary>Repayment schedule</summary>
                <div className="scroll">
                  <table>
                    <thead><tr><th>Month</th><th>Interest</th><th>Principal</th><th>Balance</th></tr></thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.month}>
                          <td>{r.month}</td>
                          <td className="num">{formatINR(r.interest)}</td>
                          <td className="num">{formatINR(r.principal)}</td>
                          <td className="num">{formatINR(r.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}
          </article>
        );
      })}
    </section>
  );
}
