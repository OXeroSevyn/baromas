import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Share2, Trash2, Pencil, Moon, Sunrise, Sunset } from "lucide-react";
import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/calendar/IconButton";
import {
  CITIES,
  GREGORIAN_MONTHS_BN,
  addDays,
  auspiciousWindow,
  dayLengthMinutes,
  formatBanglaDate,
  formatDuration,
  formatTimeBangla,
  getNakshatra,
  getTithi,
  gregorianToBangla,
  isoDate,
  parseIso,
  sunTimes,
  toBanglaNum,
  shubhoPeriods,
  kalPeriods,
  suggestLagna,
  LAGNAS,
} from "@/lib/bangla-calendar";
import { festivalsOnDate } from "@/data/festivals";
import { eventsOnDate } from "@/data/historical-events";
import { useSettings } from "@/hooks/use-settings";
import { useEvents, eventsForDate, type CalendarEvent } from "@/hooks/use-events";
import { EventDialog } from "@/components/calendar/EventDialog";
import { toast } from "sonner";
import { AlertTriangle, Sparkles, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const Day = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [settings] = useSettings();
  const { events, remove } = useEvents();
  const d = date ? parseIso(date) : new Date();
  const bn = gregorianToBangla(d, settings.region);
  const tithi = getTithi(d);
  const nakshatra = getNakshatra(d);
  const c = CITIES[settings.city] || CITIES.Kolkata;
  const tz = c.timezone || 330;
  const { sunrise, sunset } = sunTimes(d, c.lat, c.lon);
  const aus = auspiciousWindow(sunrise);
  const fests = festivalsOnDate(d, settings.region);
  const hist = eventsOnDate(d);
  const dayEvents = eventsForDate(events, d);

  const shubhoTimes = shubhoPeriods(d, sunrise, sunset);
  const inauspiciousTimes = kalPeriods(d, sunrise, sunset);
  const currentLagna = suggestLagna(d, sunrise);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: formatBanglaDate(bn), url }); } catch { /* noop */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("লিংক কপি হয়েছে");
    }
  };

  return (
    <PageShell>
      <section className="container py-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> মূল পাতা
          </Link>
          <div className="flex gap-2">
            <Button onClick={() => navigate(`/day/${isoDate(addDays(d, -1))}`)} className="h-10 w-10 p-0 rounded-xl bg-card border-none shadow-soft">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate(`/day/${isoDate(addDays(d, 1))}`)} className="h-10 w-10 p-0 rounded-xl bg-card border-none shadow-soft">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button onClick={share} className="h-10 px-4 rounded-xl bg-card border-none shadow-soft font-bold text-accent">
              <Share2 className="h-4 w-4" /> শেয়ার
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-none shadow-warm rounded-[32px] bg-white">
              <div className="bg-gradient-festive p-8 text-primary-foreground">
                <div className="flex justify-between items-start">
                   <div>
                      <div className="text-xs uppercase tracking-[0.2em] font-bold opacity-80 mb-2">{bn.weekdayName}</div>
                      <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                        {formatBanglaDate(bn)}
                      </h1>
                      <div className="mt-3 flex items-center gap-3 text-sm font-medium opacity-90">
                        <span>{toBanglaNum(d.getDate())} {GREGORIAN_MONTHS_BN[d.getMonth()]} {toBanglaNum(d.getFullYear())}</span>
                        <span className="h-1 w-1 rounded-full bg-white/40" />
                        <span className="flex items-center gap-1">
                           <Star className="h-3.5 w-3.5 text-yellow-300 fill-yellow-300" /> {bn.ritu} ঋতু
                        </span>
                      </div>
                   </div>
                   <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
                      <img 
                        src={`https://api.iconify.design/${bn.rituIcon.replace(':', '/')}.svg?color=white`} 
                        alt={bn.ritu} 
                        className="h-12 w-12" 
                      />
                   </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <DetailStat label="তিথি" value={tithi.name} sub={tithi.paksha} icon={<Moon className="h-5 w-5" />} />
                  <DetailStat label="নক্ষত্র" value={nakshatra} icon={<Sparkles className="h-5 w-5" />} />
                  <DetailStat label="সূর্যোদয়" value={formatTimeBangla(sunrise, tz)} sub={c.label} icon={<Sunrise className="h-5 w-5" />} />
                  <DetailStat label="সূর্যাস্ত" value={formatTimeBangla(sunset, tz)} sub={c.label} icon={<Sunset className="h-5 w-5" />} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <Card className="p-6 border-none bg-secondary/30 rounded-3xl">
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
                         <Clock className="h-4 w-4" /> দিনমান
                      </div>
                      <div className="text-xl font-bold text-accent">
                         {formatDuration(dayLengthMinutes(sunrise, sunset))}
                      </div>
                   </Card>
                   <Card className="p-6 border-none bg-primary/5 rounded-3xl">
                      <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider mb-2">
                         <Sparkles className="h-4 w-4" /> শুভ মুহূর্ত (ব্রাহ্ম)
                      </div>
                      <div className="text-xl font-bold text-primary">
                         {formatTimeBangla(aus.start, tz)} – {formatTimeBangla(aus.end, tz)}
                      </div>
                   </Card>
                </div>
              </div>
            </Card>

            {/* Shubho / Osubho Details */}
            <div className="grid md:grid-cols-2 gap-6">
               <Card className="p-6 border-none shadow-soft rounded-[32px] bg-white">
                  <h3 className="flex items-center gap-2 text-green-600 font-bold mb-5 text-lg uppercase tracking-tight">
                    <Sparkles className="h-5 w-5" /> আজকের শুভ সময়
                  </h3>
                  <div className="space-y-3">
                     {shubhoTimes.map((s, i) => (
                       <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-green-50 border border-green-100">
                          <span className="font-bold text-green-800 text-base">{s.name}</span>
                          <span className="font-display font-semibold text-green-700 text-lg">
                             {formatTimeBangla(s.start, tz)} – {formatTimeBangla(s.end, tz)}
                          </span>
                       </div>
                     ))}
                  </div>
               </Card>

               <Card className="p-6 border-none shadow-soft rounded-[32px] bg-white">
                  <h3 className="flex items-center gap-2 text-destructive font-bold mb-5 text-lg uppercase tracking-tight">
                    <AlertTriangle className="h-5 w-5" /> আজকের অশুভ সময়
                  </h3>
                  <div className="space-y-3">
                     {inauspiciousTimes.filter(p => ["কালবেলা", "রাহু কাল", "যমগণ্ড"].includes(p.name)).map((s, i) => (
                       <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-destructive/5 border border-destructive/10">
                          <span className="font-bold text-destructive text-base">{s.name}</span>
                          <span className="font-display font-semibold text-destructive/80 text-lg">
                             {formatTimeBangla(s.start, tz)} – {formatTimeBangla(s.end, tz)}
                          </span>
                       </div>
                     ))}
                  </div>
               </Card>
            </div>

            {/* Lagna Table */}
            <Card className="p-8 border-none shadow-soft rounded-[32px] bg-white">
               <h3 className="flex items-center gap-2 text-accent font-bold mb-6 text-lg uppercase tracking-tight">
                 <Star className="h-6 w-6 text-orange-400 fill-orange-400" /> আজকের লগ্ন তালিকা
               </h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {LAGNAS.map((l, i) => {
                    const lStart = new Date(sunrise.getTime() + i * 120 * 60000);
                    const isCurrent = currentLagna.name === l;
                    return (
                      <div key={i} className={cn(
                        "p-4 rounded-2xl text-center transition-all border",
                        isCurrent ? "bg-primary text-white shadow-lg scale-105 border-primary" : "bg-secondary/10 text-muted-foreground border-transparent"
                      )}>
                        <div className="text-xs uppercase font-bold opacity-70 mb-1">লগ্ন</div>
                        <div className="font-bold text-base">{l}</div>
                        <div className="text-[11px] mt-1 font-medium opacity-90">{formatTimeBangla(lStart, tz)}</div>
                      </div>
                    );
                  })}
               </div>
            </Card>
          </div>

          {/* Right Column: Events and History */}
          <div className="space-y-6">
            {fests.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-display text-xl font-bold text-accent px-2 flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-none">{fests.length}</Badge> উৎসব ও ছুটি
                </h2>
                {fests.map((f) => (
                  <Card key={f.id} className="group overflow-hidden border-none shadow-soft rounded-[28px] bg-white p-5 hover:shadow-warm transition-all">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-festive text-2xl text-primary-foreground group-hover:scale-110 transition-transform">
                        {f.emoji ?? "🎉"}
                      </div>
                      <div>
                        <div className="font-display font-bold text-accent leading-tight">{f.name}</div>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{f.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <h2 className="font-display text-xl font-bold text-accent">আমার ইভেন্ট</h2>
                <button 
                  onClick={() => { setEditing(null); setDialogOpen(true); }}
                  className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              {dayEvents.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground bg-card/30 border-2 border-dashed rounded-[32px]">
                  এই দিনে কোনো ইভেন্ট নেই
                </Card>
              ) : (
                <div className="grid gap-3">
                  {dayEvents.map((e) => (
                    <Card key={e.id} className="flex items-center justify-between gap-3 p-4 shadow-soft rounded-2xl border-none bg-white">
                      <div>
                        <div className="font-bold text-accent">{e.title}</div>
                        <Badge variant="secondary" className="mt-1 bg-secondary text-[10px] uppercase">{categoryLabel(e.category)}</Badge>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { setEditing(e); setDialogOpen(true); }} className="p-2 hover:bg-secondary rounded-lg transition-colors"><Pencil className="h-4 w-4 text-muted-foreground" /></button>
                        <button onClick={() => { remove(e.id); toast.success("মুছে ফেলা হয়েছে"); }} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4 text-red-400" /></button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {hist.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-display text-xl font-bold text-accent px-2">ইতিহাসে আজকের দিন</h2>
                <Card className="p-6 shadow-soft rounded-[32px] border-none bg-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                     <Clock className="h-20 w-20" />
                  </div>
                  <ul className="space-y-4 relative">
                    {hist.map((h, i) => (
                      <li key={i} className="text-sm leading-relaxed border-l-2 border-primary/20 pl-4">
                        <div className="font-display font-black text-primary text-xs mb-1">{toBanglaNum(h.year)}</div>
                        <div className="text-accent/90">{h.text}</div>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      <EventDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultDate={d} editing={editing} />
    </PageShell>
  );
};

function DetailStat({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-[0.1em]">
        {icon} {label}
      </div>
      <div className="font-display text-2xl font-bold text-accent">{value}</div>
      {sub && <div className="text-base font-medium text-primary/70">{sub}</div>}
    </div>
  );
}

function Info({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg bg-secondary/50 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-base font-semibold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function categoryLabel(c: CalendarEvent["category"]): string {
  const map: Record<string, string> = {
    personal: "ব্যক্তিগত", birthday: "জন্মদিন", anniversary: "বিবাহবার্ষিকী",
    work: "কাজ", festival: "উৎসব", other: "অন্যান্য",
  };
  return map[c] ?? c;
}

export default Day;
