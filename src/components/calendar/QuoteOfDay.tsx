import { Card } from "@/components/ui/card";
import { quoteForDay } from "@/data/quotes";
import { proverbForDay } from "@/data/proverbs";
import { factForDay, songForDay } from "@/data/songs";
import { Quote as QuoteIcon, Music, Lightbulb, Sparkles } from "lucide-react";

export function QuoteOfDay() {
  const today = new Date();
  const q = quoteForDay(today);
  const p = proverbForDay(today);
  const s = songForDay(today);
  const f = factForDay(today);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-l-4 border-l-primary p-5 shadow-soft">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
          <QuoteIcon className="h-4 w-4" /> দিনের উদ্ধৃতি
        </div>
        <p className="mt-3 font-decorative text-lg leading-relaxed text-foreground">"{q.text}"</p>
        <p className="mt-2 text-sm text-muted-foreground">— {q.author}</p>
      </Card>

      <Card className="border-l-4 border-l-gold p-5 shadow-soft">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold-foreground">
          <Sparkles className="h-4 w-4 text-gold" /> বাংলা প্রবাদ
        </div>
        <p className="mt-3 font-decorative text-lg leading-relaxed text-foreground">"{p}"</p>
      </Card>

      <Card className="border-l-4 border-l-accent p-5 shadow-soft">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
          <Music className="h-4 w-4" /> দিনের গান — {s.title}
        </div>
        <div className="mt-3 space-y-1 font-decorative text-base leading-relaxed text-foreground">
          {s.lines.map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">— {s.source}</p>
      </Card>

      <Card className="border-l-4 border-l-festive p-5 shadow-soft">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-festive">
          <Lightbulb className="h-4 w-4" /> জানেন কি?
        </div>
        <p className="mt-3 text-base leading-relaxed text-foreground">{f}</p>
      </Card>
    </div>
  );
}
