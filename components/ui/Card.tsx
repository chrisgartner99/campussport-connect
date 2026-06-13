import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  /** Hebt die Karte bei Hover leicht an (für klickbare Karten). */
  interactive?: boolean;
};

export default function Card({
  interactive = false,
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <div
      className={`rounded-card border border-line bg-surface p-5 shadow-card ${
        interactive
          ? "transition-[border-color,box-shadow] hover:border-brand/60 hover:shadow-pop"
          : ""
      } ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
