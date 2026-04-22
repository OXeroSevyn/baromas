import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Share2, Trash2, Pencil } from "lucide-react";
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
} from "@/lib/bangla-calendar";
import { festivalsOnDate } from "@/data/festivals";
import { eventsOnDate } from "@/data/historical-events";
import { useSettings } from "@/hooks/use-settings";
import { useEvents, eventsForDate, type CalendarEvent } from "@/hooks/use-events";
import { EventDialog } from "@/components/calendar/EventDialog";
import { toast } from "sonner";

const Day = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [settings] = useSettings();
  const { events, remove } = useEvents();
  const d = date ? parseIso(date) : new Date();
  const bn = gregorianToBangla(d, settings.region);
  const tithi = getTithi(d);
  const nakshatra = getNakshatra(d);
  const c = CITIES[settings.city];
  const tz = settings.city === "Dhaka" ? 360 : 330;
  const { sunrise, sunset } = sunTimes(d, c.lat, c.lon);
  const aus = auspiciousWindow(sunrise);
  const fests = festivalsOnDate(d, settings.region);
  const hist = eventsOnDate(d);
  const dayEvents = eventsForDate(events, d);

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
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← মূল পাতা</Link>
          <div className="flex gap-2">
            <Button onClick={() => navigate(`/day/${isoDate(addDays(d, -1))}`)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button onClick={() => navigate(`/day/${isoDate(addDays(d, 1))}`)}><ChevronRight className="h-4 w-4" /></Button>
            <Button onClick={share}><Share2 className="h-4 w-4" /> শেয়ার</Button>
          </div>
        </div>

        <Card className="overflow-hidden border-2 border-primary/20 shadow-warm">
          <div className="bg-gradient-festive p-5 text-primary-foreground">
            <div className="text-xs uppercase tracking-wider opacity-90">{bn.weekdayName}</div>
            <h1 className="mt-1 font-display text-3xl font-bold leading-tight md:text-4xl">
              {formatBanglaDate(bn)}
            </h1>
            <p className="mt-1 text-sm opacity-95">
              {toBanglaNum(d.getDate())} {GREGORIAN_MONTHS_BN[d.getMonth()]} {toBanglaNum(d.getFullYear())} · {bn.rituEmoji} {bn.ritu}
            </p>
          </div>

          <div className="grid gap-3 p-5 md:grid-cols-2 lg:grid-cols-4">
            <Info label="তিথি" value={tithi.name} sub={tithi.paksha} />
            <Info label="নক্ষত্র" value={nakshatra} />
            <Info label={`সূর্যোদয় (${c.label})`} value={formatTimeBangla(sunrise, tz)} />
            <Info label={`সূর্যাস্ত (${c.label})`} value={formatTimeBangla(sunset, tz)} />
            <Info label="দিনমান" value={formatDuration(dayLengthMinutes(sunrise, sunset))} />
            <Info label="শুভ মুহূর্ত (ব্রাহ্ম)" value={`${formatTimeBangla(aus.start, tz)} – ${formatTimeBangla(aus.end, tz)}`} />
            <Info label="ঋতু" value={bn.ritu} />
            <Info label="পক্ষ" value={tithi.paksha} />
          </div>
        </Card>
      </section>

      {fests.length > 0 && (
        <section className="container mb-4">
          <h2 className="mb-2 font-display text-xl font-bold text-accent">উৎসব ও ছুটি</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {fests.map((f) => (
              <Card key={f.id} className="flex gap-3 p-4 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-festive text-2xl text-primary-foreground">
                  {f.emoji ?? "🎉"}
                </div>
                <div>
                  <div className="font-display font-bold text-accent">{f.name}</div>
                  <p className="text-sm text-foreground/80">{f.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="container mb-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-accent">আমার ইভেন্ট</h2>
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4" /> যোগ করুন
          </Button>
        </div>
        {dayEvents.length === 0 ? (
          <Card className="p-4 text-center text-muted-foreground">এই দিনে কোনো ইভেন্ট নেই</Card>
        ) : (
          <div className="grid gap-2">
            {dayEvents.map((e) => (
              <Card key={e.id} className="flex items-center justify-between gap-3 p-3 shadow-soft">
                <div>
                  <div className="font-semibold">{e.title}</div>
                  {e.notes && <div className="text-sm text-muted-foreground">{e.notes}</div>}
                  <Badge variant="secondary" className="mt-1 text-xs">{categoryLabel(e.category)}</Badge>
                </div>
                <div className="flex gap-1">
                  <Button onClick={() => { setEditing(e); setDialogOpen(true); }} aria-label="সম্পাদনা"><Pencil className="h-4 w-4" /></Button>
                  <Button onClick={() => { remove(e.id); toast.success("মুছে ফেলা হয়েছে"); }} aria-label="মুছুন"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {hist.length > 0 && (
        <section className="container mb-6">
          <h2 className="mb-3 font-display text-xl font-bold text-accent">ইতিহাসে এই দিনে</h2>
          <Card className="p-4 shadow-soft">
            <ul className="space-y-2">
              {hist.map((h, i) => (
                <li key={i}>
                  <span className="font-display font-bold text-primary">{toBanglaNum(h.year)}:</span>{" "}
                  {h.text}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      <EventDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultDate={d} editing={editing} />
    </PageShell>
  );
};

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
