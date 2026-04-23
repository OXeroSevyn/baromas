import { useState, useMemo } from "react";
import { PageShell } from "@/components/calendar/PageShell";
import { FestivalCard } from "@/components/calendar/FestivalCard";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/hooks/use-settings";
import { festivalsInYear, type FestivalType } from "@/data/festivals";
import { toBanglaNum } from "@/lib/bangla-calendar";
import { cn } from "@/lib/utils";
import { Search, Calendar, Filter, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/calendar/IconButton";

const TYPES: { value: FestivalType | "all"; label: string }[] = [
  { value: "all", label: "সব উৎসব" },
  { value: "national", label: "জাতীয়" },
  { value: "cultural", label: "সাংস্কৃতিক" },
  { value: "literary", label: "সাহিত্যিক" },
  { value: "seasonal", label: "ঋতুভিত্তিক" },
];

const Festivals = () => {
  const [settings] = useSettings();
  const [year, setYear] = useState(new Date().getFullYear());
  const [type, setType] = useState<FestivalType | "all">("all");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const all = festivalsInYear(year, settings.region);
    return all.filter(({ festival }) => {
      if (type !== "all" && festival.type !== type) return false;
      if (query && !festival.name.includes(query) && !(festival.englishName ?? "").toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [year, type, query, settings.region]);

  return (
    <PageShell>
      <section className="container py-12 space-y-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between border-b border-primary/5 pb-12">
           <div className="space-y-3">
              <div className="flex items-center gap-2">
                 <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest px-3 py-1 uppercase">ইভেন্ট ডিরেক্টরি</Badge>
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-black text-accent tracking-tighter leading-[1.1] py-2">
                উৎসব ও <span className="text-primary/30">ছুটির তালিকা</span>
              </h1>
              <p className="max-w-2xl text-sm font-medium text-muted-foreground leading-relaxed">
                {settings.region === "BD" ? "বাংলাদেশ" : "পশ্চিমবঙ্গ"} অঞ্চলের জন্য নির্ধারিত সকল জাতীয়, সাংস্কৃতিক ও ধর্মীয় উৎসবের বিস্তারিত ডিরেক্টরি।
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

        <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
           {/* High-Fidelity Search Bar */}
           <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="আপনার প্রিয় উৎসবটি খুঁজুন..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-16 pl-14 pr-8 rounded-[24px] border-none bg-card/40 backdrop-blur-md text-sm font-bold shadow-xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
              />
           </div>

           {/* Category Chips */}
           <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
             <div className="flex gap-3">
               {TYPES.map((t) => (
                 <button
                   key={t.value}
                   onClick={() => setType(t.value)}
                   className={cn(
                     "shrink-0 rounded-[20px] px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                     t.value === type 
                       ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                       : "bg-card/40 backdrop-blur-md border border-primary/5 text-accent hover:bg-primary/10",
                   )}
                 >
                   {t.label}
                 </button>
               ))}
             </div>
           </div>
        </div>

        <div className="animate-fade-in-up">
           {list.length > 0 ? (
             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
               {list.map(({ festival, date }) => (
                 <FestivalCard 
                   key={festival.id + date.toISOString()} 
                   festival={festival} 
                   date={date} 
                   region={settings.region} 
                 />
               ))}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center py-32 bg-card/20 rounded-[40px] border border-dashed border-primary/10">
                <Sparkles className="h-16 w-16 text-primary/20 mb-6" />
                <h3 className="text-xl font-black text-accent mb-2">কোনো উৎসব পাওয়া যায়নি</h3>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">অনুগ্রহ করে ভিন্ন কিছু খুঁজুন</p>
             </div>
           )}
        </div>
      </section>
    </PageShell>
  );
};

export default Festivals;
