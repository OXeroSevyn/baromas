import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Timer, 
  Newspaper, 
  TrendingUp, 
  ArrowRight, 
  Clock, 
  MapPin, 
  RefreshCcw, 
  X,
  ChevronLeft,
  ChevronRight,
  Globe,
  Share2,
  Bookmark
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toBanglaNum } from "@/lib/bangla-calendar";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  time: string;
  category: string;
  description: string;
  image: string;
}

const News = () => {
  const CACHE_KEY = "news_cache_v6_final_bengali";
  
  const [news, setNews] = useState<NewsItem[]>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data } = JSON.parse(cached);
        return data || [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [loading, setLoading] = useState(!localStorage.getItem(CACHE_KEY));
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lastUpdateText, setLastUpdateText] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { timestamp } = JSON.parse(cached);
        if (timestamp) {
          const date = new Date(timestamp);
          if (!isNaN(date.getTime())) {
            return toBanglaNum(date.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }));
          }
        }
      } catch (e) {
        return "";
      }
    }
    return "";
  });

  // Strictly check for Bengali characters to avoid any English slip-throughs
  const isStrictlyBengali = (text: string): boolean => {
    return /[\u0980-\u09FF]/.test(text);
  };

  const checkAndFetchNews = async () => {
    // Version 6: Final Bengali enforcement with fixed images
    const cachedData = localStorage.getItem(CACHE_KEY);
    const now = new Date();
    
    const sixAM = new Date(now).setHours(6, 0, 0, 0);
    const sixPM = new Date(now).setHours(18, 0, 0, 0);
    
    let shouldFetch = false;

    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData);
        if (timestamp) {
          const lastUpdate = new Date(timestamp);
          if (!isNaN(lastUpdate.getTime())) {
            // Update UI text immediately if not already set
            if (!lastUpdateText) {
              setLastUpdateText(toBanglaNum(lastUpdate.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })));
            }

            // Check if we passed a milestone (6AM or 6PM)
            if (now.getTime() >= sixAM && lastUpdate.getTime() < sixAM) shouldFetch = true;
            else if (now.getTime() >= sixPM && lastUpdate.getTime() < sixPM) shouldFetch = true;
            else if (now.getDate() !== lastUpdate.getDate() && now.getTime() > sixAM) shouldFetch = true;
          } else {
            shouldFetch = true;
          }
        } else {
          shouldFetch = true;
        }
      } catch (e) {
        shouldFetch = true;
      }
      
      if (!shouldFetch) {
        setLoading(false);
        return;
      }
    } else {
      shouldFetch = true;
    }

    if (shouldFetch) {
      // Only show loading if we have absolutely no news to show
      if (news.length === 0) setLoading(true);
      
      try {
        console.log("[News] Fetching Bengali-only updates...");
        
        const { fetchBengaliNewsRSS } = await import("@/lib/rss-fetcher");
        const results = await fetchBengaliNewsRSS("top"); 

        if (results && results.length > 0) {
          const filtered = results.filter(item => isStrictlyBengali(item.title));
          setNews(filtered);
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: filtered,
            timestamp: Date.now()
          }));
          setLastUpdateText(toBanglaNum(new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })));
        } else if (news.length === 0) {
          const { mockNews } = await import("@/data/mock-news");
          setNews(mockNews);
        }
      } catch (error) {
        console.error("News Fetching failed:", error);
        if (news.length === 0) {
          const { mockNews } = await import("@/data/mock-news");
          setNews(mockNews);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    checkAndFetchNews();
  }, []);

  // Auto-cycle slider
  useEffect(() => {
    if (news.length > 1 && !expandedId) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(news.length, 5));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [news.length, expandedId]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <PageShell>
      <div className="container py-6 animate-fade-in space-y-8 max-w-6xl mx-auto">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-primary/5 pb-8">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="destructive" className="animate-pulse flex items-center gap-1 text-[10px] px-2 py-0">
                <span className="h-1 w-1 rounded-full bg-white mr-1" /> লাইভ
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                <Timer className="h-3 w-3" /> আপডেট: {lastUpdateText}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 ml-2">
                 <MapPin className="h-3 w-3" /> পশ্চিমবঙ্গ
              </div>
            </div>
            <h1 className="font-display text-3xl font-bold text-accent tracking-tight">
              বাংলা <span className="text-primary/30">সংবাদ</span>
            </h1>
            <p className="text-xs text-muted-foreground font-medium">সম্পূর্ণরূপে বাংলা ভাষায় খবর পরিবেশন</p>
          </div>
          
          <div className="hidden md:flex items-center gap-3 bg-card/40 backdrop-blur-md border border-primary/5 px-4 py-2 rounded-xl">
             {loading ? <RefreshCcw className="h-4 w-4 text-primary animate-spin" /> : <TrendingUp className="h-4 w-4 text-primary" />}
             <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{loading ? "আপডেট হচ্ছে..." : "শীর্ষ ২০ খবর"}</span>
          </div>
        </header>

        {loading && news.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 animate-pulse bg-card/40 rounded-3xl border border-primary/5" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured News Slider */}
            {news.length > 0 && (
              <div className="relative group overflow-hidden rounded-[40px] shadow-2xl h-72 md:h-[450px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => toggleExpand(news[currentSlide].id)}
                  >
                    {/* Background Pattern/Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent/95 to-accent/80" />
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-accent via-transparent to-transparent" />
                    <div className="absolute inset-0 border-[0.5px] border-primary/10 rounded-[40px]" />

                    <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-10 pb-10 md:pb-16 text-left max-w-5xl">
                      <div className="space-y-2 md:space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="bg-primary text-white border-none text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] px-2 md:px-4 py-0.5 md:py-1 rounded-full shadow-lg">ব্রেকিং নিউজ</Badge>
                          <span className="text-[8px] md:text-[10px] font-bold text-white/90 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-primary animate-pulse" />
                            {news[currentSlide].source} • {toBanglaNum(new Date(news[currentSlide].time).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }))}
                          </span>
                        </div>
                        <h2 className="font-display text-lg md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-normal text-balance line-clamp-2 md:line-clamp-3 py-1">
                          {news[currentSlide].title}
                        </h2>
                        <p className="text-white/70 text-xs md:text-base font-medium line-clamp-2 md:line-clamp-3 max-w-2xl text-balance opacity-90 leading-relaxed pb-2">
                          {news[currentSlide].description}
                        </p>
                        
                        <div className="flex items-center gap-1.5 text-primary font-black text-xs md:text-sm uppercase tracking-[0.2em] pt-2">
                          বিস্তারিত পড়ুন <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Slider Controls */}
                <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide((prev) => (prev - 1 + Math.min(news.length, 5)) % Math.min(news.length, 5));
                    }}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 pointer-events-auto hover:bg-primary transition-all"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide((prev) => (prev + 1) % Math.min(news.length, 5));
                    }}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 pointer-events-auto hover:bg-primary transition-all"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>

                {/* Indicators */}
                <div className="absolute bottom-8 right-8 md:right-16 flex gap-2">
                  {news.slice(0, 5).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                      className={cn(
                        "h-1.5 transition-all duration-500 rounded-full",
                        currentSlide === idx ? "w-8 bg-primary" : "w-2 bg-white/30 hover:bg-white/50"
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {news.slice(1, 21).map((item) => (
                <Card 
                  key={item.id}
                  onClick={() => toggleExpand(item.id)}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-3xl border border-primary/5 bg-card/40 backdrop-blur-xl transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
                    expandedId === item.id ? "ring-1 ring-primary/20" : ""
                  )}
                >
                  <div className="absolute top-4 right-4 opacity-10">
                    <Newspaper className="h-12 w-12 text-primary" />
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">
                          {item.source}
                        </Badge>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-80">
                          <Clock className="h-3 w-3" />
                          {toBanglaNum(new Date(item.time).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-accent tracking-tight leading-normal line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-primary/5">
                      <span className="text-[8px] font-bold text-primary uppercase tracking-widest">বিস্তারিত পড়ুন</span>
                      <ArrowRight className="h-3 w-3 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {expandedId === item.id && (
                    <div className="absolute inset-0 bg-white z-20 animate-in fade-in zoom-in duration-300 p-6 overflow-y-auto rounded-3xl shadow-2xl border border-primary/10">
                      <div className="flex justify-between items-start mb-4">
                         <Badge className="bg-primary/10 text-primary border-none text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">{item.source}</Badge>
                         <button onClick={(e) => { e.stopPropagation(); setExpandedId(null); }} className="p-2 bg-muted rounded-full hover:bg-primary hover:text-white transition-all">
                            <X className="h-4 w-4" />
                         </button>
                      </div>
                      <h3 className="text-lg font-bold text-accent mb-4 leading-tight tracking-tight">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-medium">{item.description}</p>
                      
                      <div className="flex flex-col gap-3">
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full py-4 bg-primary text-white text-xs font-bold uppercase tracking-widest text-center rounded-xl shadow-lg hover:bg-primary/90 transition-all font-display"
                          onClick={(e) => e.stopPropagation()}
                        >
                          সম্পূর্ণ খবর পড়ুন
                        </a>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default News;
