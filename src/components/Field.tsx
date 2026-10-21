import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Field({ label, ...rest }: Props) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...rest} />
    </label>
  );
}

/** Parses a form value into a non-negative number, or null if invalid. */
export function toAmount(value: string): number | null {
  const n = Number(value);
  return value.trim() !== "" && Number.isFinite(n) && n >= 0 ? n : null;
}
