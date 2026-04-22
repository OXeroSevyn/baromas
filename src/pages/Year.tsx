import { useParams, Link } from "react-router-dom";
import { PageShell } from "@/components/calendar/PageShell";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { GREGORIAN_MONTHS_BN, toBanglaNum } from "@/lib/bangla-calendar";
import { useSettings } from "@/hooks/use-settings";
import { useEvents } from "@/hooks/use-events";

const Year = () => {
  const { year } = useParams();
  const [settings] = useSettings();
  const { events } = useEvents();
  const y = Number(year) || new Date().getFullYear();

  return (
    <PageShell>
      <section className="container py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold text-accent">
            {toBanglaNum(y)} সাল
          </h1>
          <div className="flex gap-2">
            <Link to={`/year/${y - 1}`} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-semibold hover:bg-primary/10">← {toBanglaNum(y - 1)}</Link>
            <Link to={`/year/${y + 1}`} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-semibold hover:bg-primary/10">{toBanglaNum(y + 1)} →</Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, m) => (
            <Link key={m} to={`/month/${y}/${m + 1}`} className="block">
              <div className="hover:scale-[1.01] transition-transform">
                <MonthGrid
                  year={y}
                  month={m}
                  region={settings.region}
                  startDay={settings.startDay}
                  events={events}
                  compact
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export default Year;
