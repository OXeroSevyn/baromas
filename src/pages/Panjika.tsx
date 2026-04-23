import { useMemo, useState } from "react";
import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/calendar/IconButton";
import { useSettings } from "@/hooks/use-settings";
import {
  CITIES,
  GREGORIAN_MONTHS_BN,
  findSpecialTithisInRange,
  findWeddingDates,
  formatTimeBangla,
  kalPeriods,
  sunTimes,
  toBanglaNum,
  BANGLA_WEEKDAYS,
} from "@/lib/bangla-calendar";
import { Moon, Heart, Sparkles, AlertTriangle, Sun, Calendar, ChevronLeft, ChevronRight, Navigation } from "lucide-react";

const TABS = [
  { id: "tithi", label: "তিথি ও উৎসব", icon: Moon, color: "text-primary bg-primary/10" },
  { id: "wedding", label: "শুভ বিবাহ", icon: Heart, color: "text-rose-500 bg-rose-500/10" },
  { id: "kal", label: "কালবেলা", icon: AlertTriangle, color: "text-amber-500 bg-amber-500/10" },
] as const;

const Panjika = () => {
  const [settings] = useSettings();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("tithi");
  const [year, setYear] = useState(new Date().getFullYear());

  const tz = settings.city === "Dhaka" ? 360 : 330;
  const c = CITIES[settings.city] || CITIES.Kolkata;

  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  const tithiList = useMemo(
    () => (tab === "tithi" ? findSpecialTithisInRange(start, end) : []),
    [tab, year],
  );
  const weddingList = useMemo(
    () => (tab === "wedding" ? findWeddingDates(start, end, settings.region, settings.city) : []),
    [tab, year, settings.region, settings.city],
  );
  const today = new Date();
  const todaySun = sunTimes(today, c.lat, c.lon);
  const todayKal = kalPeriods(today, todaySun.sunrise, todaySun.sunset);

  return (
    <PageShell>
      <section className="container py-8 space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-primary/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest px-3 py-1 uppercase">ডিজিটাল পঞ্জিকা</Badge>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black text-accent tracking-tighter leading-[1.1] py-2">
              তিথি, লগ্ন ও <span className="text-primary/30">কালবেলা</span>
            </h1>
            <p className="max-w-2xl text-sm font-medium text-muted-foreground leading-relaxed">
              বৈদিক পঞ্জিকা অনুসারে একাদশী, পূর্ণিমা, অমাবস্যা, বিয়ের শুভ তারিখ এবং কালবেলা/রাহুকালের নিখুঁত তালিকা। {c.label} সময় অনুসারে গণিত।
            </p>
          </div>

          <div className="flex items-center gap-4 bg-card/40 backdrop-blur-md p-3 rounded-[32px] border border-primary/5 shadow-xl">
             <Button 
               onClick={() => setYear((y) => y - 1)}
               className="h-12 w-12 rounded-full bg-white/5 border-none hover:bg-primary/10 transition-colors"
             >
               <ChevronLeft className="h-6 w-6" />
             </Button>
             <div className="flex flex-col items-center px-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">বছর</span>
                <span className="font-display text-2xl font-black text-accent">{toBanglaNum(year)}</span>
             </div>
             <Button 
               onClick={() => setYear((y) => y + 1)}
               className="h-12 w-12 rounded-full bg-white/5 border-none hover:bg-primary/10 transition-colors"
             >
               <ChevronRight className="h-6 w-6" />
             </Button>
          </div>
        </div>

        {/* Premium Tab Navigation */}
        <div className="flex flex-wrap gap-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 rounded-[24px] px-8 py-4 text-xs font-black uppercase tracking-widest transition-all duration-500 shadow-lg ${
                tab === t.id
                  ? "bg-primary text-white scale-105 shadow-primary/20"
                  : "bg-card/40 backdrop-blur-md text-accent hover:bg-primary/10 border border-primary/5"
              }`}
            >
              <t.icon className={`h-4 w-4 ${tab === t.id ? 'text-white' : 'text-primary'}`} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="animate-fade-in-up">
          {tab === "tithi" && <TithiList items={tithiList} />}
          {tab === "wedding" && <WeddingList items={weddingList} />}
          {tab === "kal" && (
            <KalView
              periods={todayKal}
              tz={tz}
              cityLabel={c.label}
              sunrise={todaySun.sunrise}
              sunset={todaySun.sunset}
            />
          )}
        </div>
      </section>
    </PageShell>
  );
};

function TithiList({
  items,
}: {
  items: ReturnType<typeof findSpecialTithisInRange>;
}) {
  const grouped = items.reduce<Record<string, typeof items>>((acc, it) => {
    const key = `${it.date.getFullYear()}-${it.date.getMonth()}`;
    (acc[key] ||= [] as never).push(it);
    return acc;
  }, {});

  const colors = {
    একাদশী: "bg-primary/5 border-primary/10 text-primary",
    পূর্ণিমা: "bg-amber-500/5 border-amber-500/10 text-amber-600",
    অমাবস্যা: "bg-slate-500/5 border-slate-500/10 text-slate-600",
  } as const;

  return (
    <div className="space-y-12">
      {Object.entries(grouped).map(([key, list]) => {
        const [, m] = key.split("-").map(Number);
        return (
          <div key={key} className="space-y-6">
            <h3 className="flex items-center gap-4 font-display text-4xl font-black text-accent tracking-tighter py-2 border-l-4 border-primary pl-6">
              {GREGORIAN_MONTHS_BN[m]} <span className="text-primary/20 text-2xl font-black">মাস</span>
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((it, i) => (
                <Card
                  key={i}
                  className={`relative overflow-hidden rounded-[40px] p-8 transition-all hover:scale-[1.02] border backdrop-blur-md shadow-xl ${colors[it.type] || 'bg-card/40 border-primary/5 text-accent'}`}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <Moon className="h-24 w-24" />
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                    <div>
                      <div className="font-display text-2xl font-black mb-1">
                        {it.type}
                      </div>
                      {it.name && <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">({it.name} একাদশী)</div>}
                      <div className="flex items-center gap-2 mt-4">
                         <Badge className="bg-white/20 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">
                           {it.paksha}
                         </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between">
                       <div className="space-y-1">
                          <div className="text-3xl font-black leading-none">{toBanglaNum(it.date.getDate())}</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">{BANGLA_WEEKDAYS[it.date.getDay()]}</div>
                       </div>
                       <Moon className="h-8 w-8 opacity-20" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-card/20 rounded-[40px] border border-dashed border-primary/10">
           <Moon className="h-12 w-12 text-primary/20 mb-4" />
           <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">এই বছরের জন্য কোনো তথ্য পাওয়া যায়নি</p>
        </div>
      )}
    </div>
  );
}

function WeddingList({
  items,
}: {
  items: ReturnType<typeof findWeddingDates>;
}) {
  return (
    <div className="space-y-8">
      <div className="bg-rose-500/5 border border-rose-500/10 rounded-[32px] p-8">
        <p className="text-sm font-medium text-rose-600/80 leading-relaxed italic">
          বৈদিক রীতি অনুসারে শুভ মাস, নক্ষত্র, তিথি ও বার মিলিয়ে নির্বাচিত শুভ বিবাহ তারিখ। প্রতিটির জন্য একটি অনুমোদিত লগ্ন-জানালা দেওয়া হয়েছে। মোট <strong className="text-rose-600 font-black">{toBanglaNum(items.length)}</strong> টি শুভ দিন পাওয়া গেছে।
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((w, i) => (
          <Card
            key={i}
            className="group relative overflow-hidden rounded-[40px] border-none bg-rose-500/5 p-10 shadow-xl transition-all hover:scale-[1.02] hover:bg-rose-500/10"
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
               <Heart className="h-48 w-48" />
            </div>
            
            <div className="relative z-10 grid gap-8 md:grid-cols-[1fr_auto]">
              <div className="space-y-6">
                <div>
                  <div className="font-display text-3xl font-black text-accent tracking-tighter py-1">
                    {toBanglaNum(w.date.getDate())} {GREGORIAN_MONTHS_BN[w.date.getMonth()]}
                    <span className="text-rose-500/30 ml-2">{toBanglaNum(w.date.getFullYear())}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge className="bg-rose-500/10 text-rose-600 border-none text-[9px] font-black uppercase tracking-widest px-3 py-1">{w.weekday}</Badge>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">{w.banglaMonth} মাস</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest opacity-60">নক্ষত্র</div>
                      <div className="text-sm font-black text-accent">{w.nakshatra}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest opacity-60">তিথি</div>
                      <div className="text-sm font-black text-accent">{w.tithi}</div>
                   </div>
                </div>

                <div className="rounded-[24px] bg-white/5 border border-rose-500/10 p-5 group-hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2">
                    <Sparkles className="h-3 w-3" /> শুভ লগ্ন
                  </div>
                  <div className="text-sm font-black text-accent leading-relaxed">{w.lagna}</div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-rose-500/10 rounded-[32px] min-w-[100px] border border-rose-500/5">
                <Heart className="h-6 w-6 text-rose-500 mb-2 animate-pulse" />
                <div className="font-display text-4xl font-black text-rose-600">
                  {toBanglaNum(w.score)}
                </div>
                <div className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-1 opacity-60">শুভ স্কোর</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function KalView({
  periods,
  tz,
  cityLabel,
  sunrise,
  sunset,
}: {
  periods: ReturnType<typeof kalPeriods>;
  tz: number;
  cityLabel: string;
  sunrise: Date;
  sunset: Date;
}) {
  return (
    <div className="space-y-10">
      <Card className="rounded-[32px] border-none bg-amber-500/5 p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-amber-500/10 rounded-2xl">
               <Sun className="h-6 w-6 text-amber-500" />
             </div>
             <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-amber-500 opacity-60">সূর্যোদয়</div>
                <div className="text-xl font-black text-accent">{formatTimeBangla(sunrise, tz)}</div>
             </div>
          </div>
          <div className="h-10 w-px bg-amber-500/10 hidden sm:block" />
          <div className="flex items-center gap-4">
             <div className="p-3 bg-rose-500/10 rounded-2xl">
               <Sun className="h-6 w-6 text-rose-500 rotate-180" />
             </div>
             <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-rose-500 opacity-60">সূর্যাস্ত</div>
                <div className="text-xl font-black text-accent">{formatTimeBangla(sunset, tz)}</div>
             </div>
          </div>
          <div className="h-10 w-px bg-amber-500/10 hidden lg:block" />
          <div className="flex items-center gap-3">
             <Badge className="bg-amber-500/10 text-amber-600 border-none font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full">
               লোকেশন: {cityLabel}
             </Badge>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {periods.map((p, i) => (
          <Card
            key={i}
            className="group relative overflow-hidden rounded-[40px] border-none bg-rose-500/5 p-8 shadow-xl transition-all hover:scale-[1.02]"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
               <AlertTriangle className="h-32 w-32" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-rose-500" />
                <div className="font-display text-2xl font-black text-rose-600 py-1">
                  {p.name}
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 bg-rose-500/10 rounded-[24px] border border-rose-500/5">
                <span className="text-lg font-black text-accent">{formatTimeBangla(p.start, tz)}</span>
                <span className="text-rose-500 opacity-40 font-black">—</span>
                <span className="text-lg font-black text-accent">{formatTimeBangla(p.end, tz)}</span>
              </div>
              <p className="text-xs font-bold text-muted-foreground leading-relaxed italic opacity-60">
                এই সময় কোনো শুভ কাজ করা থেকে বিরত থাকার বিধান।
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="rounded-[40px] border-none bg-primary/5 p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000">
           <Sparkles className="h-48 w-48" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
           <div className="p-6 bg-primary/10 rounded-[32px]">
              <Navigation className="h-10 w-10 text-primary" />
           </div>
           <div className="space-y-3">
              <h3 className="font-display text-2xl font-black text-accent tracking-tight">পঞ্জিকা নির্দেশিকা</h3>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-3xl">
                কালবেলা, রাহুকাল, যমগণ্ড ও গুলিককাল প্রতিদিন সূর্যোদয় থেকে সূর্যাস্ত পর্যন্ত ৮ ভাগে বিভক্ত। বারভেদে এদের অবস্থান পরিবর্তিত হয়। বাংলার প্রাচীন গণনা পদ্ধতি মেনেই এই তালিকা প্রস্তুত করা হয়েছে।
              </p>
           </div>
        </div>
      </Card>
    </div>
  );
}

export default Panjika;
ame="mt-2 text-sm">
              <strong>{formatTimeBangla(p.start, tz)}</strong> —{" "}
              <strong>{formatTimeBangla(p.end, tz)}</strong>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              এই সময় কোনো শুভ কাজ করা থেকে বিরত থাকার বিধান।
            </p>
          </Card>
        ))}
      </div>
      <Card className="border-2 border-primary/30 bg-primary/5 p-4 shadow-soft">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <div className="font-display font-bold text-primary">
            পঞ্জিকা নোট
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          কালবেলা, রাহুকাল, যমগণ্ড ও গুলিককাল প্রতিদিন সূর্যোদয় থেকে সূর্যাস্ত
          পর্যন্ত ৮ ভাগে বিভক্ত। বারভেদে এদের অবস্থান বদলায়।
        </p>
      </Card>
    </div>
  );
}

export default Panjika;
