import { getUpcomingMeetings } from "@/lib/meetings";
import TreffenList from "./TreffenList";

export default async function TreffenPage({
  searchParams,
}: {
  searchParams: Promise<{ fokus?: string }>;
}) {
  const { fokus } = await searchParams;
  const meetings = await getUpcomingMeetings();

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Sporttreffen</h1>
        <p className="text-zinc-600">
          Finde ein Treffen, das zu dir passt, und mach einfach mit.
        </p>
      </div>
      <TreffenList meetings={meetings} fokusErstie={fokus === "erstie"} />
    </section>
  );
}
