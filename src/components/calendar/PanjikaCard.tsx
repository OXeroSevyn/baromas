import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CITIES,
  findSpecialTithisInRange,
  findWeddingDates,
  formatTimeBangla,
  GREGORIAN_MONTHS_BN,
  kalPeriods,
  shubhoPeriods,
  sunTimes,
  toBanglaNum,
  type Region,
  type CityName,
} from "@/lib/bangla-calendar";
import { AlertTriangle, Heart, Moon, Sparkles, Calendar, ChevronRight } from "lucide-react";

export function PanjikaCard({ region, city }: { region: Region; city: CityName }) {
  const today = new Date();
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + 60);
  const upcomingTithis = findSpecialTithisInRange(today, horizon).slice(0, 4);

  const weddingHorizon = new Date(today);
  weddingHorizon.setDate(weddingHorizon.getDate() + 120);
  const upcomingWeddings = findWeddingDates(today, weddingHorizon, region, city).slice(0, 3);

  const c = CITIES[city] || CITIES.Kolkata;
  const { sunrise, sunset } = sunTimes(today, c.lat, c.lon);
  const tz = c.timezone || 330;
  const periods = kalPeriods(today, sunrise, sunset);
  const shubho = shubhoPeriods(today, sunrise, sunset);
  const kalbela = periods.find((p) => p.name === "কালবেলা");
  const rahu = periods.find((p) => p.name === "রাহু কাল");

  if (!kalbela || !rahu) return null;

  const tithiColor: Record<string, string> = {
    একাদশী: "bg-primary/10 text-primary",
    পূর্ণিমা: "bg-amber-500/10 text-amber-600",
    অমাবস্যা: "bg-accent/10 text-accent",
  };

  return (
    <Card className="relative overflow-hidden border-none shadow-xl rounded-[40px] bg-card/40 backdrop-blur-md group">
      <div className="bg-gradient-to-r from-accent to-accent/80 p-6 text-white relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Calendar className="h-5 w-5 opacity-70" />
             <div className="font-display text-xl font-black tracking-tight py-1">পঞ্জিকা</div>
          </div>
          <Link
            to="/panjika"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
          >
            বিস্তারিত <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-1">তিথি · লগ্ন · কালবেলা</div>
      </div>

      <div className="space-y-8 p-8">
        {/* Shubho Moments */}
        <section>
          <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
            <Sparkles className="h-4 w-4" /> শুভ সময়
          </div>
          <div className="grid grid-cols-2 gap-3">
            {shubho.map((s, i) => (
              <div key={i} className="rounded-[24px] bg-emerald-500/5 border border-emerald-500/10 p-4 transition-transform hover:scale-105">
                <div className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mb-1">{s.name}</div>
                <div className="text-sm font-black text-accent">
                  {formatTimeBangla(s.start, tz)} – {formatTimeBangla(s.end, tz)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ashubho Moments */}
        <section>
          <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">
            <AlertTriangle className="h-4 w-4" /> অশুভ সময়
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[24px] bg-rose-500/5 border border-rose-500/10 p-4 transition-transform hover:scale-105">
              <div className="text-[9px] text-rose-600 font-black uppercase tracking-widest mb-1">কালবেলা</div>
              <div className="text-sm font-black text-accent">
                {formatTimeBangla(kalbela.start, tz)} – {formatTimeBangla(kalbela.end, tz)}
              </div>
            </div>
            <div className="rounded-[24px] bg-rose-500/5 border border-rose-500/10 p-4 transition-transform hover:scale-105">
              <div className="text-[9px] text-rose-600 font-black uppercase tracking-widest mb-1">রাহু কাল</div>
              <div className="text-sm font-black text-accent">
                {formatTimeBangla(rahu.start, tz)} – {formatTimeBangla(rahu.end, tz)}
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Tithis */}
        <section>
          <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            <Moon className="h-4 w-4" /> আসন্ন তিথি
          </div>
          <div className="space-y-2">
            {upcomingTithis.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-[20px] bg-primary/5 border border-primary/5 hover:bg-primary/10 transition-colors">
                <div className="font-bold text-accent text-sm">
                  {toBanglaNum(t.date.getDate())} {GREGORIAN_MONTHS_BN[t.date.getMonth()]}
                  {t.name && <span className="ml-2 text-[10px] text-muted-foreground font-medium opacity-60">({t.name})</span>}
                </div>
                <Badge className={`${tithiColor[t.type] || 'bg-primary/10 text-primary'} border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5`}>
                  {t.type}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* Weddings */}
        {upcomingWeddings.length > 0 && (
          <section>
            <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-festive">
              <Heart className="h-4 w-4" /> শুভ বিবাহ
            </div>
            <div className="space-y-3">
              {upcomingWeddings.map((w, i) => (
                <div key={i} className="p-4 rounded-[24px] bg-festive/5 border border-festive/10 hover:bg-festive/10 transition-all group/wedding">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-accent">
                      {toBanglaNum(w.date.getDate())} {GREGORIAN_MONTHS_BN[w.date.getMonth()]}
                    </span>
                    <span className="text-[10px] font-black text-festive uppercase tracking-widest">{w.weekday}</span>
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground opacity-60">
                    {w.nakshatra} · {w.tithi} · {w.banglaMonth}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Card>
  );
}
