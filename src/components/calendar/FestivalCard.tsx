import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { isoDate, toBanglaNum, GREGORIAN_MONTHS_BN, gregorianToBangla } from "@/lib/bangla-calendar";
import type { Festival } from "@/data/festivals";
import type { Region } from "@/lib/bangla-calendar";
import { BengaliWikiDialog } from "./BengaliWikiDialog";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <Card className="group relative h-full overflow-hidden p-0 transition-all hover:-translate-y-1 hover:shadow-warm border-primary/5 bg-white/60 backdrop-blur-md">
      <Link to={`/day/${isoDate(date)}`} className="block">
        <div className="flex items-start gap-4 p-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-festive overflow-hidden shadow-inner ring-2 ring-white/50 transition-transform group-hover:scale-105">
            {festival.image ? (
              <img src={festival.image} alt={festival.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl drop-shadow-sm">{festival.emoji ?? "🎉"}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-lg font-bold text-accent group-hover:text-primary transition-colors">{festival.name}</div>
            {festival.englishName && (
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{festival.englishName}</div>
            )}
            <p className="mt-2 line-clamp-2 text-sm text-foreground/70 font-medium">{festival.description}</p>
            
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px]">
              <span className="rounded-full bg-secondary/50 px-2.5 py-0.5 font-bold text-muted-foreground">
                {toBanglaNum(date.getDate())} {GREGORIAN_MONTHS_BN[date.getMonth()]}
              </span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-bold text-primary">
                {toBanglaNum(bn.day)} {bn.monthName}
              </span>
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-bold text-accent">
                {labelFor(festival.type)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5 pt-0">
        <BengaliWikiDialog 
          query={festival.name}
          title={festival.name}
          subtitle={`${labelFor(festival.type)} উৎসব`}
          fallbackText={festival.description}
          trigger={
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full h-9 justify-center gap-2 text-primary font-bold bg-primary/5 hover:bg-primary/10 rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <BookOpen className="h-3.5 w-3.5" />
              ইতিহাস জানুন
            </Button>
          }
        />
      </div>
    </Card>
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
