import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CITIES,
  auspiciousWindow,
  dayLengthMinutes,
  formatBanglaDate,
  formatDuration,
  formatTimeBangla,
  getNakshatra,
  getTithi,
  gregorianToBangla,
  isoDate,
  sunTimes,
  toBanglaNum,
  GREGORIAN_MONTHS_BN,
  BANGLA_MONTH_MEANINGS,
  type Region,
  type CityName,
} from "@/lib/bangla-calendar";
import { Sun, Sunrise, Sunset, Moon, Sparkles } from "lucide-react";

export function TodayCard({ region, city }: { region: Region; city: CityName }) {
  const now = new Date();
  const bn = gregorianToBangla(now, region);
  const tithi = getTithi(now);
  const nakshatra = getNakshatra(now);
  const c = CITIES[city] || CITIES.Kolkata;
  const { sunrise, sunset } = sunTimes(now, c.lat, c.lon);
  const tz = c.timezone || 330;
  const dayLen = dayLengthMinutes(sunrise, sunset);
  const aus = auspiciousWindow(sunrise);

  return (
    <Card className="overflow-hidden border-2 border-primary/20 shadow-warm">
      <div className="bg-gradient-festive p-5 text-primary-foreground">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider opacity-90">আজ</div>
            <div className="mt-1 font-display text-3xl font-bold leading-tight md:text-4xl">
              {formatBanglaDate(bn)}
              <span className="ml-2 text-[9px] font-bold leading-none text-white/70 md:text-[11px]">
                {toBanglaNum(bn.day)}
              </span>
            </div>
            <div className="mt-1 text-sm opacity-95">
              {bn.weekdayName} · {toBanglaNum(now.getDate())} {GREGORIAN_MONTHS_BN[now.getMonth()]}{" "}
              {toBanglaNum(now.getFullYear())}
            </div>
          </div>
          <div className="text-right">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white/20 shadow-soft ml-auto mb-1">
              {bn.rituImage ? (
                <img src={bn.rituImage} alt={bn.ritu} className="h-full w-full object-contain p-1" />
              ) : (
                <span className="text-3xl">{bn.rituEmoji}</span>
              )}
            </div>
            <div className="font-display font-semibold">{bn.ritu}</div>
          </div>
        </div>
        <p className="mt-3 text-sm opacity-90">{BANGLA_MONTH_MEANINGS[bn.monthName]}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-5 md:grid-cols-4">
        <Stat icon={<Moon className="h-4 w-4" />} label="তিথি" value={`${tithi.name}`} sub={tithi.paksha} />
        <Stat icon={<Sparkles className="h-4 w-4" />} label="নক্ষত্র" value={nakshatra} />
        <Stat
          icon={<Sunrise className="h-4 w-4" />}
          label={`সূর্যোদয় (${c.label})`}
          value={formatTimeBangla(sunrise, tz)}
        />
        <Stat
          icon={<Sunset className="h-4 w-4" />}
          label={`সূর্যাস্ত (${c.label})`}
          value={formatTimeBangla(sunset, tz)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border bg-secondary/40 px-5 py-3 text-xs">
        <Badge variant="secondary" className="bg-gold/20 text-foreground">
          <Sun className="mr-1 h-3 w-3" /> দিনমান: {formatDuration(dayLen)}
        </Badge>
        <Badge variant="secondary" className="bg-primary/15 text-primary">
          শুভ মুহূর্ত: {formatTimeBangla(aus.start, tz)} – {formatTimeBangla(aus.end, tz)}
        </Badge>
        <Link
          to={`/day/${isoDate(now)}`}
          className="ml-auto rounded-md bg-accent px-3 py-1.5 font-semibold text-accent-foreground hover:opacity-90"
        >
          বিস্তারিত →
        </Link>
      </div>
    </Card>
  );
}

function Stat({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg bg-secondary/40 p-3 min-w-0">
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground truncate uppercase font-bold tracking-tighter">
        {icon} {label}
      </div>
      <div className="mt-1 font-display text-sm font-bold text-foreground truncate">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground truncate opacity-80">{sub}</div>}
    </div>
  );
}
