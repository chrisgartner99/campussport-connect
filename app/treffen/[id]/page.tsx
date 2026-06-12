export default async function TreffenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">
        Sporttreffen {id}
      </h1>
      <p className="text-zinc-600">
        Hier erscheint die Detailansicht eines Sporttreffens. (Platzhalter)
      </p>
    </section>
  );
}
