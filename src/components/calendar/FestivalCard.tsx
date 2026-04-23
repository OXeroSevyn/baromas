import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { isoDate, toBanglaNum, GREGORIAN_MONTHS_BN, gregorianToBangla } from "@/lib/bangla-calendar";
import type { Festival } from "@/data/festivals";
import type { Region } from "@/lib/bangla-calendar";
import { BengaliWikiDialog } from "./BengaliWikiDialog";
import { BookOpen, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <Card className="group relative h-full overflow-hidden rounded-[40px] border border-primary/5 bg-card/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
      <Link to={`/day/${isoDate(date)}`} className="block">
        <div className="p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-primary/10 overflow-hidden shadow-inner ring-1 ring-white/10 transition-all duration-700 group-hover:rotate-6 group-hover:scale-110">
              {festival.image ? (
                <img src={festival.image} alt={festival.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-4xl drop-shadow-lg">{festival.emoji ?? "🎉"}</span>
              )}
            </div>
            <div className="flex flex-col items-end text-right">
               <div className="text-2xl font-black text-primary leading-none">{toBanglaNum(date.getDate())}</div>
               <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{GREGORIAN_MONTHS_BN[date.getMonth()]}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
               <h3 className="font-display text-2xl font-black text-accent tracking-tighter group-hover:text-primary transition-colors py-1">
                 {festival.name}
               </h3>
               {festival.englishName && (
                 <div className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">{festival.englishName}</div>
               )}
            </div>
            <p className="line-clamp-2 text-sm text-muted-foreground font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
              {festival.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Badge className="bg-primary/5 text-primary border-none text-[9px] font-black uppercase tracking-widest px-3 py-1">
              {toBanglaNum(bn.day)} {bn.monthName}
            </Badge>
            <Badge className="bg-accent/5 text-accent border-none text-[9px] font-black uppercase tracking-widest px-3 py-1">
              {labelFor(festival.type)}
            </Badge>
          </div>
        </div>
      </Link>

      <div className="px-8 pb-8 pt-0 mt-auto">
        <BengaliWikiDialog 
          query={festival.name}
          title={festival.name}
          subtitle={`${labelFor(festival.type)} উৎসব`}
          fallbackText={festival.description}
          trigger={
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full h-11 justify-center gap-3 text-[11px] font-black uppercase tracking-widest text-primary bg-primary/5 hover:bg-primary hover:text-white rounded-[20px] transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <BookOpen className="h-4 w-4" />
              ইতিহাস জানুন
            </Button>
          }
        />
      </div>
      
      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
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

function labelFor(t: Festival["type"]): string {
  switch (t) {
    case "national": return "জাতীয়";
    case "cultural": return "সাংস্কৃতিক";
    case "seasonal": return "ঋতুভিত্তিক";
    case "literary": return "সাহিত্যিক";
  }
}
