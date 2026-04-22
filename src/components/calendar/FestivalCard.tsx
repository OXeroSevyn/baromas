import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { isoDate, toBanglaNum, GREGORIAN_MONTHS_BN, gregorianToBangla } from "@/lib/bangla-calendar";
import type { Festival } from "@/data/festivals";
import type { Region } from "@/lib/bangla-calendar";

export function FestivalCard({
  festival,
  date,
  region,
}: {
  festival: Festival;
  date: Date;
  region: Region;
}) {
  const bn = gregorianToBangla(date, region);
  return (
    <Link to={`/day/${isoDate(date)}`} className="block">
      <Card className="group h-full overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-warm">
        <div className="flex items-start gap-3 p-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-festive overflow-hidden shadow-soft">
            {festival.image ? (
              <img src={festival.image} alt={festival.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl text-primary-foreground">{festival.emoji ?? "🎉"}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="font-display text-base font-bold text-accent">{festival.name}</div>
            {festival.englishName && (
              <div className="text-xs text-muted-foreground">{festival.englishName}</div>
            )}
            <p className="mt-1 line-clamp-2 text-sm text-foreground/80">{festival.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-secondary px-2 py-0.5 font-semibold">
                {toBanglaNum(date.getDate())} {GREGORIAN_MONTHS_BN[date.getMonth()]}{" "}
                {toBanglaNum(date.getFullYear())}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                {toBanglaNum(bn.day)} {bn.monthName}
              </span>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-accent">
                {labelFor(festival.type)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function labelFor(t: Festival["type"]): string {
  switch (t) {
    case "national": return "জাতীয়";
    case "cultural": return "সাংস্কৃতিক";
    case "seasonal": return "ঋতুভিত্তিক";
    case "literary": return "সাহিত্যিক";
  }
}
