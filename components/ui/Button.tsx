import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-[transform,opacity,background-color,border-color] duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-55 disabled:active:scale-100";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-strong text-on-brand hover:opacity-90",
  secondary: "bg-blue-strong text-on-blue hover:opacity-90",
  ghost: "border border-line text-ink hover:bg-surface-2",
  danger: "bg-danger text-on-danger hover:opacity-90",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

/** Klassen für Buttons – auch auf <Link> nutzbar. */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra = ""
): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <button
      className={buttonClasses(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      )}
      {children}
    </button>
  );
}
