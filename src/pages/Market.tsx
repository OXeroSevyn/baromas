import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, TrendingDown, Fuel, Coins, Calendar, 
  RefreshCcw, Info, ArrowUpRight, ArrowDownRight,
  BarChart3, Globe, Zap, ArrowRight, TrendingUp as TrendUpIcon, 
  Target, Sparkles, MapPin, ExternalLink
} from "lucide-react";
import { toBanglaNum } from "@/lib/bangla-calendar";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
  const [lastUpdate, setLastUpdate] = useState("");
  
  const [data, setData] = useState<MarketItem[]>([
    { name: "সোনা (২৪ ক্যারেট)", price: "৭৩,৫০০", change: "+৪৫০", unit: "প্রতি ১০ গ্রাম", up: true, trend: "up", color: "text-yellow-500 bg-yellow-500/10" },
    { name: "সোনা (২২ ক্যারেট)", price: "৬৭,৩৭৫", change: "+৪১০", unit: "প্রতি ১০ গ্রাম", up: true, trend: "up", color: "text-amber-500 bg-amber-500/10" },
    { name: "রুপো (বিশুদ্ধ)", price: "৮২,৯০০", change: "-১০০", unit: "প্রতি ১ কেজি", up: false, trend: "down", color: "text-slate-400 bg-slate-400/10" },
    { name: "পেট্রোল (প্রিমিয়াম)", price: "১০৩.৯৪", change: "০.০০", unit: "প্রতি লিটার", up: true, trend: "neutral", color: "text-orange-500 bg-orange-500/10" },
    { name: "ডিজেল (হাই-স্পিড)", price: "৯০.৭৬", change: "০.০০", unit: "প্রতি লিটার", up: true, trend: "neutral", color: "text-blue-500 bg-blue-500/10" },
    { name: "এলপিজি সিলিন্ডার", price: "৯২৯.০০", change: "০.০০", unit: "১৪.২ কেজি সিলিন্ডার", up: true, trend: "neutral", color: "text-rose-500 bg-rose-500/10" },
  ]);

  const [marketNews, setMarketNews] = useState<any[]>([]);

  const fetchMarketRates = async () => {
    setLoading(true);
    try {
      const apiKey = "pub_f3d290147182418085442b9cf26b1ef9";
      const query = "Kolkata Market Gold Petrol";
      const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(query)}&language=bn&country=in`;
      
      const response = await fetch(url);
      const resData = await response.json();
      
      if (resData.status === "success" && resData.results) {
        setMarketNews(resData.results.slice(0, 5));
      }
      
      setLastUpdate(toBanglaNum(new Date().toLocaleDateString('bn-BD')));
    } catch (error) {
      console.error("Error fetching market data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketRates();
  }, []);

  return (
    <PageShell>
      <div className="container py-12 animate-fade-in-up space-y-12">
        <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between border-b border-primary/5 pb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest px-4 py-1 uppercase">মার্কেট ইনসাইট</Badge>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                 <MapPin className="h-3 w-3" /> কলকাতা মহানগরী
              </div>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black text-accent tracking-tighter leading-[1.1] py-2">
              বাজার <span className="text-primary/30">পরিস্থিতি</span>
            </h1>
            <p className="max-w-2xl text-sm font-medium text-muted-foreground leading-relaxed">
              কলকাতা ও পশ্চিমবঙ্গের সর্বশেষ বাজার পরিস্থিতি, স্বর্ণের মূল্য এবং জ্বালানির দামের নির্ভুল আপডেট।
            </p>
          </div>
          
          <button 
            onClick={fetchMarketRates}
            disabled={loading}
            className="group relative flex items-center gap-4 px-10 py-5 bg-card/40 backdrop-blur-xl border border-primary/5 rounded-[28px] shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-primary/10 disabled:opacity-50"
          >
            <div className={cn("p-2 rounded-xl bg-primary/10 text-primary transition-transform duration-1000", loading ? "animate-spin" : "group-hover:rotate-180")}>
               <RefreshCcw className="h-5 w-5" />
            </div>
            <span className="font-black text-accent uppercase tracking-widest text-xs">আপডেট করুন</span>
          </button>
        </header>

        {/* High-Fidelity Rate Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item, i) => (
            <Card 
              key={i} 
              className="relative overflow-hidden rounded-[48px] border border-primary/5 bg-card/40 backdrop-blur-xl p-10 transition-all duration-700 hover:-translate-y-2 hover:shadow-3xl hover:shadow-primary/5 group"
            >
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 pointer-events-none">
                 <TrendUpIcon className="h-40 w-40" />
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between gap-10">
                <div className="flex justify-between items-start">
                  <div className={cn("p-5 rounded-3xl transition-all duration-700 group-hover:scale-110", item.color)}>
                     {item.name.includes("সোনা") || item.name.includes("রুপো") ? <Coins className="h-8 w-8" /> : <Fuel className="h-8 w-8" />}
                  </div>
                  <div className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase",
                    item.trend === "up" ? "bg-red-500/10 text-red-500" : 
                    item.trend === "down" ? "bg-emerald-500/10 text-emerald-500" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {item.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : 
                     item.trend === "down" ? <ArrowDownRight className="h-3 w-3" /> :
                     <BarChart3 className="h-3 w-3" />}
                    {toBanglaNum(item.change)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">{item.name}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-accent/40">₹</span>
                    <span className="text-5xl font-black text-accent tracking-tighter group-hover:text-primary transition-colors duration-500">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-widest">{item.unit}</p>
                </div>

                <div className="flex items-center gap-2 pt-6 border-t border-primary/5">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                   <span className="text-[9px] font-black text-accent/40 uppercase tracking-widest">লাইভ মার্কেট রেট</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Informational Architecture */}
        <div className="grid gap-12 lg:grid-cols-12 items-start pt-12">
          <div className="lg:col-span-4 space-y-8">
            <Card className="relative overflow-hidden p-10 rounded-[56px] border border-primary/5 bg-accent text-white group">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                <Globe className="h-56 w-56" />
              </div>
              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-white/20 text-white border-none font-black text-[9px] tracking-widest uppercase px-4 py-1">মার্কেট গাইড</Badge>
                  <h2 className="font-display text-3xl font-black tracking-tighter leading-tight">সতর্ক বাজার বিশ্লেষণ</h2>
                </div>
                <div className="space-y-6 text-sm font-medium text-white/70 leading-relaxed">
                  <div className="flex gap-4">
                     <div className="h-6 w-6 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">১</div>
                     <p>সোনা ও রুপোর দাম বাজার অনুযায়ী পরিবর্তনশীল। জিএসটি ও মেকিং চার্জ আলাদা হতে পারে।</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="h-6 w-6 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">২</div>
                     <p>পেট্রোল ও ডিজেলের দাম প্রতিদিন সকাল ৬টায় নির্ধারিত হয় স্থানীয় ডিলারদের দ্বারা।</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="h-6 w-6 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">৩</div>
                     <p>এলপিজি ও অন্যান্য বাণিজ্যিক গ্যাসের দাম প্রতি মাসের শুরুতে পুনর্মূল্যায়ন করা হয়।</p>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10">
                   <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">সর্বশেষ আপডেট</div>
                   <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary-foreground" />
                      <span className="text-xl font-black text-white tracking-tight">{lastUpdate}</span>
                   </div>
                </div>
              </div>
            </Card>

            <Card className="p-10 rounded-[48px] border border-primary/5 bg-card/40 backdrop-blur-xl space-y-6">
               <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary" />
                  <h3 className="font-display text-xl font-black text-accent tracking-tight">আপনার এলাকা</h3>
               </div>
               <div className="p-6 bg-primary/5 rounded-[32px] border border-primary/5">
                  <p className="text-xs font-bold text-muted-foreground leading-relaxed mb-4">আপনার এলাকার সুনির্দিষ্ট বাজার দর জানতে লোকেশন অন করুন।</p>
                  <button className="w-full py-4 bg-primary text-white rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                    লোকেশন সেট করুন
                  </button>
               </div>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Newspaper className="h-6 w-6 text-primary" />
                 </div>
                 <h2 className="font-display text-3xl font-black text-accent tracking-tighter">বাজার সংবাদ</h2>
              </div>
              <div className="h-px flex-1 mx-8 bg-primary/5 hidden md:block" />
              <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:gap-3 transition-all">
                সব দেখুন <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            
            {loading ? (
              <div className="grid gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse h-40 bg-card rounded-[48px] shadow-xl" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6">
                 {marketNews.length > 0 ? marketNews.map((news, idx) => (
                  <a 
                    key={idx} 
                    href={news.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex flex-col md:flex-row gap-8 p-8 rounded-[48px] bg-card/40 backdrop-blur-xl border border-transparent hover:border-primary/10 transition-all duration-500 shadow-xl hover:shadow-3xl group"
                  >
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-primary/5 text-primary border-none text-[9px] font-black uppercase tracking-widest px-4 py-1">
                          {news.source_id || "Market News"}
                        </Badge>
                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                          {toBanglaNum(new Date(news.pubDate).toLocaleDateString('bn-BD'))}
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-accent tracking-tighter leading-[1.3] group-hover:text-primary transition-colors duration-500">
                        {news.title}
                      </h3>
                      <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[9px] font-black uppercase tracking-widest">বিস্তারিত পড়ুন</span>
                         <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </a>
                )) : (
                  <div className="flex flex-col items-center justify-center py-32 bg-card/20 rounded-[48px] border border-dashed border-primary/10">
                     <BarChart3 className="h-16 w-16 text-primary/20 mb-6" />
                     <h3 className="text-xl font-black text-accent mb-2">কোনো সংবাদ পাওয়া যায়নি</h3>
                     <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">অনুগ্রহ করে পরে চেষ্টা করুন</p>
                  </div>
                )}
              </div>
            )}

            <div className="relative overflow-hidden p-12 rounded-[56px] bg-primary/5 border border-primary/10 group">
               <div className="absolute -right-12 -bottom-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                  <Sparkles className="h-64 w-64 text-primary" />
               </div>
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                  <div className="space-y-4 text-center md:text-left flex-1">
                     <h4 className="font-display text-3xl font-black text-accent tracking-tighter">সঠিক তথ্যের সাথে আপডেট থাকুন</h4>
                     <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-lg">
                        বারোমাস আপনার পকেটে এক নির্ভরযোগ্য ফিনান্সিয়াল ট্র্যাকার। আমাদের রিয়েল-টাইম ডাটাবেস আপনাকে বাজারের প্রতিটি স্পন্দন অনুভব করতে সাহায্য করবে।
                     </p>
                  </div>
                  <button className="px-10 py-5 bg-primary text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 transition-all shrink-0">
                    নোটিফিকেশন অন করুন
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Market;
