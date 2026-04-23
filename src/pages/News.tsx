import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Newspaper, Globe, Clock, ArrowRight, Share2, 
  Bookmark, X, MapPin, Timer, TrendingUp, RefreshCcw
} from "lucide-react";
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
  const [news, setNews] = useState<NewsItem[]>([]);
  // Initialize loading to false if cache exists to stop "auto refresh" visual every time
  const [loading, setLoading] = useState(!localStorage.getItem("news_cache_v6_final_bengali"));
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lastUpdateText, setLastUpdateText] = useState("");

  // Strictly check for Bengali characters to avoid any English slip-throughs
  const isStrictlyBengali = (text: string): boolean => {
    return /[\u0980-\u09FF]/.test(text);
  };

  const checkAndFetchNews = async () => {
    // Version 6: Final Bengali enforcement with fixed images
    const CACHE_KEY = "news_cache_v6_final_bengali"; 
    const cachedData = localStorage.getItem(CACHE_KEY);
    const now = new Date();
    
    const sixAM = new Date(now).setHours(6, 0, 0, 0);
    const sixPM = new Date(now).setHours(18, 0, 0, 0);
    
    let shouldFetch = false;
    let initialData: NewsItem[] = [];

    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      // Extra safety: Filter out any non-bengali from cache if somehow they got in
      initialData = data.filter((item: NewsItem) => isStrictlyBengali(item.title));
      setNews(initialData);
      
      const lastUpdate = new Date(timestamp);
      setLastUpdateText(toBanglaNum(lastUpdate.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })));
      
      if (now.getTime() >= sixAM && lastUpdate.getTime() < sixAM) shouldFetch = true;
      else if (now.getTime() >= sixPM && lastUpdate.getTime() < sixPM) shouldFetch = true;
      else if (now.getDate() !== lastUpdate.getDate() && now.getTime() > sixAM) shouldFetch = true;
      
      if (!shouldFetch) {
        setLoading(false);
        return;
      }
    } else {
      shouldFetch = true;
    }

    if (shouldFetch) {
      if (initialData.length === 0) setLoading(true);
      
      try {
        console.log("[News] Fetching Bengali-only updates...");
        
        // Tier 1: Collective RSS (ABP, News18, Zee, etc.)
        const { fetchBengaliNewsRSS } = await import("@/lib/rss-fetcher");
        const results = await fetchBengaliNewsRSS("top"); 

        if (results && results.length > 0) {
          // Double verify strictly Bengali
          const filtered = results.filter(item => isStrictlyBengali(item.title));
          setNews(filtered);
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: filtered,
            timestamp: Date.now()
          }));
          setLastUpdateText(toBanglaNum(new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })));
        } else if (initialData.length === 0) {
          const { mockNews } = await import("@/data/mock-news");
          setNews(mockNews);
        }
      } catch (error) {
        console.error("News Fetching failed:", error);
        if (initialData.length === 0) {
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
            {/* Featured Hero */}
            {news.length > 0 && (
              <div 
                className="relative group overflow-hidden rounded-3xl bg-accent h-64 md:h-80 shadow-lg cursor-pointer transition-all duration-500 hover:shadow-primary/10" 
                onClick={() => toggleExpand(news[0].id)}
              >
                {news[0].image ? (
                  <img src={news[0].image} alt={news[0].title} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-accent via-accent/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-6 md:p-10 space-y-3 max-w-3xl text-left">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary text-white border-none text-[9px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full">ব্রেকিং নিউজ</Badge>
                    <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">
                      {news[0].source} • {toBanglaNum(new Date(news[0].time).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }))}
                    </span>
                  </div>
                  <h2 className="font-display text-xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                    {news[0].title}
                  </h2>
                  <p className="text-white/70 text-xs font-medium line-clamp-1 max-w-xl">
                    {news[0].description}
                  </p>
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
                  <div className="relative h-40 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                        <Newspaper className="h-8 w-8 text-primary/20" />
                      </div>
                    )}
                    <Badge className="absolute top-3 left-3 bg-white/90 text-primary border-none text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm">
                      {item.source}
                    </Badge>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                        <Clock className="h-2.5 w-2.5" />
                        {toBanglaNum(new Date(item.time).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }))}
                      </div>
                      <h3 className="text-sm font-bold text-accent tracking-tight leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
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
                      <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-medium">{item.description}</p>
                      
                      <div className="flex flex-col gap-3">
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full py-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest text-center rounded-xl shadow-lg hover:bg-primary/90 transition-all font-display"
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
