import NeuesTreffenForm from "./NeuesTreffenForm";

export default function TreffenNeuPage() {
  return (
    <section className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Neues Sporttreffen
        </h1>
        <p className="text-zinc-600">
          Lege ein Treffen an – du bist automatisch als Teilnehmer dabei.
        </p>
      </div>
      <NeuesTreffenForm />
    </section>
  );
}
