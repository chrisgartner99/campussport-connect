import type { SelectHTMLAttributes } from "react";
import { fieldClasses } from "./Input";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export default function Select({
  label,
  name,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        className={`${fieldClasses} appearance-none bg-[length:1.1em] pr-8 ${className}`.trim()}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23576570' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.6rem center",
        }}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}
