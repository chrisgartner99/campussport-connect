import { TriangleAlert } from "lucide-react";

export default function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="flex items-center gap-2 rounded-lg bg-danger-soft px-3 py-2 text-sm text-on-danger-soft"
    >
      <TriangleAlert size={16} className="shrink-0" aria-hidden />
      {message}
    </p>
  );
}
