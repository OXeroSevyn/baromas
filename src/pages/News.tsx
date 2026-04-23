import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, RefreshCcw, Newspaper, Globe, Landmark, 
  PlayCircle, Heart, ChevronDown, ChevronUp, Lock, Sparkles, X,
  ExternalLink, Clock, Layers, ArrowRight, Share2, Bookmark
} from "lucide-react";
import { toBanglaNum } from "@/lib/bangla-calendar";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

const categories = [
  { id: "top", label: "শীর্ষ সংবাদ", apiCat: "top", icon: Newspaper },
  { id: "kolkata", label: "কলকাতা", query: "Kolkata", icon: Globe },
  { id: "politics", label: "রাজনীতি", apiCat: "politics", icon: Landmark },
  { id: "sports", label: "খেলাধুলা", apiCat: "sports", icon: PlayCircle },
  { id: "ent", label: "বিনোদন", apiCat: "entertainment", icon: Heart },
  { id: "business", label: "ব্যবসা", apiCat: "business", icon: TrendingUp },
  { id: "tech", label: "প্রযুক্তি", apiCat: "technology", icon: Globe },
];

const News = () => {
  const [activeCat, setActiveCat] = useState("top");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPremium, setShowPremium] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  
  const [remainingRefreshes, setRemainingRefreshes] = useState(() => {
    const saved = localStorage.getItem("news_refreshes_remaining");
    return saved !== null ? parseInt(saved) : 5;
  });

  const fetchNews = async (catId: string, isManualRefresh = false) => {
    if (isManualRefresh && remainingRefreshes <= 0) {
      setShowPremium(true);
      return;
    }

    setLoading(true);
    setExpandedId(null);
    try {
      const cat = categories.find(c => c.id === catId);
      const apiKey = "pub_f3d290147182418085442b9cf26b1ef9";
      
      let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&language=bn&country=in`;
      
      if (isManualRefresh && nextPageToken) {
        url += `&page=${nextPageToken}`;
      } else if (cat?.apiCat) {
        url += `&category=${cat.apiCat}`;
      } else if (cat?.query) {
        url += `&q=${encodeURIComponent(cat.query)}`;
      } else {
        url += `&q=West Bengal`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch news");
      
      const data = await response.json();
      
      if (data.status !== "success") {
        throw new Error(data.message || "API error");
      }

      setNextPageToken(data.nextPage || null);

      const fetchedNews: NewsItem[] = (data.results || []).map((item: any, idx: number) => ({
        id: item.article_id || `news-${idx}`,
        title: item.title || "",
        link: item.link || "#",
        source: item.source_id || "Bengali News",
        time: item.pubDate || new Date().toISOString(),
        category: cat?.label || "সাধারণ",
        description: item.description || "বিস্তারিত কোনো তথ্য পাওয়া যায়নি।",
        image: item.image_url || ""
      }));

      setNews(fetchedNews);

      if (isManualRefresh) {
        const nextCount = remainingRefreshes - 1;
        setRemainingRefreshes(nextCount);
        localStorage.setItem("news_refreshes_remaining", nextCount.toString());
        toast.success(`সংবাদ সফলভাবে আপডেট করা হয়েছে!`);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("খবর লোড করতে সমস্যা হয়েছে।");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNextPageToken(null);
    fetchNews(activeCat, false);
  }, [activeCat]);

  const handleBuy = (count: number, price: number) => {
    const nextCount = remainingRefreshes + count;
    setRemainingRefreshes(nextCount);
    localStorage.setItem("news_refreshes_remaining", nextCount.toString());
    setShowPremium(false);
    toast.success(`সফলভাবে ${toBanglaNum(count)}টি রিফ্রেশ যোগ করা হয়েছে!`);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <PageShell>
      <div className="container py-12 animate-fade-in-up space-y-12">
        <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between border-b border-primary/5 pb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest px-4 py-1 uppercase">ব্রেকিং নিউজ</Badge>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                 <Globe className="h-3 w-3" /> পশ্চিমবঙ্গ ও ভারত
              </div>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black text-accent tracking-tighter leading-[1.1] py-2">
              সংবাদ <span className="text-primary/30">প্রতিদিন</span>
            </h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-muted-foreground">লাইভ আপডেট: {toBanglaNum(new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }))}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20">
                <Clock className="h-3 w-3 text-orange-600" />
                <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">{toBanglaNum(remainingRefreshes)}টি রিফ্রেশ বাকি</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => fetchNews(activeCat, true)}
            disabled={loading}
            className="group relative flex items-center gap-4 px-10 py-5 bg-card/40 backdrop-blur-xl border border-primary/5 rounded-[28px] shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-primary/10 disabled:opacity-50"
          >
            <div className={cn("p-2 rounded-xl bg-primary/10 text-primary transition-transform duration-1000", loading ? "animate-spin" : "group-hover:rotate-180")}>
               <RefreshCcw className="h-5 w-5" />
            </div>
            <span className="font-black text-accent uppercase tracking-widest text-xs">খবর আপডেট করুন</span>
            {remainingRefreshes <= 0 && <Lock className="absolute -top-2 -right-2 h-6 w-6 p-1.5 bg-orange-500 text-white rounded-full shadow-lg" />}
          </button>
        </header>

        {/* Studio Category Bar */}
        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={cn(
                "flex shrink-0 items-center gap-3 px-8 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all duration-500 border-2",
                activeCat === cat.id 
                ? "bg-primary border-primary text-white shadow-2xl shadow-primary/30 scale-105" 
                : "bg-card/40 backdrop-blur-md border-transparent text-accent/60 hover:border-primary/20 hover:bg-card"
              )}
            >
              <cat.icon className={cn("h-4 w-4", activeCat === cat.id ? "text-white" : "text-primary")} />
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 animate-pulse bg-card/40 rounded-[48px] shadow-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-8">
            {news.map((item, i) => (
              <Card 
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                className={cn(
                  "relative overflow-hidden rounded-[48px] border border-primary/5 bg-card/40 backdrop-blur-xl transition-all duration-700 cursor-pointer hover:shadow-3xl hover:shadow-primary/5 group",
                  expandedId === item.id ? "ring-2 ring-primary/20 bg-card" : ""
                )}
              >
                {/* News Header Card */}
                <div className="p-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="flex-shrink-0 h-16 w-16 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary font-display text-3xl font-black transition-all duration-700 group-hover:bg-primary group-hover:text-white">
                    {toBanglaNum(i + 1)}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <Badge className="bg-primary/5 text-primary border-none text-[9px] font-black uppercase tracking-widest px-4 py-1">
                        {item.source}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                        <Clock className="h-3 w-3" />
                        {toBanglaNum(new Date(item.time).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }))}
                      </div>
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-black text-accent tracking-tighter leading-[1.2] group-hover:text-primary transition-colors duration-500">
                      {item.title}
                    </h3>
                  </div>
                  
                  <div className={cn(
                    "shrink-0 p-4 rounded-full transition-all duration-700",
                    expandedId === item.id ? "bg-primary text-white rotate-180" : "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white"
                  )}>
                     <ChevronDown className="h-6 w-6" />
                  </div>
                </div>

                {/* Expanded Content View */}
                <div className={cn(
                  "overflow-hidden transition-all duration-700 ease-in-out",
                  expandedId === item.id ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="px-10 pb-10 space-y-10">
                    <div className="h-px bg-primary/5" />
                    
                    <div className="grid lg:grid-cols-12 gap-10">
                      {item.image && (
                        <div className="lg:col-span-5 relative group/img overflow-hidden rounded-[32px] shadow-2xl">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover aspect-video lg:aspect-auto lg:h-full transition-transform duration-1000 group-hover/img:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).parentElement?.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-700" />
                        </div>
                      )}
                      
                      <div className={cn("space-y-8", item.image ? "lg:col-span-7" : "lg:col-span-12")}>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                          {item.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-8 pt-10 border-t border-primary/5">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-2xl">
                               <Layers className="h-4 w-4 text-primary" />
                               <span className="text-[10px] font-black text-accent uppercase tracking-widest">{item.category}</span>
                            </div>
                            <button className="p-3 text-muted-foreground hover:text-primary transition-colors">
                               <Bookmark className="h-5 w-5" />
                            </button>
                            <button className="p-3 text-muted-foreground hover:text-primary transition-colors">
                               <Share2 className="h-5 w-5" />
                            </button>
                          </div>
                          
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-10 py-5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-[20px] shadow-2xl shadow-primary/30 hover:scale-105 transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            বিস্তারিত পড়ুন <ArrowRight className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {news.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-32 bg-card/20 rounded-[48px] border border-dashed border-primary/10">
             <Newspaper className="h-16 w-16 text-primary/20 mb-6" />
             <h3 className="text-xl font-black text-accent mb-2">কোনো সংবাদ পাওয়া যায়নি</h3>
             <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">অনুগ্রহ করে ভিন্ন কোনো ক্যাটাগরি বেছে নিন</p>
          </div>
        )}

        {/* Editorial Footer Module */}
        <div className="relative overflow-hidden rounded-[56px] bg-accent p-12 md:p-16 text-white group">
           <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
              <Sparkles className="h-64 w-64" />
           </div>
           <div className="relative z-10 max-w-2xl space-y-6">
             <Badge className="bg-white/20 text-white border-none font-black text-[10px] tracking-widest uppercase px-5 py-2">সম্পাদকীয় বার্তা</Badge>
             <h2 className="font-display text-4xl md:text-5xl font-black tracking-tighter leading-[1.1]">নিরপেক্ষ সংবাদ, <br/><span className="text-white/40">নির্ভুল তথ্যের ডিজিটাল ঠিকানা</span></h2>
             <p className="text-white/70 text-lg font-medium leading-relaxed">
               আমরা বিশ্বাস করি সঠিক সংবাদই মানুষকে সঠিক পথে চালিত করে। বারোমাস নিউজ ডেক্স আপনাকে প্রতিদিনের সবচেয়ে গুরুত্বপূর্ণ ঘটনাবলীর সাথে সংযুক্ত রাখে।
             </p>
             <div className="pt-4">
                <button className="flex items-center gap-3 px-8 py-4 bg-white text-accent rounded-[20px] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                  আমাদের লক্ষ্য জানুন <ArrowRight className="h-4 w-4" />
                </button>
             </div>
           </div>
        </div>
      </div>

      {/* High-Fidelity Premium Dialog */}
      <Dialog open={showPremium} onOpenChange={setShowPremium}>
        <DialogContent className="max-w-2xl rounded-[48px] p-0 overflow-hidden border-none shadow-3xl bg-background">
          <div className="relative h-64 bg-gradient-to-br from-primary via-primary/90 to-accent flex items-end px-12 pb-10 text-white">
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 scale-150">
               <Sparkles className="h-48 w-48" />
            </div>
            <button 
              onClick={() => setShowPremium(false)}
              className="absolute top-10 right-10 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-md"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="relative z-10 space-y-4">
               <Badge className="bg-white/20 text-white border-none font-black text-[9px] tracking-widest uppercase px-4 py-1">প্রিমিয়াম এক্সেস</Badge>
               <DialogTitle className="font-display text-4xl md:text-5xl font-black text-white tracking-tighter leading-[1.1]">
                 সীমাহীন <span className="text-white/40">তথ্যভাণ্ডার</span>
               </DialogTitle>
               <DialogDescription className="text-white/80 text-lg font-medium max-w-sm leading-snug">
                 আপনার ফ্রি রিফ্রেশ শেষ হয়েছে। নিরবচ্ছিন্ন খবর পেতে আপনার প্যাকটি রিচার্জ করুন।
               </DialogDescription>
            </div>
          </div>
          
          <div className="p-12 space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <button 
                onClick={() => handleBuy(5, 50)}
                className="group relative flex flex-col items-center justify-center p-10 rounded-[40px] border-2 border-primary/5 bg-primary/5 hover:border-primary/40 hover:bg-white transition-all hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="font-black text-accent text-3xl mb-1 tracking-tighter">৫টি প্যাক</div>
                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-6 opacity-60">রিফ্রেশ করুন</div>
                <div className="bg-primary text-white font-display text-2xl font-black px-8 py-3 rounded-[20px] transition-transform group-hover:scale-110">
                  ₹৫০
                </div>
              </button>
              
              <button 
                onClick={() => handleBuy(25, 199)}
                className="group relative flex flex-col items-center justify-center p-10 rounded-[40px] border-2 border-orange-500/20 bg-orange-500/5 hover:border-orange-500/40 hover:bg-white transition-all hover:shadow-2xl hover:shadow-orange-500/10"
              >
                <div className="absolute -top-4 bg-orange-500 text-white text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl">বেস্ট ভ্যালু</div>
                <div className="font-black text-accent text-3xl mb-1 tracking-tighter">২৫টি প্যাক</div>
                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-6 opacity-60">দীর্ঘস্থায়ী ব্যবহারের জন্য</div>
                <div className="bg-orange-500 text-white font-display text-2xl font-black px-8 py-3 rounded-[20px] transition-transform group-hover:scale-110">
                  ₹১৯৯
                </div>
              </button>
            </div>
            
            <p className="text-[10px] text-center text-muted-foreground font-black uppercase tracking-widest opacity-40">
              * বারোমাস ডিজিটাল সিকিউরিটি ও পেমেন্ট গেটওয়ে দ্বারা সুরক্ষিত
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default News;
