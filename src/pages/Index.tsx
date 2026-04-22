import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageShell } from "@/components/calendar/PageShell";
import { TodayCard } from "@/components/calendar/TodayCard";
import { CountdownStrip } from "@/components/calendar/CountdownStrip";
import { QuoteOfDay } from "@/components/calendar/QuoteOfDay";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { Button } from "@/components/calendar/IconButton";
import { useSettings } from "@/hooks/use-settings";
import { useEvents } from "@/hooks/use-events";
import { GREGORIAN_MONTHS_BN, toBanglaNum, isoDate, gregorianToBangla } from "@/lib/bangla-calendar";
import { recipeForRitu } from "@/data/recipes";
import { Card } from "@/components/ui/card";
import { eventsOnDate } from "@/data/historical-events";
import { PanjikaCard } from "@/components/calendar/PanjikaCard";

// Helper components moved to top for absolute safety
function QuickLink({ to, label, emoji, image }: { to: string; label: string; emoji: string; image?: string }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-3 text-center transition-all hover:border-primary hover:bg-primary/5 hover:shadow-soft active:scale-95"
    >
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={label} className="h-full w-full object-contain" />
        ) : (
          <span className="text-xl">{emoji}</span>
        )}
      </div>
      <span className="text-xs font-bold whitespace-nowrap">{label}</span>
    </Link>
  );
}

function FeatureCard({ title, desc, icon, image }: { title: string; desc: string; icon: string; image?: string }) {
  return (
    <Card className="p-6 text-center shadow-soft hover:shadow-warm transition-all border-b-4 border-b-primary">
      <div className="mb-4 flex h-12 w-full items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="h-full object-contain" />
        ) : (
          <div className="text-4xl">{icon}</div>
        )}
      </div>
      <h3 className="font-display text-xl font-bold text-accent mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </Card>
  );
}

const Index = () => {
  const [settings] = useSettings();
  const { events } = useEvents();
  const navigate = useNavigate();
  const [cursor, setCursor] = useState(() => {
    const t = new Date();
    return { y: t.getFullYear(), m: t.getMonth() };
  });

  // Safe variables with fallbacks
  const today = new Date();
  const region = (settings && settings.region) || "WB";
  const city = (settings && settings.city) || "Kolkata";
  const bn = gregorianToBangla(today, region);
  const recipe = recipeForRitu(bn.ritu);
  const historical = eventsOnDate(today) || [];

  if (!settings) return (
    <div className="flex min-h-screen items-center justify-center p-10">
      <div className="animate-pulse text-xl text-primary font-bold">সেটিংস লোড হচ্ছে...</div>
    </div>
  );

  return (
    <PageShell>
      <section className="container py-4">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4">
            <div className="animate-fade-in-up">
              <TodayCard region={region} city={city} />
            </div>

            <div className="space-y-4 animate-fade-in-up [animation-delay:150ms]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-3xl font-bold text-accent">
                    {(GREGORIAN_MONTHS_BN && GREGORIAN_MONTHS_BN[cursor.m]) || ""} {toBanglaNum(cursor.y)}
                  </h2>
                  <p className="text-sm text-muted-foreground">ইংরেজি ক্যালেন্ডার ও বারোমাস সমন্বয়</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={() => setCursor((c) => ({ y: c.m === 0 ? c.y - 1 : c.y, m: (c.m + 11) % 12 }))}
                    className="h-10 w-10 p-0"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={() => {
                      const t = new Date();
                      setCursor({ y: t.getFullYear(), m: t.getMonth() });
                    }}
                    className="px-4 font-bold"
                  >
                    আজ
                  </Button>
                  <Button
                    onClick={() => setCursor((c) => ({ y: c.m === 11 ? c.y + 1 : c.y, m: (c.m + 1) % 12 }))}
                    className="h-10 w-10 p-0"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <MonthGrid
                year={cursor.y}
                month={cursor.m}
                region={region}
                startDay={settings.startDay || 0}
                events={events || []}
                onSelect={(d) => navigate(`/day/${isoDate(d)}`)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 animate-fade-in-up [animation-delay:100ms]">
            <PanjikaCard region={region} city={city} />

            {recipe && (
              <Card className="overflow-hidden border-2 border-festive/10 p-5 shadow-soft bg-gradient-to-br from-background to-festive/5">
                <div className="text-xs font-semibold uppercase tracking-wide text-festive mb-2">
                  ঋতুর রন্ধন
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-background shadow-inner overflow-hidden">
                    {recipe.image ? (
                      <img src={recipe.image} alt={recipe.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-4xl">🥘</span>
                    )}
                  </div>
                  <div>
                    <div className="font-display text-xl font-bold text-accent">{recipe.name}</div>
                    <div className="text-sm text-muted-foreground">{bn.ritu} ঋতুর বিশেষ স্বাদ</div>
                    <p className="mt-2 text-sm line-clamp-2">{recipe.description}</p>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-5 shadow-soft bg-gradient-to-br from-background to-secondary/30">
              <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-4">
                দ্রুত অ্যাক্সেস
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <QuickLink to="/panjika" label="পঞ্জিকা" emoji="📅" image="/branding/icons/panjika.png" />
                <QuickLink to="/festivals" label="উৎসব" emoji="✨" image="/branding/icons/festivals.png" />
                <QuickLink to="/events" label="ইভেন্ট" emoji="📝" image="/branding/icons/events.png" />
                <QuickLink to="/tools" label="টুলস" emoji="🛠️" image="/branding/icons/tools.png" />
                <QuickLink to="/election-day" label="নির্বাচনী দিন" emoji="🗳️" image="/branding/icons/election.png" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-secondary/20 py-6">
        <div className="container">
          <div className="mb-3">
            <h2 className="font-display text-2xl font-bold text-accent">সাহিত্য ও সংস্কৃতি</h2>
          </div>
          <div className="mb-4">
            <QuoteOfDay />
          </div>

          {historical && historical.length > 0 && (
            <Card className="p-6 shadow-soft border-l-4 border-l-accent overflow-hidden relative max-w-3xl mx-auto">
              <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                <ChevronRight className="h-24 w-24 -rotate-12" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">
                ইতিহাসে আজকের দিন
              </div>
              <ul className="grid gap-4 md:grid-cols-2 relative">
                {historical.slice(0, 4).map((h, i) => (
                  <li key={i} className="text-sm leading-relaxed">
                    <span className="font-display font-bold text-primary">
                      {toBanglaNum(h.year)}:
                    </span>{" "}
                    {h.text}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </section>

      <section className="container py-6">
        <div className="alpana-divider mb-4" />
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <FeatureCard title="সঠিক সময়" desc="সূর্যোদয় ও সূর্যাস্তের নিখুঁত হিসাব" icon="☀️" image="/branding/icons/sun.png" />
          <FeatureCard title="তিথি ও নক্ষত্র" desc="প্রাচীন গাণিতিক নিয়মে তিথি গণনা" icon="🌙" image="/branding/icons/moon.png" />
          <FeatureCard title="শুভক্ষণ" desc="প্রতিদিনের অমৃতযোগ ও মাহেন্দ্রযোগ" icon="✨" image="/branding/icons/star.png" />
        </div>
      </section>
    </PageShell>
  );
};

export default Index;
