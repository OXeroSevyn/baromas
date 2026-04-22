import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { isoDate, toBanglaNum, GREGORIAN_MONTHS_BN } from "@/lib/bangla-calendar";
import { upcomingFestivals } from "@/data/festivals";
import type { Region } from "@/lib/bangla-calendar";

export function CountdownStrip({ region }: { region: Region }) {
  const now = new Date();
  const items = upcomingFestivals(now, region, 6);
  const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <h3 className="mb-3 font-display text-lg font-semibold text-accent">আসন্ন উৎসব</h3>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {items.map(({ festival, date }) => {
          const days = Math.round((date.getTime() - today0.getTime()) / 86400000);
          return (
            <Link
              key={festival.id + date.toISOString()}
              to={`/day/${isoDate(date)}`}
              className="group flex min-w-[180px] shrink-0 flex-col rounded-xl border border-border bg-gradient-cream p-3 transition-all hover:border-primary hover:shadow-warm"
            >
              <div className="text-2xl">{festival.emoji ?? "🎉"}</div>
              <div className="mt-1 font-display text-sm font-bold leading-tight text-foreground">
                {festival.name}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {toBanglaNum(date.getDate())} {GREGORIAN_MONTHS_BN[date.getMonth()]}
              </div>
              <div className="mt-2 inline-flex w-fit rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                {days === 0 ? "আজ" : `${toBanglaNum(days)} দিন বাকি`}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
