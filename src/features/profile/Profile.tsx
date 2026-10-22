import type { ChangeEvent } from "react";
import { Field, toAmount } from "../../components/Field.tsx";
import { CURRENCIES, currencySymbol } from "../../engine/index.ts";
import { update, updateSettings, useSettings, useSnapshot } from "../../store/store.ts";
import type { CurrencyCode } from "../../types/index.ts";

export function Profile() {
  const { income } = useSnapshot();
  const { currency } = useSettings();
  const symbol = currencySymbol(currency);

  const set = (key: "salary" | "other") => (e: ChangeEvent<HTMLInputElement>) => {
    const n = toAmount(e.target.value) ?? 0;
    update((s) => ({ ...s, income: { ...s.income, [key]: n } }));
  };

  return (
    <section className="panel">
      <h2>Monthly income</h2>
      <div className="row">
        <Field label={`Salary (${symbol}, after tax)`} type="number" min="0" value={income.salary || ""} onChange={set("salary")} />
        <Field label={`Other income (${symbol})`} type="number" min="0" value={income.other || ""} onChange={set("other")} />
      </div>
      <div className="row">
        <label className="field">
          <span>Display currency</span>
          <select value={currency} onChange={(e) => updateSettings({ currency: e.target.value as CurrencyCode })}>
            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
              <option key={c} value={c}>{CURRENCIES[c].label}</option>
            ))}
          </select>
          <small>Changes how amounts are shown. Existing amounts are not converted.</small>
        </label>
      </div>
    </section>
  );
}
