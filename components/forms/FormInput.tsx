import type { InputHTMLAttributes } from "react";

type Props = {
  label: string;
  name: string;
  /** Optionaler Hinweistext unter dem Eingabefeld. */
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function FormInput({ label, name, hint, ...rest }: Props) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        {...rest}
      />
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}
