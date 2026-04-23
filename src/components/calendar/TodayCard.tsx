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
import { Sun, Sunrise, Sunset, Moon, Sparkles, Navigation, Calendar as CalendarIcon, MapPin } from "lucide-react";

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
    <Card className="relative overflow-hidden border-none shadow-xl rounded-[40px] bg-card/40 backdrop-blur-md group">
      <div className="bg-gradient-to-br from-primary via-primary to-accent p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000 pointer-events-none">
          <CalendarIcon className="h-48 w-48" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <Badge className="bg-white/20 text-white border-none font-black text-[10px] tracking-widest uppercase py-1 px-3">আজ</Badge>
               <div className="flex items-center gap-1 text-[10px] font-bold text-white/70 uppercase tracking-widest">
                  <MapPin className="h-3 w-3" /> {c.label}
               </div>
            </div>
            
            <div className="font-display text-4xl md:text-5xl font-black tracking-tight leading-[1.3] py-1">
              {formatBanglaDate(bn)}
              <span className="ml-3 text-lg font-black text-white/50 tracking-normal">
                ({toBanglaNum(bn.day)})
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-white/80 font-bold text-sm">
              <span className="px-2 py-1 bg-white/10 rounded-lg">{bn.weekdayName}</span>
              <span>·</span>
              <span>{toBanglaNum(now.getDate())} {GREGORIAN_MONTHS_BN[now.getMonth()]} {toBanglaNum(now.getFullYear())}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-white/20 backdrop-blur-sm shadow-xl border border-white/20 transition-transform duration-700 group-hover:rotate-12">
              {bn.rituIcon ? (
                <img 
                  src={`https://api.iconify.design/${bn.rituIcon.replace(':', '/')}.svg?color=white`} 
                  alt={bn.ritu} 
                  className="h-10 w-10 object-contain" 
                />
              ) : (
                <span className="text-4xl">{bn.rituEmoji}</span>
              )}
            </div>
            <div className="font-display text-xl font-black text-white tracking-widest uppercase">{bn.ritu}</div>
          </div>
        </div>
        
        <p className="relative z-10 mt-6 text-sm text-white/70 font-medium max-w-lg leading-relaxed italic border-l-2 border-white/20 pl-4">
          {BANGLA_MONTH_MEANINGS[bn.monthName]}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-8">
        <Stat icon={<Moon className="h-4 w-4" />} label="তিথি" value={`${tithi.name}`} sub={tithi.paksha} color="text-primary bg-primary/5" />
        <Stat icon={<Sparkles className="h-4 w-4" />} label="নক্ষত্র" value={nakshatra} color="text-orange-500 bg-orange-500/5" />
        <Stat
          icon={<Sunrise className="h-4 w-4" />}
          label="সূর্যোদয়"
          value={formatTimeBangla(sunrise, tz)}
          color="text-amber-500 bg-amber-500/5"
        />
        <Stat
          icon={<Sunset className="h-4 w-4" />}
          label="সূর্যাস্ত"
          value={formatTimeBangla(sunset, tz)}
          color="text-rose-500 bg-rose-500/5"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-primary/5 bg-card/60 px-8 py-6">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 py-1.5 px-4 rounded-full font-black text-[10px] tracking-widest flex items-center gap-2">
            <Sun className="h-3 w-3" /> দিনমান: {formatDuration(dayLen)}
          </Badge>
          <Badge variant="outline" className="bg-orange-500/5 text-orange-600 border-orange-500/10 py-1.5 px-4 rounded-full font-black text-[10px] tracking-widest flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> শুভ মুহূর্ত: {formatTimeBangla(aus.start, tz)} – {formatTimeBangla(aus.end, tz)}
          </Badge>
        </div>
        
        <Link
          to={`/day/${isoDate(now)}`}
          className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white font-black text-xs rounded-full hover:scale-105 transition-all shadow-lg shadow-accent/20"
        >
          বিস্তারিত <Navigation className="h-3 w-3" />
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
  color
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className={`rounded-[24px] p-5 transition-all duration-300 hover:scale-105 hover:bg-card ${color} border border-transparent hover:border-current/10`}>
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">
        {icon} {label}
      </div>
      <div className="font-display text-lg font-black text-accent tracking-tight">{value}</div>
      {sub && <div className="text-[10px] font-bold text-muted-foreground mt-0.5 opacity-60">{sub}</div>}
    </div>
  );
}
