import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar as CalIcon, MapPin, BookOpen } from "lucide-react";
import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FREEDOM_FIGHTERS, type FreedomFighter } from "@/data/freedom-fighters";
import { toBanglaNum } from "@/lib/bangla-calendar";
import { BengaliWikiDialog } from "@/components/calendar/BengaliWikiDialog";

const BN_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

function formatDateBn(iso?: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return `${toBanglaNum(d)} ${BN_MONTHS[m - 1]} ${toBanglaNum(y)}`;
}

const FreedomFightersPage = () => {
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return FREEDOM_FIGHTERS;
    return FREEDOM_FIGHTERS.filter(
      (f) =>
        f.name.includes(q) ||
        f.nameEn.toLowerCase().includes(t) ||
        f.role.toLowerCase().includes(t) ||
        f.movements.some((m) => m.toLowerCase().includes(t)),
    );
  }, [q]);

  return (
    <PageShell>
      <section className="container py-6">
        <div className="mb-4 flex items-center justify-between">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← মূল পাতা</Link>
        </div>

        <Card className="mb-6 overflow-hidden border-2 border-primary/20 shadow-warm">
          <div className="bg-gradient-festive p-6 text-primary-foreground">
            <div className="text-xs uppercase tracking-wider opacity-90">ভারতের স্বাধীনতা সংগ্রাম</div>
            <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl py-1">স্বাধীনতা সংগ্রামী</h1>
            <p className="mt-2 max-w-2xl text-sm opacity-95">
              ভারতের স্বাধীনতার জন্য আত্মত্যাগী মহান ব্যক্তিত্বদের জীবন, সংগ্রাম ও অবদানের বিস্তারিত পরিচয়।
            </p>
          </div>
        </Card>

        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="নাম, ভূমিকা বা আন্দোলন দিয়ে খুঁজুন..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 bg-white/50 backdrop-blur-sm border-primary/10 focus:border-primary/30"
            />
          </div>
          <Badge variant="secondary" className="shrink-0 h-10 px-4">
            মোট {toBanglaNum(list.length)} জন
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-start">
          {list.map((f) => (
            <FighterCard key={f.id} f={f} />
          ))}
        </div>

        {list.length === 0 && (
          <Card className="p-12 text-center text-muted-foreground bg-white/40 backdrop-blur-md">
            কোনো ফলাফল পাওয়া যায়নি
          </Card>
        )}
      </section>
    </PageShell>
  );
};

function FighterCard({ f }: { f: FreedomFighter }) {
  return (
    <Card className="group relative overflow-hidden p-0 shadow-soft transition-all duration-300 hover:shadow-xl hover:border-primary/30 border-primary/5 bg-white/60 backdrop-blur-md">
      <div className="p-5">
        <div className="flex gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-festive overflow-hidden shadow-inner ring-2 ring-white/50">
            {f.image ? (
              <img src={f.image} alt={f.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
            ) : (
              <span className="text-3xl text-primary-foreground">{f.emoji ?? "🇮🇳"}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xl font-bold leading-tight text-accent group-hover:text-primary transition-colors py-1">{f.name}</h3>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-tight">{f.nameEn}</div>
            <div className="mt-1 text-sm font-semibold text-primary/80">{f.role}</div>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-foreground/85">{f.description}</p>

        {f.legacy && (
          <p className="mt-2 text-xs italic text-muted-foreground/70 border-l-2 border-primary/20 pl-2">{f.legacy}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {f.movements.map((m) => (
            <Badge key={m} variant="secondary" className="text-[10px] bg-primary/5 text-primary-foreground/70 hover:bg-primary/10 transition-colors">{m}</Badge>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 border-t border-primary/10 pt-4 text-xs sm:grid-cols-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-1 rounded-md bg-primary/5">
               <CalIcon className="h-3 w-3 text-primary/60" />
            </div>
            <span>জন্ম: <span className="text-foreground font-medium">{formatDateBn(f.birth)}</span></span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
             <div className="p-1 rounded-md bg-primary/5">
                <CalIcon className="h-3 w-3 text-primary/60" />
             </div>
            <span>প্রয়াণ: <span className="text-foreground font-medium">{formatDateBn(f.death)}</span></span>
          </div>
          {f.birthPlace && (
            <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
              <div className="p-1 rounded-md bg-primary/5">
                <MapPin className="h-3 w-3 text-primary/60" />
              </div>
              <span className="truncate">{f.birthPlace}</span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <BengaliWikiDialog 
            query={f.name}
            title={f.name}
            subtitle={f.role}
            fallbackText={f.description}
            trigger={
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full h-10 justify-center gap-2 text-primary font-bold bg-primary/5 hover:bg-primary/10 rounded-xl"
              >
                <BookOpen className="h-4 w-4" />
                আরও জানুন (Wikipedia)
              </Button>
            }
          />
        </div>
      </div>
    </Card>
  );
}

export default FreedomFightersPage;
