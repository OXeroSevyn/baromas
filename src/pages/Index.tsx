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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BengaliWikiDialog } from "@/components/calendar/BengaliWikiDialog";
import { BookOpen } from "lucide-react";

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
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("has_seen_welcome");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem("has_seen_welcome", "true");
    }
  }, []);

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
              <Card className="overflow-hidden border border-festive/10 p-5 shadow-soft bg-gradient-to-br from-background to-festive/5 group relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-festive">
                    ঋতুর রন্ধন
                  </div>
                  <BengaliWikiDialog 
                    query={bn.ritu}
                    title={`${bn.ritu} ঋতু`}
                    subtitle="বাংলার ছয় ঋতু"
                    trigger={
                      <button className="text-[10px] font-bold text-primary hover:underline transition-all">ঋতু সম্পর্কে জানুন</button>
                    }
                  />
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-background shadow-inner overflow-hidden ring-2 ring-white/50">
                    {recipe.image ? (
                      <img src={recipe.image} alt={recipe.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-4xl">🥘</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-display text-xl font-bold text-accent">{recipe.name}</div>
                      <BengaliWikiDialog 
                        query={recipe.name}
                        title={recipe.name}
                        subtitle={`${bn.ritu} ঋতুর খাবার`}
                        fallbackText={recipe.description}
                        trigger={
                          <button className="p-1.5 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                            <BookOpen className="h-3.5 w-3.5" />
                          </button>
                        }
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">{bn.ritu} ঋতুর বিশেষ স্বাদ</div>
                    <p className="mt-2 text-sm line-clamp-2 text-foreground/70">{recipe.description}</p>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-5 shadow-soft bg-gradient-to-br from-background to-secondary/30 border-primary/5">
              <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-4">
                দ্রুত অ্যাক্সেস
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <QuickLink to="/panjika" label="পঞ্জিকা" emoji="📅" image="/branding/icons/panjika.png" />
                <QuickLink to="/horoscope" label="রাশিফল" emoji="🌟" />
                <QuickLink to="/news" label="সংবাদ" emoji="📰" />
                <QuickLink to="/weather" label="আবহাওয়া" emoji="☀️" image="/branding/icons/sun.png" />
                <QuickLink to="/market" label="বাজার দর" emoji="📈" />
                <QuickLink to="/mantras" label="মন্ত্র" emoji="📜" />
                <QuickLink to="/festivals" label="উৎসব" emoji="✨" image="/branding/icons/festivals.png" />
                <QuickLink to="/election-day" label="নির্বাচনী দিন" emoji="🗳️" image="/branding/icons/election.png" />
                <QuickLink to="/tools" label="টুলস" emoji="🛠️" image="/branding/icons/tools.png" />
                <QuickLink to="/freedom-fighters" label="দেশপ্রেমী" emoji="🇮🇳" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-secondary/20 py-8">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-accent">সাহিত্য ও সংস্কৃতি</h2>
          </div>
          <div className="mb-6">
            <QuoteOfDay />
          </div>

          {historical && historical.length > 0 && (
            <Card className="p-6 shadow-soft border-l-4 border-l-accent overflow-hidden relative max-w-3xl mx-auto bg-white/60 backdrop-blur-md">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                <BookOpen className="h-32 w-32 -rotate-12" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wide text-accent mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                ইতিহাসে আজকের দিন
              </div>
              <div className="grid gap-6 md:grid-cols-2 relative">
                {historical.slice(0, 4).map((h, i) => (
                  <div key={i} className="group relative pl-4 border-l border-accent/10 hover:border-accent transition-colors">
                    <div className="font-display text-lg font-bold text-primary mb-1">
                      {toBanglaNum(h.year)}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80 line-clamp-3">
                      {h.text}
                    </p>
                    <div className="mt-2">
                      <BengaliWikiDialog 
                        query={h.text.split(" ").slice(0, 3).join(" ")} // Heuristic query
                        title={`ইতিহাস: ${toBanglaNum(h.year)}`}
                        subtitle="আজকের দিনের ঘটনা"
                        fallbackText={h.text}
                        trigger={
                          <button className="text-[10px] font-bold text-accent/60 hover:text-accent flex items-center gap-1 transition-colors">
                            বিস্তারিত জানুন <ChevronRight className="h-2 w-2" />
                          </button>
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
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

      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="max-w-md rounded-3xl border-orange-100 shadow-2xl p-0 overflow-hidden bg-gradient-cream">
          <div className="h-24 bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center relative">
            <div className="absolute -bottom-10 bg-white p-2 rounded-2xl shadow-lg border border-orange-100 h-20 w-20 flex items-center justify-center">
              <img src="/branding/logo-color.png" alt="Logo" className="h-full object-contain" />
            </div>
          </div>
          
          <div className="px-8 pb-8 pt-12 text-center">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl font-bold text-accent mb-4">স্বাগতম বারোমাসে</DialogTitle>
              <DialogDescription className="sr-only">বাংলার সময়, সংস্কৃতি আর উৎসবের ডিজিটাল ঠিকানায় আপনাকে স্বাগতম।</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 text-accent/80 text-sm leading-relaxed text-justify">
              <p className="font-bold text-center text-primary italic">"বাংলার সময়, সংস্কৃতি আর উৎসবের ডিজিটাল ঠিকানায়"</p>
              <p>এখানে প্রতিটি দিন শুধু তারিখ নয়, একেকটি গল্প। পঞ্জিকা, তিথি, রাশি, শুভ মুহূর্ত আর বাঙালিয়ানার স্পন্দন—সব একসাথে, এক ছাদের নিচে।</p>
              <p>বারো মাস, তেরো পার্বণ — আর আপনার প্রতিদিনের সঙ্গী আমরা। 🌿 আজকের দিনটা শুরু হোক শুভ আলোয়।</p>
              <div className="pt-4 border-t border-orange-100">
                <p className="text-xs text-muted-foreground italic">"ভুল ত্রুটি মার্জনা করে আমাকে অ্যাপটি ভালোভাবে build করতে সাহায্য করুন।"</p>
                <p className="text-sm font-bold text-accent mt-2">ইতি, শুভম দে</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowWelcome(false)}
              className="mt-8 w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
            >
              শুরু করুন
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default Index;
