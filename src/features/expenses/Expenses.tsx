import { useState } from "react";
import { Field, toAmount } from "../../components/Field.tsx";
import { currencySymbol, formatMoney } from "../../engine/index.ts";
import { newId, update, useSettings, useSnapshot } from "../../store/store.ts";

export function Expenses() {
  const { expenses } = useSnapshot();
  const { currency } = useSettings();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [fixed, setFixed] = useState(true);

  function add() {
    const n = toAmount(amount);
    if (!category.trim() || n === null) return;
    update((s) => ({ ...s, expenses: [...s.expenses, { id: newId(), category: category.trim(), amount: n, fixed }] }));
    setCategory("");
    setAmount("");
  }

  return (
    <section className="panel">
      <h2>Monthly expenses</h2>
      <p className="muted">Enter whole categories such as rent or electricity, not single purchases.</p>
      <div className="row">
        <Field label="Category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Rent" />
        <Field label={`Amount (${currencySymbol(currency)})`} type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <label className="check">
          <input type="checkbox" checked={fixed} onChange={(e) => setFixed(e.target.checked)} /> Fixed every month
        </label>
        <button onClick={add}>Add expense</button>
      </div>

      {expenses.length === 0 ? (
        <p className="empty">No expenses yet. Add your rent to get started.</p>
      ) : (
        <ul className="list">
          {expenses.map((e) => (
            <li key={e.id}>
              <span>{e.category} <small>{e.fixed ? "fixed" : "variable"}</small></span>
              <span className="num">{formatMoney(e.amount, currency)}</span>
              <button className="link" onClick={() => update((s) => ({ ...s, expenses: s.expenses.filter((x) => x.id !== e.id) }))}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
