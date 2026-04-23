import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, BookOpen, ExternalLink } from "lucide-react";

interface WikiData {
  extract: string;
  thumbnail?: string;
  originalimage?: string;
  desktop_url: string;
}

interface BengaliWikiDialogProps {
  query: string;
  title: string;
  subtitle?: string;
  trigger: React.ReactNode;
  fallbackText?: string;
}

export function BengaliWikiDialog({ query, title, subtitle, trigger, fallbackText }: BengaliWikiDialogProps) {
  const [open, setOpen] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [wiki, setWiki] = useState<WikiData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && !hasAttempted && !loading) {
      const fetchWiki = async () => {
        setLoading(true);
        try {
          // Try Bengali Wikipedia first
          const response = await fetch(
            `https://bn.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/\s+/g, "_"))}`
          );
          
          if (response.ok) {
            const data = await response.json();
            const hasBengali = /[\u0980-\u09FF]/.test(data.extract);
            
            if (hasBengali) {
              setWiki({
                extract: data.extract,
                thumbnail: data.thumbnail?.source,
                originalimage: data.originalimage?.source,
                desktop_url: data.content_urls.desktop.page
              });
            }
          }
        } catch (err) {
          console.error("Wiki fetch error:", err);
        } finally {
          setLoading(false);
          setHasAttempted(true);
        }
      };
      fetchWiki();
    }
  }, [open, hasAttempted, loading, query]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white/95 backdrop-blur-2xl border-none shadow-2xl max-h-[85vh] flex flex-col rounded-3xl">
        <div className="flex h-full flex-col">
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8 pb-0 border-b border-primary/5">
              <DialogHeader className="text-left space-y-3 pt-2">
                <DialogTitle className="text-3xl md:text-4xl font-bold text-primary leading-[1.3] py-1">
                  {title}
                </DialogTitle>
                {subtitle && (
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-12 bg-primary/20 rounded-full shrink-0" />
                    <p className="text-sm md:text-base font-semibold text-accent leading-tight">
                      {subtitle}
                    </p>
                  </div>
                )}
              </DialogHeader>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 pt-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
                  <p className="text-xs text-muted-foreground font-medium animate-pulse">লোড হচ্ছে...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                      <BookOpen className="h-3.5 w-3.5" />
                      তথ্য ও সংক্ষিপ্ত সার (বাংলা)
                    </div>
                    <p className="text-sm md:text-base leading-relaxed text-foreground/80 font-medium italic text-justify md:text-left border-l-4 border-primary/10 pl-4">
                      {wiki?.extract || fallbackText || "দুঃখিত, এই বিষয়ে কোনো বাংলা তথ্য পাওয়া যায়নি।"}
                    </p>
                  </div>

                  {wiki?.desktop_url && (
                    <div className="pt-4 pb-2">
                      <a 
                        href={wiki.desktop_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/10"
                      >
                        বিস্তারিত পড়ুন (Wikipedia)
                        <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
