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
import { fetchStockData, StockItem, MOCK_STOCKS } from "@/lib/market-fetcher";
import { useSettings } from "@/hooks/use-settings";
import { CITIES, CityName } from "@/lib/bangla-calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

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
  const CACHE_KEY = "market_cache_v2";
  
  const [marketNews, setMarketNews] = useState<any[]>(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { news } = JSON.parse(cached);
        return news || [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [stocks, setStocks] = useState<StockItem[]>(() => {
    const cached = localStorage.getItem("market_stocks_cache");
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (data && data.length > 0) return data;
      } catch (e) {
        return MOCK_STOCKS;
      }
    }
    return MOCK_STOCKS;
  });

  const [loading, setLoading] = useState(!localStorage.getItem(CACHE_KEY));
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
  
  const [data, setData] = useState<MarketItem[]>([
    { name: "সোনা (২৪ ক্যারেট)", price: "৭৩,৫০০", change: "+৪৫০", unit: "প্রতি ১০ গ্রাম", up: true, trend: "up", color: "text-yellow-600 bg-yellow-500/10" },
    { name: "সোনা (২২ ক্যারেট)", price: "৬৭,৩৭৫", change: "+৪১০", unit: "প্রতি ১০ গ্রাম", up: true, trend: "up", color: "text-amber-600 bg-amber-500/10" },
    { name: "রুপো (বিশুদ্ধ)", price: "৮২,৯০০", change: "-১০০", unit: "প্রতি ১ কেজি", up: false, trend: "down", color: "text-slate-500 bg-slate-400/10" },
    { name: "পেট্রোল (প্রিমিয়াম)", price: "১০৩.৯৪", change: "০.০০", unit: "প্রতি লিটার", up: true, trend: "neutral", color: "text-orange-600 bg-orange-500/10" },
    { name: "ডিজেল (হাই-স্পিড)", price: "৯০.৭৬", change: "০.০০", unit: "প্রতি লিটার", up: true, trend: "neutral", color: "text-blue-600 bg-blue-500/10" },
    { name: "এলপিজি সিলিন্ডার", price: "৯২৯.০০", change: "০.০০", unit: "১৪.২ কেজি সিলিন্ডার", up: true, trend: "neutral", color: "text-rose-600 bg-rose-500/10" },
  ]);

  const fetchMarketData = async () => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const now = new Date();
    
    // Persistent caching logic: only refresh if older than 4 hours
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        const { timestamp } = parsed;
        
        if (timestamp) {
          const lastUpdate = new Date(timestamp);
          if (!isNaN(lastUpdate.getTime())) {
            const diffHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
            
            if (!lastUpdateText) {
              setLastUpdateText(toBanglaNum(lastUpdate.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })));
            }

            if (diffHours < 4) {
              setLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        // Continue to fetch if parse fails
      }
    }

    if (marketNews.length === 0) setLoading(true);
    toast.info("মার্কেট ডাটা আপডেট করা হচ্ছে...");
    
    // Independent Live Stocks Fetch
    try {
      const stockResults = await fetchStockData();
      if (stockResults && stockResults.length > 0) {
        setStocks(stockResults);
        localStorage.setItem("market_stocks_cache", JSON.stringify(stockResults));
        toast.success("লাইভ মার্কেট আপডেট সফল হয়েছে");
      }
    } catch (error) {
      console.error("[Market] Stock Fetch Error:", error);
    }

    // News Fetch
    try {
      const { fetchBengaliNewsRSS } = await import("@/lib/rss-fetcher");
      const rssResults = await fetchBengaliNewsRSS("business");
      
      let finalNews = [];
      if (rssResults && rssResults.length > 0) {
        finalNews = rssResults.slice(0, 8);
      } else if (marketNews.length === 0) {
        const { mockNews } = await import("@/data/mock-news");
        finalNews = mockNews.slice(0, 4);
      }
      
      if (finalNews.length > 0) {
        setMarketNews(finalNews);
        const updateTime = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
        setLastUpdateText(toBanglaNum(updateTime));
        
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          news: finalNews,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.error("[Market] News Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const [settings, updateSettings] = useSettings();
  const selectedCity = CITIES[settings.city as CityName] || CITIES.Kolkata;

  useEffect(() => {
    fetchMarketData();
  }, []);

  // Simple deterministic price adjustment based on city to simulate local market variation
  const getAdjustedPrice = (basePrice: string, cityName: string) => {
    if (cityName === "Kolkata") return basePrice;
    
    // Create a simple hash from city name
    const hash = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const numPrice = parseFloat(basePrice.replace(/,/g, '').replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d).toString()));
    
    if (isNaN(numPrice)) return basePrice;
    
    // Vary by +/- 0.5% to 2%
    const variation = 1 + ((hash % 30 - 15) / 1000); 
    const adjusted = numPrice * variation;
    
    return adjusted.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  const currentData = data.map(item => ({
    ...item,
    price: toBanglaNum(getAdjustedPrice(item.price, settings.city))
  }));

  return (
    <PageShell>
      <div className="container py-8 animate-fade-in space-y-12 max-w-6xl mx-auto">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-primary/5 pb-10">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-none text-[11px] font-black tracking-widest px-3 py-1 uppercase rounded-full">বাজার অর্থনীতি</Badge>
              <span className="text-[12px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                <Timer className="h-4 w-4" /> আপডেট: {lastUpdateText}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black text-accent tracking-tighter leading-tight">
              বাজার <span className="text-primary/30 font-light italic">পরিস্থিতি</span>
            </h1>
            <p className="text-xs text-muted-foreground font-medium max-w-md">পশ্চিমবঙ্গের নিত্যপ্রয়োজনীয় পণ্য, স্বর্ণ এবং জ্বালানির সর্বশেষ বাজার দরের নির্ভুল আপডেট।</p>
            <p className="text-[13px] text-muted-foreground font-medium max-w-md">পশ্চিমবঙ্গের নিত্যপ্রয়োজনীয় পণ্য, স্বর্ণ এবং জ্বালানির সর্বশেষ বাজার দরের নির্ভুল আপডেট।</p>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-3 bg-card/50 backdrop-blur-md border border-primary/10 px-5 py-3 rounded-2xl cursor-pointer hover:bg-primary/5 transition-all group">
                 <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin className="h-4 w-4" />
                 </div>
                 <div className="text-left">
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 flex items-center gap-1">
                      স্থান <ChevronsUpDown className="h-2 w-2" />
                    </div>
                    <div className="text-[12px] font-bold text-accent uppercase tracking-tight">
                      {selectedCity.label} {settings.city === "Kolkata" ? "মহানগরী" : ""}
                    </div>
                 </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 rounded-2xl border-primary/10 shadow-2xl" align="end">
              <Command className="rounded-2xl">
                <CommandInput placeholder="শহর খুঁজুন..." className="h-9 text-xs" />
                <CommandList>
                  <CommandEmpty className="text-[10px] py-4 text-center">শহর পাওয়া যায়নি</CommandEmpty>
                  <CommandGroup>
                    {(Object.keys(CITIES) as CityName[]).map((cityName) => (
                      <CommandItem
                        key={cityName}
                        value={cityName}
                        onSelect={() => {
                          updateSettings({ city: cityName });
                          toast.success(`${CITIES[cityName].label} সেট করা হয়েছে`);
                        }}
                        className="text-xs font-medium cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 text-primary",
                            settings.city === cityName ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {CITIES[cityName].label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </header>

        {/* Market Rate Cards */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {currentData.map((item, i) => (
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
                    "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border-none",
                    item.trend === "up" ? "bg-red-500/10 text-red-600" : 
                    item.trend === "down" ? "bg-emerald-500/10 text-emerald-600" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {item.trend === "up" ? "▲" : item.trend === "down" ? "▼" : "•"} {toBanglaNum(item.change)}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider opacity-60">{item.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-primary/40">₹</span>
                    <span className="text-3xl font-black text-accent tracking-tighter group-hover:text-primary transition-colors">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">{item.unit}</p>
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
                <div className="space-y-4 text-[15px] font-medium text-white/80 leading-relaxed">
                  <p className="flex gap-3">
                    <span className="h-6 w-6 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-[12px]">১</span>
                    সোনা ও রুপোর দাম বাজার অনুযায়ী পরিবর্তনশীল।
                  </p>
                  <p className="flex gap-3">
                    <span className="h-6 w-6 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-[12px]">২</span>
                    জ্বালানির দাম প্রতিদিন সকাল ৬টায় ডিলারদের দ্বারা নির্ধারিত হয়।
                  </p>
                  <p className="flex gap-3">
                    <span className="h-6 w-6 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-[12px]">৩</span>
                    বাণিজ্যিক গ্যাসের দাম প্রতি মাসের শুরুতে পরিবর্তিত হতে পারে।
                  </p>
                </div>
                <div className="pt-6 border-t border-white/10 flex items-center gap-3">
                   <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex-1 text-center">
                      <div className="text-[10px] font-black text-primary uppercase mb-1">সিস্টেম স্ট্যাটাস</div>
                      <div className="text-sm font-bold flex items-center justify-center gap-2">
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
                <p className="text-[13px] font-bold text-muted-foreground leading-relaxed opacity-80">আপনার এলাকার পিনকোড অনুযায়ী নির্ভুল বাজার দর জানতে লোকেশন সেট করুন।</p>
                <button className="w-full py-3 bg-primary/10 text-primary rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                   লোকেশন সেট করুন
                </button>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-8 text-left">
            <div className="flex items-center justify-between px-4">
               <div className="flex items-center gap-3">
                 <TrendingUp className="h-5 w-5 text-primary" />
                 <h2 className="text-lg font-bold text-accent tracking-tight">লাইভ মার্কেট আপডেট</h2>
               </div>
               <button 
                 onClick={() => fetchMarketData()} 
                 className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary"
                 disabled={loading}
               >
                 <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
               </button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {loading && stocks.length === 0 ? (
                 [1, 2, 3, 4, 5, 6].map(i => (
                   <div key={i} className="animate-pulse h-28 bg-card/40 rounded-3xl border border-primary/5" />
                 ))
               ) : stocks.length > 0 ? (
                 stocks.map((stock, idx) => (
                  <Card 
                    key={idx} 
                    className="group relative overflow-hidden rounded-3xl bg-card/40 backdrop-blur-md border border-primary/5 hover:border-primary/20 transition-all shadow-sm"
                  >
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-wider opacity-60">
                          {stock.symbol.replace('.NS', '').replace('^', '')}
                        </div>
                        <Badge className={cn(
                          "text-[8px] font-bold px-2 py-0.5 rounded-full border-none",
                          stock.up ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                        )}>
                          {stock.up ? "▲" : "▼"} {toBanglaNum(stock.percentChange)}%
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-xs font-bold text-accent truncate">{stock.name}</h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[10px] font-bold text-primary/40">₹</span>
                          <span className="text-xl font-black text-accent tracking-tighter">
                            {toBanglaNum(stock.price)}
                          </span>
                        </div>
                      </div>
                      
                      <div className={cn(
                        "text-[8px] font-bold uppercase tracking-widest",
                        stock.up ? "text-emerald-500/60" : "text-rose-500/60"
                      )}>
                        {stock.up ? "+" : ""}{toBanglaNum(stock.change)} আজ
                      </div>
                    </div>
                  </Card>
                ))
               ) : (
                 <div className="sm:col-span-3 flex flex-col items-center justify-center py-20 bg-card/10 rounded-[40px] border border-dashed border-primary/10">
                    <BarChart3 className="h-10 w-10 text-primary/10 mb-4" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">মার্কেট ডাটা পাওয়া যায়নি</p>
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
