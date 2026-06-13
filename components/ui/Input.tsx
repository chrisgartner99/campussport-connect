import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const fieldClasses =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-brand focus:outline-none disabled:opacity-60";

export default function Input({
  label,
  name,
  hint,
  error,
  className = "",
  ...rest
}: Props) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        className={`${fieldClasses} ${error ? "border-danger" : ""} ${className}`.trim()}
        {...rest}
      />
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
