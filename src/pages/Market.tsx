import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, TrendingDown, Fuel, Coins, Calendar, 
  RefreshCcw, Info, ArrowUpRight, ArrowDownRight,
  BarChart3, Globe, Zap, ArrowRight, TrendingUp as TrendUpIcon, 
  Target, Sparkles, MapPin, ExternalLink, Newspaper, Clock, X, Timer, Wallet, Landmark
} from "lucide-react";
import { toBanglaNum } from "@/lib/bangla-calendar";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MarketItem {
  name: string;
  price: string;
  change: string;
  unit: string;
  up: boolean;
  color: string;
  trend: "up" | "down" | "neutral";
}

const Market = () => {
  const [loading, setLoading] = useState(true);
  const [lastUpdateText, setLastUpdateText] = useState("");
  const [marketNews, setMarketNews] = useState<any[]>([]);
  
  const [data, setData] = useState<MarketItem[]>([
    { name: "সোনা (২৪ ক্যারেট)", price: "৭৩,৫০০", change: "+৪৫০", unit: "প্রতি ১০ গ্রাম", up: true, trend: "up", color: "text-yellow-600 bg-yellow-500/10" },
    { name: "সোনা (২২ ক্যারেট)", price: "৬৭,৩৭৫", change: "+৪১০", unit: "প্রতি ১০ গ্রাম", up: true, trend: "up", color: "text-amber-600 bg-amber-500/10" },
    { name: "রুপো (বিশুদ্ধ)", price: "৮২,৯০০", change: "-১০০", unit: "প্রতি ১ কেজি", up: false, trend: "down", color: "text-slate-500 bg-slate-400/10" },
    { name: "পেট্রোল (প্রিমিয়াম)", price: "১০৩.৯৪", change: "০.০০", unit: "প্রতি লিটার", up: true, trend: "neutral", color: "text-orange-600 bg-orange-500/10" },
    { name: "ডিজেল (হাই-স্পিড)", price: "৯০.৭৬", change: "০.০০", unit: "প্রতি লিটার", up: true, trend: "neutral", color: "text-blue-600 bg-blue-500/10" },
    { name: "এলপিজি সিলিন্ডার", price: "৯২৯.০০", change: "০.০০", unit: "১৪.২ কেজি সিলিন্ডার", up: true, trend: "neutral", color: "text-rose-600 bg-rose-500/10" },
  ]);

  const fetchMarketData = async () => {
    const CACHE_KEY = "market_cache_v2";
    const cachedData = localStorage.getItem(CACHE_KEY);
    const now = new Date();
    
    // Persistent caching logic: only refresh if older than 4 hours or manually requested
    if (cachedData && !loading) {
      const { data: cData, news: cNews, timestamp } = JSON.parse(cachedData);
      const lastUpdate = new Date(timestamp);
      const diffHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
      
      if (diffHours < 4) {
        setMarketNews(cNews);
        setLastUpdateText(toBanglaNum(lastUpdate.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })));
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const { fetchBengaliNewsRSS } = await import("@/lib/rss-fetcher");
      const rssResults = await fetchBengaliNewsRSS("business");
      
      let finalNews = [];
      if (rssResults && rssResults.length > 0) {
        finalNews = rssResults.slice(0, 8);
      } else {
        const { mockNews } = await import("@/data/mock-news");
        finalNews = mockNews.slice(0, 4);
      }
      
      setMarketNews(finalNews);
      const updateTime = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
      setLastUpdateText(toBanglaNum(updateTime));
      
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        news: finalNews,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error("Market Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  return (
    <PageShell>
      <div className="container py-8 animate-fade-in space-y-12 max-w-6xl mx-auto">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-primary/5 pb-10">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black tracking-widest px-3 py-1 uppercase rounded-full">বাজার অর্থনীতি</Badge>
              <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                <Timer className="h-3 w-3" /> আপডেট: {lastUpdateText}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black text-accent tracking-tighter leading-tight">
              বাজার <span className="text-primary/30 font-light italic">পরিস্থিতি</span>
            </h1>
            <p className="text-xs text-muted-foreground font-medium max-w-md">পশ্চিমবঙ্গের নিত্যপ্রয়োজনীয় পণ্য, স্বর্ণ এবং জ্বালানির সর্বশেষ বাজার দরের নির্ভুল আপডেট।</p>
          </div>
          
          <div className="flex items-center gap-3 bg-card/50 backdrop-blur-md border border-primary/10 px-5 py-3 rounded-2xl">
             <div className="p-2 bg-primary/10 rounded-xl">
                <Landmark className="h-4 w-4 text-primary" />
             </div>
             <div className="text-left">
                <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-60">স্থান</div>
                <div className="text-[10px] font-bold text-accent uppercase tracking-tight">কলকাতা মহানগরী</div>
             </div>
          </div>
        </header>

        {/* Market Rate Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {data.map((item, i) => (
            <Card 
              key={i} 
              className="relative overflow-hidden rounded-[32px] border border-primary/5 bg-card/40 backdrop-blur-md p-6 transition-all hover:shadow-xl hover:bg-white dark:hover:bg-accent/20 group text-left"
            >
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000 pointer-events-none group-hover:opacity-[0.08]">
                 {item.trend === "up" ? <TrendingUp className="h-24 w-24" /> : <TrendingDown className="h-24 w-24" />}
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex justify-between items-start">
                  <div className={cn("p-3 rounded-xl transition-all shadow-sm", item.color)}>
                     {item.name.includes("সোনা") || item.name.includes("রুপো") ? <Coins className="h-5 w-5" /> : <Fuel className="h-5 w-5" />}
                  </div>
                  <Badge className={cn(
                    "px-2 py-0.5 rounded-full text-[8px] font-bold tracking-widest uppercase border-none",
                    item.trend === "up" ? "bg-red-500/10 text-red-600" : 
                    item.trend === "down" ? "bg-emerald-500/10 text-emerald-600" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {item.trend === "up" ? "▲" : item.trend === "down" ? "▼" : "•"} {toBanglaNum(item.change)}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider opacity-60">{item.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-primary/40">₹</span>
                    <span className="text-3xl font-black text-accent tracking-tighter group-hover:text-primary transition-colors">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest">{item.unit}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info & News Section */}
        <div className="grid gap-10 lg:grid-cols-12 items-start pt-4">
          <div className="lg:col-span-4 space-y-6 text-left">
            <Card className="relative overflow-hidden p-8 rounded-[40px] bg-accent text-white group shadow-lg border-none">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-[3s] rotate-12">
                <Wallet className="h-40 w-40 text-white" />
              </div>
              <div className="relative z-10 space-y-6">
                <h2 className="font-display text-xl font-bold tracking-tight">বাজার গাইড</h2>
                <div className="space-y-4 text-[11px] font-medium text-white/70 leading-relaxed">
                  <p className="flex gap-3">
                    <span className="h-5 w-5 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-[9px]">১</span>
                    সোনা ও রুপোর দাম বাজার অনুযায়ী পরিবর্তনশীল।
                  </p>
                  <p className="flex gap-3">
                    <span className="h-5 w-5 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-[9px]">২</span>
                    জ্বালানির দাম প্রতিদিন সকাল ৬টায় ডিলারদের দ্বারা নির্ধারিত হয়।
                  </p>
                  <p className="flex gap-3">
                    <span className="h-5 w-5 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-[9px]">৩</span>
                    বাণিজ্যিক গ্যাসের দাম প্রতি মাসের শুরুতে পরিবর্তিত হতে পারে।
                  </p>
                </div>
                <div className="pt-6 border-t border-white/10 flex items-center gap-3">
                   <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex-1 text-center">
                      <div className="text-[8px] font-bold text-primary uppercase mb-1">সিস্টেম স্ট্যাটাস</div>
                      <div className="text-xs font-bold flex items-center justify-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> একটিভ
                      </div>
                   </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 rounded-[40px] bg-card/40 backdrop-blur-md space-y-4 border border-primary/5">
               <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-lg font-bold text-accent tracking-tight">আপনার এলাকা</h3>
               </div>
               <p className="text-[10px] font-bold text-muted-foreground leading-relaxed opacity-70">আপনার এলাকার পিনকোড অনুযায়ী নির্ভুল বাজার দর জানতে লোকেশন সেট করুন।</p>
               <button className="w-full py-3 bg-primary/10 text-primary rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                  লোকেশন সেট করুন
               </button>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-8 text-left">
            <div className="flex items-center gap-3 px-4">
               <Newspaper className="h-5 w-5 text-primary" />
               <h2 className="text-lg font-bold text-accent tracking-tight">ফিন্যান্সিয়াল আপডেট</h2>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
               {loading && marketNews.length === 0 ? (
                 [1, 2, 3, 4].map(i => (
                   <div key={i} className="animate-pulse h-32 bg-card/40 rounded-3xl border border-primary/5" />
                 ))
               ) : marketNews.length > 0 ? (
                 marketNews.map((news, idx) => (
                  <Card 
                    key={idx} 
                    className="group relative overflow-hidden rounded-3xl bg-card/40 backdrop-blur-md border border-primary/5 hover:border-primary/20 transition-all shadow-md hover:shadow-lg"
                  >
                    <a href={news.link} target="_blank" rel="noopener noreferrer" className="p-6 block space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-primary/10 text-primary border-none text-[8px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full">
                          {news.source || news.source_id || "Market"}
                        </Badge>
                        <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                          {toBanglaNum(new Date(news.pubDate || new Date()).toLocaleDateString('bn-BD'))}
                        </div>
                      </div>
                      <h3 className="text-md font-bold text-accent tracking-tight leading-snug group-hover:text-primary transition-colors">
                        {news.title}
                      </h3>
                    </a>
                  </Card>
                ))
               ) : (
                 <div className="sm:col-span-2 flex flex-col items-center justify-center py-20 bg-card/10 rounded-[40px] border border-dashed border-primary/10">
                    <BarChart3 className="h-10 w-10 text-primary/10 mb-4" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">সংবাদ পাওয়া যায়নি</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Market;
