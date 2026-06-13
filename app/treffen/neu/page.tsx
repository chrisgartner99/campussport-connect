import Card from "@/components/ui/Card";
import NeuesTreffenForm from "./NeuesTreffenForm";

export default function TreffenNeuPage() {
  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Neues Sporttreffen
        </h1>
        <p className="text-muted">
          Lege ein Treffen an – du bist automatisch als Teilnehmer dabei.
        </p>
      </div>
      <Card>
        <NeuesTreffenForm />
      </Card>
    </section>
  );
}
