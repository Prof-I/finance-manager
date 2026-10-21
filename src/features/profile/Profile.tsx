import type { ChangeEvent } from "react";
import { Field, toAmount } from "../../components/Field.tsx";
import { update, useSnapshot } from "../../store/store.ts";

export function Profile() {
  const { income } = useSnapshot();

  const set = (key: "salary" | "other") => (e: ChangeEvent<HTMLInputElement>) => {
    const n = toAmount(e.target.value) ?? 0;
    update((s) => ({ ...s, income: { ...s.income, [key]: n } }));
  };

  return (
    <section className="panel">
      <h2>Monthly income</h2>
      <div className="row">
        <Field label="Salary (₹, after tax)" type="number" min="0" value={income.salary || ""} onChange={set("salary")} />
        <Field label="Other income (₹)" type="number" min="0" value={income.other || ""} onChange={set("other")} />
      </div>
    </section>
  );
}
