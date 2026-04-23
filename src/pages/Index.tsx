import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, BookOpen, Utensils, Grid, History, Compass, Navigation } from "lucide-react";
import { PageShell } from "@/components/calendar/PageShell";
import { TodayCard } from "@/components/calendar/TodayCard";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BengaliWikiDialog } from "@/components/calendar/BengaliWikiDialog";

// Modernized Helper components
function QuickLink({ to, label, emoji, image }: { to: string; label: string; emoji: string; image?: string }) {
  return (
    <Link
      to={to}
      className="group flex flex-col items-center justify-center gap-3 rounded-[32px] border border-primary/5 bg-card/40 p-6 text-center transition-all hover:bg-primary/10 hover:shadow-xl active:scale-95 backdrop-blur-md"
    >
      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
        {image ? (
          <img src={image} alt={label} className="h-10 w-10 object-contain" />
        ) : (
          <span className="text-3xl">{emoji}</span>
        )}
      </div>
      <span className="text-xs font-black uppercase tracking-widest text-accent/80 group-hover:text-primary transition-colors">{label}</span>
    </Link>
  );
}

function FeatureCard({ title, desc, icon, image }: { title: string; desc: string; icon: string; image?: string }) {
  return (
    <Card className="p-8 rounded-[40px] bg-card/40 backdrop-blur-md border-none shadow-lg hover:shadow-2xl transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
         {image ? <img src={image} className="h-32" /> : <div className="text-7xl">{icon}</div>}
      </div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
          {image ? (
            <img src={image} alt={title} className="h-10 w-10 object-contain" />
          ) : (
            <div className="text-3xl">{icon}</div>
          )}
        </div>
        <h3 className="font-display text-xl font-black text-accent mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground font-medium leading-relaxed">{desc}</p>
      </div>
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

  const today = new Date();
  const region = (settings && settings.region) || "WB";
  const city = (settings && settings.city) || "Kolkata";
  const bn = gregorianToBangla(today, region);
  const recipe = recipeForRitu(bn.ritu);
  const historical = eventsOnDate(today) || [];

  if (!settings) return (
    <div className="flex min-h-screen items-center justify-center p-10 bg-background">
      <div className="animate-pulse text-2xl text-primary font-black tracking-widest uppercase">বারোমাস লোড হচ্ছে...</div>
    </div>
  );

  return (
    <PageShell>
      <section className="container py-8 space-y-12">
        {/* Hero Section */}
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-8">
            <div className="animate-fade-in-up">
              <TodayCard region={region} city={city} />
            </div>

            <div className="space-y-6 animate-fade-in-up [animation-delay:150ms]">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest px-3 py-1 uppercase">ক্যালেন্ডার</Badge>
                  </div>
                  <h2 className="font-display text-5xl md:text-6xl font-black text-accent tracking-tighter leading-[1.1] py-2">
                    {(GREGORIAN_MONTHS_BN && GREGORIAN_MONTHS_BN[cursor.m]) || ""}
                    <span className="text-primary/30 ml-2">{toBanglaNum(cursor.y)}</span>
                  </h2>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">ইংরেজি ক্যালেন্ডার ও বারোমাস সমন্বয়</p>
                </div>
                <div className="flex items-center gap-3 bg-card/40 backdrop-blur-md p-2 rounded-full border border-primary/5">
                  <Button
                    onClick={() => setCursor((c) => ({ y: c.m === 0 ? c.y - 1 : c.y, m: (c.m + 11) % 12 }))}
                    className="h-12 w-12 rounded-full bg-white/5 border-none hover:bg-primary/10 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    onClick={() => {
                      const t = new Date();
                      setCursor({ y: t.getFullYear(), m: t.getMonth() });
                    }}
                    className="px-6 h-12 rounded-full font-black text-xs uppercase tracking-widest"
                  >
                    আজ
                  </Button>
                  <Button
                    onClick={() => setCursor((c) => ({ y: c.m === 11 ? c.y + 1 : c.y, m: (c.m + 1) % 12 }))}
                    className="h-12 w-12 rounded-full bg-white/5 border-none hover:bg-primary/10 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              <div className="rounded-[40px] border border-primary/5 bg-card/30 backdrop-blur-md p-8 shadow-2xl">
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
          </div>

          <div className="flex flex-col gap-8 animate-fade-in-up [animation-delay:100ms]">
            <PanjikaCard region={region} city={city} />

            {recipe && (
              <Card className="overflow-hidden border-none p-8 shadow-2xl rounded-[40px] bg-card/40 backdrop-blur-md group relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                   <Utensils className="h-32 w-32" />
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-festive/10 text-festive border-none text-[10px] font-black tracking-widest px-3 py-1 uppercase">ঋতুর রন্ধন</Badge>
                  </div>
                  <BengaliWikiDialog 
                    query={bn.ritu}
                    title={`${bn.ritu} ঋতু`}
                    subtitle="বাংলার ছয় ঋতু"
                    trigger={
                      <button className="text-[10px] font-black text-primary hover:scale-105 transition-all uppercase tracking-widest opacity-60">ঋতু পরিচয়</button>
                    }
                  />
                </div>
                <div className="flex items-start gap-6">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[28px] bg-white/5 shadow-inner overflow-hidden border border-white/10 group-hover:rotate-6 transition-transform">
                    {recipe.image ? (
                      <img src={recipe.image} alt={recipe.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-5xl">🥘</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-display text-2xl font-black text-accent tracking-tight py-1">{recipe.name}</div>
                      <BengaliWikiDialog 
                        query={recipe.name}
                        title={recipe.name}
                        subtitle={`${bn.ritu} ঋতুর খাবার`}
                        fallbackText={recipe.description}
                        trigger={
                          <button className="p-2 rounded-2xl bg-primary/10 text-primary hover:scale-110 transition-all">
                            <BookOpen className="h-4 w-4" />
                          </button>
                        }
                      />
                    </div>
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-3">{bn.ritu} ঋতুর বিশেষ স্বাদ</div>
                    <p className="text-sm font-medium leading-relaxed text-foreground/70 line-clamp-2 italic">
                      "{recipe.description}"
                    </p>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-8 border-none shadow-2xl rounded-[40px] bg-card/40 backdrop-blur-md">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Grid className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">দ্রুত অ্যাক্সেস</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <QuickLink to="/panjika" label="পঞ্জিকা" emoji="📅" image="/branding/icons/panjika.png" />
                <QuickLink to="/horoscope" label="রাশিফল" emoji="🌟" />
                <QuickLink to="/news" label="সংবাদ" emoji="📰" />
                <QuickLink to="/weather" label="আবহাওয়া" emoji="☀️" image="/branding/icons/sun.png" />
                <QuickLink to="/market" label="বাজার দর" emoji="📈" />
                <QuickLink to="/mantras" label="মন্ত্র" emoji="📜" />
              </div>
              <div className="mt-8">
                 <Link to="/tools" className="flex items-center justify-center gap-3 w-full py-4 rounded-[24px] bg-primary/5 hover:bg-primary/10 text-primary font-black text-xs uppercase tracking-widest transition-all">
                    সমস্ত ফিচার দেখুন <Compass className="h-4 w-4" />
                 </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Literature & Culture */}
        <section className="space-y-8 py-8 border-t border-primary/5">
          <div className="flex flex-col gap-2">
            <Badge className="w-fit bg-accent/10 text-accent border-none text-[10px] font-black tracking-widest px-3 py-1 uppercase">সাহিত্য ও সংস্কৃতি</Badge>
            <h2 className="font-display text-5xl md:text-6xl font-black text-accent tracking-tighter leading-[1.1] py-2">বারোমাস <span className="text-primary/30">স্পন্দন</span></h2>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div className="animate-fade-in-up">
              <QuoteOfDay />
            </div>

            {historical && historical.length > 0 && (
              <Card className="p-10 shadow-2xl border-none rounded-[40px] bg-card/40 backdrop-blur-md overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                  <History className="h-64 w-64 -rotate-12" />
                </div>
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                    <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    ইতিহাসে আজকের দিন
                  </div>
                  
                  <div className="grid gap-8 sm:grid-cols-2">
                    {historical.slice(0, 4).map((h, i) => (
                      <div key={i} className="group/item space-y-3">
                        <div className="font-display text-3xl font-black text-primary transition-transform group-hover/item:translate-x-1">
                          {toBanglaNum(h.year)}
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-foreground/80 line-clamp-3">
                          {h.text}
                        </p>
                        <BengaliWikiDialog 
                          query={h.text.split(" ").slice(0, 3).join(" ")}
                          title={`ইতিহাস: ${toBanglaNum(h.year)}`}
                          subtitle="আজকের দিনের ঘটনা"
                          fallbackText={h.text}
                          trigger={
                            <button className="flex items-center gap-2 text-[10px] font-black text-accent/40 hover:text-accent transition-all uppercase tracking-widest">
                              জানুন <Navigation className="h-3 w-3" />
                            </button>
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-12">
          <div className="alpana-divider mb-12 opacity-20" />
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard title="সঠিক সময়" desc="সূর্যোদয় ও সূর্যাস্তের নিখুঁত হিসাব প্রতি শহরের জন্য।" icon="☀️" image="/branding/icons/sun.png" />
            <FeatureCard title="তিথি ও নক্ষত্র" desc="প্রাচীন গাণিতিক নিয়মে নির্ভুল তিথি ও নক্ষত্র গণনা।" icon="🌙" image="/branding/icons/moon.png" />
            <FeatureCard title="শুভক্ষণ" desc="প্রতিদিনের অমৃতযোগ ও মাহেন্দ্রযোগের সঠিক সময়।" icon="✨" image="/branding/icons/star.png" />
          </div>
        </section>
      </section>

      {/* Welcome Dialog */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="max-w-md rounded-[48px] border-none shadow-3xl p-0 overflow-hidden bg-background/80 backdrop-blur-2xl">
          <div className="h-32 bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center relative">
            <div className="absolute -bottom-12 bg-card p-4 rounded-[32px] shadow-2xl border border-primary/5 h-24 w-24 flex items-center justify-center">
              <img src="/branding/logo-color.png" alt="Logo" className="h-full object-contain" />
            </div>
          </div>
          
          <div className="px-10 pb-10 pt-16 text-center">
            <DialogHeader>
              <DialogTitle className="font-display text-3xl font-black text-accent mb-4 tracking-tighter py-1">স্বাগতম বারোমাসে</DialogTitle>
              <DialogDescription className="sr-only">বাংলার সময়, সংস্কৃতি আর উৎসবের ডিজিটাল ঠিকানায় আপনাকে স্বাগতম।</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 text-accent/80 text-sm leading-relaxed text-center font-medium">
              <p className="font-black text-primary italic text-base">"বাংলার সময়, সংস্কৃতি আর উৎসবের ডিজিটাল ঠিকানায়"</p>
              <p>এখানে প্রতিটি দিন শুধু তারিখ নয়, একেকটি গল্প। পঞ্জিকা, তিথি, রাশি আর বাঙালিয়ানার স্পন্দন—সব একসাথে।</p>
              <div className="pt-6 border-t border-primary/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">ইতি, শুভম দে</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowWelcome(false)}
              className="mt-8 w-full py-5 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-[24px] shadow-xl shadow-primary/30 hover:scale-[1.02] transition-all active:scale-95"
            >
              যাত্রা শুরু করুন
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default Index;
