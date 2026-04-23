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
import { AlertTriangle, Heart, Moon, Sparkles } from "lucide-react";

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

  if (!kalbela || !rahu) return null; // Safe exit if math fails

  const tithiColor: Record<string, string> = {
    একাদশী: "bg-primary/10 text-primary",
    পূর্ণিমা: "bg-gold/20 text-foreground",
    অমাবস্যা: "bg-accent/10 text-accent",
  };

  return (
    <Card className="overflow-hidden border border-primary/20 p-0 shadow-soft">
      <div className="bg-gradient-festive px-4 py-3 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="font-display text-lg font-bold">পঞ্জিকা</div>
          <Link
            to="/panjika"
            className="rounded-md bg-background/15 px-2.5 py-1 text-xs font-semibold hover:bg-background/25"
          >
            বিস্তারিত →
          </Link>
        </div>
        <div className="text-xs opacity-90">তিথি · লগ্ন · কালবেলা</div>
      </div>

      <div className="space-y-4 p-4">
        {/* Today's Auspicious Times */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-green-600">
            <Sparkles className="h-3.5 w-3.5" /> আজকের শুভ সময়
          </div>
          <div className="grid grid-cols-2 gap-2">
            {shubho.map((s, i) => (
              <div key={i} className="rounded-md border border-green-200 bg-green-50 p-2">
                <div className="text-[10px] text-green-700 font-bold uppercase">{s.name}</div>
                <div className="text-sm font-bold text-green-800">
                  {formatTimeBangla(s.start, tz)} – {formatTimeBangla(s.end, tz)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Kalbela */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-destructive">
            <AlertTriangle className="h-3.5 w-3.5" /> আজকের অশুভ সময়
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md border border-destructive/20 bg-destructive/5 p-2">
              <div className="text-xs text-muted-foreground">কালবেলা</div>
              <div className="text-sm font-semibold">
                {formatTimeBangla(kalbela.start, tz)} – {formatTimeBangla(kalbela.end, tz)}
              </div>
            </div>
            <div className="rounded-md border border-destructive/20 bg-destructive/5 p-2">
              <div className="text-xs text-muted-foreground">রাহু কাল</div>
              <div className="text-sm font-semibold">
                {formatTimeBangla(rahu.start, tz)} – {formatTimeBangla(rahu.end, tz)}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming tithis */}
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            <Moon className="h-3.5 w-3.5" /> আসন্ন একাদশী · পূর্ণিমা · অমাবস্যা
          </div>
          <ul className="space-y-1.5">
            {upcomingTithis.map((t, i) => (
              <li key={i} className="flex items-center justify-between gap-2 text-sm">
                <span>
                  {toBanglaNum(t.date.getDate())} {GREGORIAN_MONTHS_BN[t.date.getMonth()]}
                  {t.name && (
                    <span className="ml-1 text-xs text-muted-foreground">({t.name})</span>
                  )}
                </span>
                <Badge variant="secondary" className={tithiColor[t.type]}>
                  {t.type}
                </Badge>
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming weddings */}
        {upcomingWeddings.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-festive">
              <Heart className="h-3.5 w-3.5" /> আসন্ন বিবাহ শুভ দিন
            </div>
            <ul className="space-y-1.5">
              {upcomingWeddings.map((w, i) => (
                <li key={i} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {toBanglaNum(w.date.getDate())} {GREGORIAN_MONTHS_BN[w.date.getMonth()]}
                    </span>
                    <span className="text-xs text-muted-foreground">{w.weekday}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {w.nakshatra} · {w.tithi} · {w.banglaMonth}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
