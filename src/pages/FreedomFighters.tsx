import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar as CalIcon, MapPin, BookOpen, ExternalLink, Loader2, X } from "lucide-react";
import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FREEDOM_FIGHTERS, type FreedomFighter } from "@/data/freedom-fighters";
import { toBanglaNum } from "@/lib/bangla-calendar";

const BN_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

function formatDateBn(iso?: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return `${toBanglaNum(d)} ${BN_MONTHS[m - 1]} ${toBanglaNum(y)}`;
}

interface WikiData {
  extract: string;
  thumbnail?: string;
  originalimage?: string;
  desktop_url: string;
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
            <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">স্বাধীনতা সংগ্রামী</h1>
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
  const [open, setOpen] = useState(false);
  const [wiki, setWiki] = useState<WikiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && !wiki && !loading) {
      const fetchWiki = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `https://bn.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(f.name.replace(/\s+/g, "_"))}`
          );
          
          if (response.ok) {
            const data = await response.json();
            // Heuristic to check for Bengali characters to avoid accidental English content
            const hasBengali = /[\u0980-\u09FF]/.test(data.extract);
            
            if (hasBengali) {
              setWiki({
                extract: data.extract,
                thumbnail: data.thumbnail?.source,
                originalimage: data.originalimage?.source,
                desktop_url: data.content_urls.desktop.page
              });
            } else {
              // If wiki content is English, don't set it, so it falls back to local f.description
              setWiki(null);
            }
          } else {
            // No Bengali page found
            setWiki(null);
          }
        } catch (err) {
          console.error("Wiki fetch error:", err);
          setError("তথ্য সংগ্রহে সমস্যা হচ্ছে");
        } finally {
          setLoading(false);
        }
      };
      fetchWiki();
    }
  }, [open, wiki, loading, f.name, f.nameEn]);

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
            <h3 className="font-display text-xl font-bold leading-tight text-accent group-hover:text-primary transition-colors">{f.name}</h3>
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full h-10 justify-center gap-2 text-primary font-bold bg-primary/5 hover:bg-primary/10 rounded-xl"
              >
                <BookOpen className="h-4 w-4" />
                আরও জানুন (Wikipedia)
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl w-[90vw] h-[500px] md:h-[450px] rounded-[2rem] overflow-hidden border-none p-0 bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row">
                {/* Left Side: Image Panel */}
                <div className="relative w-full md:w-[35%] h-40 md:h-full bg-gradient-festive shrink-0 overflow-hidden">
                   {(wiki?.originalimage || wiki?.thumbnail) ? (
                    <img 
                      src={wiki.originalimage || wiki.thumbnail} 
                      alt={f.name} 
                      className="h-full w-full object-cover opacity-90"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-white/30">
                      <span className="text-7xl drop-shadow-lg">{f.emoji ?? "🇮🇳"}</span>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center">চিত্র নেই</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10" />
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-[1px] bg-primary/5 self-stretch" />

                {/* Right Side: Information Panel */}
                <div className="flex-1 flex flex-col min-w-0 bg-white/40">
                  {/* Header */}
                  <div className="p-6 md:p-8 pb-4 border-b border-primary/5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-accent truncate">{f.name}</h2>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="h-1 w-8 bg-primary/30 rounded-full" />
                          <p className="text-xs text-primary font-bold uppercase tracking-wider">{f.role}</p>
                        </div>
                      </div>
                      {/* Note: Shadcn Dialog includes a default close button, so we don't need a manual one here unless we hide the default one */}
                    </div>
                  </div>

                  {/* Content - Scrollable */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 pt-4">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
                        <p className="text-xs text-muted-foreground font-medium animate-pulse">লোড হচ্ছে...</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                            <BookOpen className="h-3.5 w-3.5" />
                            সংক্ষিপ্ত জীবনী (বাংলা)
                          </div>
                          <p className="text-sm md:text-base leading-relaxed text-foreground/80 font-medium italic text-justify md:text-left">
                            {wiki?.extract || f.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-primary/5 pt-6">
                          <div className="space-y-1">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-60">জন্ম</div>
                            <div className="text-xs font-bold text-accent">{formatDateBn(f.birth)}</div>
                          </div>
                          {f.death && (
                            <div className="space-y-1">
                              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-60">প্রয়াণ</div>
                              <div className="text-xs font-bold text-accent">{formatDateBn(f.death)}</div>
                            </div>
                          )}
                        </div>

                        {wiki?.desktop_url && (
                          <div className="pt-4 pb-2">
                            <a 
                              href={wiki.desktop_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="group flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/10"
                            >
                              বিস্তারিত পড়ুন
                              <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
}

export default FreedomFightersPage;
