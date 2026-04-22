import { useState, useMemo } from "react";
import { PageShell } from "@/components/calendar/PageShell";
import { FestivalCard } from "@/components/calendar/FestivalCard";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/hooks/use-settings";
import { festivalsInYear, type FestivalType } from "@/data/festivals";
import { toBanglaNum } from "@/lib/bangla-calendar";
import { cn } from "@/lib/utils";

const TYPES: { value: FestivalType | "all"; label: string }[] = [
  { value: "all", label: "সব" },
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
      <section className="container py-6">
        <h1 className="font-display text-3xl font-bold text-accent">উৎসব ও ছুটির তালিকা</h1>
        <p className="mt-2 text-muted-foreground">
          {settings.region === "BD" ? "বাংলাদেশ" : "পশ্চিমবঙ্গ"} অঞ্চলের জন্য — {toBanglaNum(year)} সাল
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Input
            placeholder="উৎসব খুঁজুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex gap-1">
            {[year - 1, year, year + 1].map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-semibold",
                  y === year ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-primary/10",
                )}
              >
                {toBanglaNum(y)}
              </button>
            ))}
          </div>
          <div className="ml-auto flex flex-wrap gap-1">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  t.value === type ? "bg-accent text-accent-foreground" : "bg-secondary hover:bg-accent/10",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {list.map(({ festival, date }) => (
            <FestivalCard key={festival.id + date.toISOString()} festival={festival} date={date} region={settings.region} />
          ))}
        </div>
        {list.length === 0 && (
          <p className="mt-10 text-center text-muted-foreground">কোনো উৎসব পাওয়া যায়নি</p>
        )}
      </section>
    </PageShell>
  );
};

export default Festivals;
