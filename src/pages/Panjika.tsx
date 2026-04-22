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
  formatBanglaDate,
  formatTimeBangla,
  gregorianToBangla,
  kalPeriods,
  sunTimes,
  toBanglaNum,
  BANGLA_WEEKDAYS,
} from "@/lib/bangla-calendar";
import { Moon, Heart, Sparkles, AlertTriangle, Sun } from "lucide-react";

const TABS = [
  { id: "tithi", label: "একাদশী · পূর্ণিমা · অমাবস্যা", icon: Moon },
  { id: "wedding", label: "বিয়ের শুভ তারিখ ও লগ্ন", icon: Heart },
  { id: "kal", label: "কালবেলা ও অশুভ সময়", icon: AlertTriangle },
] as const;

const Panjika = () => {
  const [settings] = useSettings();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("tithi");
  const [year, setYear] = useState(new Date().getFullYear());

  const tz = settings.city === "Dhaka" ? 360 : 330;
  const c = CITIES[settings.city];

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
      <section className="container py-4">
        <div className="alpana-divider mb-2" />
        <h1 className="font-display text-3xl font-bold text-accent md:text-4xl">
          পঞ্জিকা — তিথি, লগ্ন ও কালবেলা
        </h1>
        <p className="mt-1 text-muted-foreground">
          বৈদিক পঞ্জিকা অনুসারে একাদশী, পূর্ণিমা, অমাবস্যা, বিয়ের শুভ তারিখ এবং
          কালবেলা/রাহুকালের তালিকা। ({settings.region === "BD" ? "ঢাকা" : "কলকাতা"} সময়)
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.id
                  ? "border-primary bg-primary text-primary-foreground shadow-warm"
                  : "border-border bg-card hover:bg-secondary"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <Button onClick={() => setYear((y) => y - 1)} aria-label="পূর্ববর্তী বছর">
              ←
            </Button>
            <span className="font-display text-lg font-bold text-accent">
              {toBanglaNum(year)}
            </span>
            <Button onClick={() => setYear((y) => y + 1)} aria-label="পরবর্তী বছর">
              →
            </Button>
          </div>
        </div>

        <div className="mt-4">
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
    একাদশী: "bg-primary/10 text-primary border-primary/30",
    পূর্ণিমা: "bg-gold/20 text-foreground border-gold/40",
    অমাবস্যা: "bg-accent/10 text-accent border-accent/30",
  } as const;

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([key, list]) => {
        const [, m] = key.split("-").map(Number);
        return (
          <div key={key}>
            <h3 className="mb-2 font-display text-xl font-bold text-accent">
              {GREGORIAN_MONTHS_BN[m]}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((it, i) => (
                <Card
                  key={i}
                  className={`border-2 p-4 shadow-soft ${colors[it.type]}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-display text-lg font-bold">
                        {it.type}
                        {it.name && ` (${it.name} একাদশী)`}
                      </div>
                      <div className="mt-1 text-sm opacity-90">
                        {toBanglaNum(it.date.getDate())}{" "}
                        {GREGORIAN_MONTHS_BN[it.date.getMonth()]} ·{" "}
                        {BANGLA_WEEKDAYS[it.date.getDay()]}
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        {it.paksha}
                      </Badge>
                    </div>
                    <Moon className="h-6 w-6 opacity-70" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
      {items.length === 0 && (
        <p className="text-muted-foreground">এই বছরের জন্য কিছু পাওয়া যায়নি।</p>
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
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        বৈদিক রীতি অনুসারে শুভ মাস, নক্ষত্র, তিথি ও বার মিলিয়ে নির্বাচিত শুভ
        বিবাহ তারিখ। প্রতিটির জন্য একটি অনুমোদিত লগ্ন-জানালা দেওয়া হয়েছে।
        মোট: <strong className="text-accent">{toBanglaNum(items.length)}</strong> টি
        শুভ দিন।
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((w, i) => (
          <Card
            key={i}
            className="border-2 border-festive/30 bg-festive/5 p-4 shadow-soft"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="font-display text-lg font-bold text-festive">
                  {toBanglaNum(w.date.getDate())}{" "}
                  {GREGORIAN_MONTHS_BN[w.date.getMonth()]}{" "}
                  {toBanglaNum(w.date.getFullYear())}
                </div>
                <div className="text-sm text-muted-foreground">
                  {w.weekday} · {w.banglaMonth} মাস
                </div>
                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                  <div>
                    <span className="text-muted-foreground">নক্ষত্র:</span>{" "}
                    <strong>{w.nakshatra}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">তিথি:</span>{" "}
                    <strong>{w.tithi}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">পক্ষ:</span>{" "}
                    {w.paksha}
                  </div>
                </div>
                <div className="mt-3 rounded-md border border-primary/30 bg-primary/5 p-2 text-sm">
                  <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                    শুভ লগ্ন
                  </div>
                  <div className="font-medium">{w.lagna}</div>
                </div>
              </div>
              <div className="text-center">
                <Heart className="mx-auto h-6 w-6 text-festive" />
                <div className="mt-1 font-display text-2xl font-bold text-festive">
                  {toBanglaNum(w.score)}
                </div>
                <div className="text-[10px] text-muted-foreground">শুভ স্কোর</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-muted-foreground">এই বছরে কোনো শুভ দিন পাওয়া যায়নি।</p>
      )}
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
    <div className="space-y-4">
      <Card className="border-2 border-accent/30 p-4 shadow-soft">
        <div className="flex items-center gap-2 text-sm">
          <Sun className="h-4 w-4 text-gold" />
          <span className="text-muted-foreground">{cityLabel} —</span>
          সূর্যোদয়: <strong>{formatTimeBangla(sunrise, tz)}</strong>
          <span className="text-muted-foreground">·</span>
          সূর্যাস্ত: <strong>{formatTimeBangla(sunset, tz)}</strong>
        </div>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {periods.map((p, i) => (
          <Card
            key={i}
            className="border-2 border-destructive/20 bg-destructive/5 p-4 shadow-soft"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div className="font-display text-lg font-bold text-destructive">
                {p.name}
              </div>
            </div>
            <div className="mt-2 text-sm">
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
