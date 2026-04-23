import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, RefreshCcw, Newspaper, Globe, Landmark, 
  PlayCircle, Heart, ChevronDown, ChevronUp, Lock, Sparkles, X
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
  { id: "business", label: "ব্যবসা-বাণিজ্য", apiCat: "business", icon: TrendingUp },
  { id: "tech", label: "প্রযুক্তি", apiCat: "technology", icon: Globe },
];

const News = () => {
  const [activeCat, setActiveCat] = useState("top");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPremium, setShowPremium] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  
  // Tracking refreshes
  const [remainingRefreshes, setRemainingRefreshes] = useState(() => {
    const saved = localStorage.getItem("news_refreshes_remaining");
    return saved !== null ? parseInt(saved) : 1;
  });

  const fetchNews = async (catId: string, isManualRefresh = false) => {
    // If it's a manual refresh and no refreshes remaining, show popup
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
      
      // Use nextPage token if it's a manual refresh to get different news
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

      // Store the token for the next page
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

      // If manual refresh, we could either replace or append. 
      // Replacing makes it clear the news "changed".
      setNews(fetchedNews);

      // Decrement refresh count if manual
      if (isManualRefresh) {
        const nextCount = remainingRefreshes - 1;
        setRemainingRefreshes(nextCount);
        localStorage.setItem("news_refreshes_remaining", nextCount.toString());
        toast.info(`সংবাদ সফলভাবে আপডেট করা হয়েছে! ${toBanglaNum(nextCount)}টি ফ্রি রিফ্রেশ বাকি।`);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("খবর লোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset page token when category changes to start from top news again
    setNextPageToken(null);
    fetchNews(activeCat, false);
  }, [activeCat]);

  const handleBuy = (count: number, price: number) => {
    // In a real app, this would trigger payment gateway
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
      <div className="container py-6 animate-fade-in max-w-4xl">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl">
               <Newspaper className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-accent">আজকের শীর্ষ ২০ সংবাদ</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-muted-foreground font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" /> সর্বশেষ আপডেট: {toBanglaNum(new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }))}
                </p>
                <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-orange-100 font-bold">
                  {toBanglaNum(remainingRefreshes)}টি রিফ্রেশ বাকি
                </Badge>
              </div>
            </div>
          </div>
          <button 
            onClick={() => fetchNews(activeCat, true)}
            disabled={loading}
            className="flex items-center gap-2 bg-white border-2 border-primary/20 px-6 py-3 rounded-2xl shadow-soft hover:bg-primary/5 transition-all disabled:opacity-50 text-primary font-bold relative group"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            রিফ্রেশ
            {remainingRefreshes <= 0 && (
              <Lock className="h-3 w-3 absolute -top-1 -right-1 text-orange-500" />
            )}
          </button>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`flex shrink-0 items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                activeCat === cat.id 
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-105" 
                : "bg-white border-transparent text-muted-foreground hover:border-primary/20 hover:bg-secondary/50"
              }`}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-24 animate-pulse bg-muted rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item, i) => (
              <div key={item.id} className="group block">
                <Card 
                  onClick={() => toggleExpand(item.id)}
                  className={`p-5 shadow-soft hover:shadow-warm transition-all border-none bg-gradient-to-r from-white to-secondary/10 cursor-pointer overflow-hidden ${expandedId === item.id ? 'ring-2 ring-primary/20' : ''}`}
                >
                  <div className="flex gap-5 items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-display text-xl font-bold border border-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                      {toBanglaNum(i + 1)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold border-primary/20 text-primary bg-primary/5">
                          {item.source}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                          • {toBanglaNum(new Date(item.time).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }))}
                        </span>
                      </div>
                      <h3 className="font-bold text-accent leading-snug group-hover:text-primary transition-colors text-lg line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                    
                    <div className="shrink-0 text-primary p-2 bg-primary/5 rounded-full">
                       {expandedId === item.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>

                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedId === item.id ? 'max-h-[800px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-4 border-t border-primary/10 flex flex-col lg:flex-row gap-6">
                      {item.image && (
                        <div className="w-full lg:w-1/3 shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full aspect-video lg:aspect-square object-cover rounded-2xl shadow-md border-4 border-white"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-muted-foreground leading-relaxed font-medium mb-6">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-primary/10 text-primary border-none font-bold py-1 px-3">
                            {item.category}
                          </Badge>
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            মূল উৎস দেখুন ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
        
        {news.length === 0 && !loading && (
          <div className="text-center py-20 bg-card border-2 border-dashed rounded-3xl">
             <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
             <p className="text-muted-foreground font-bold">এই ক্যাটাগরিতে কোনো খবর পাওয়া যায়নি।</p>
          </div>
        )}

        <div className="mt-12 p-8 bg-accent rounded-3xl text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-10">
              <Newspaper className="h-32 w-32" />
           </div>
           <div className="relative z-10">
             <h4 className="text-xl font-bold mb-2">প্রতিদিনের খবরের আপডেট</h4>
             <p className="text-white/70 text-sm max-w-lg">
               বারোমাস নিউজ ফিডে আমরা প্রতিদিনের সবচেয়ে গুরুত্বপূর্ণ সংবাদ আপনার জন্য সংগ্রহ করি। সত্য ও সঠিক খবর পৌঁছে দেওয়াই আমাদের লক্ষ্য।
             </p>
           </div>
        </div>
      </div>

      {/* Premium Growth Popup */}
      <Dialog open={showPremium} onOpenChange={setShowPremium}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-gradient-to-br from-primary via-primary to-accent p-8 text-white relative">
            <button 
              onClick={() => setShowPremium(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            
            <DialogHeader className="text-left p-0">
              <DialogTitle className="text-3xl font-display font-bold text-white mb-2">
                আমাদের Growth এ সহায়তা করুন
              </DialogTitle>
              <DialogDescription className="text-white/80 text-lg font-medium leading-snug">
                আপনার ফ্রি রিফ্রেশ শেষ হয়েছে। বারোমাস অ্যাপের মান বজায় রাখতে এবং আমাদের এগিয়ে নিয়ে যেতে প্রিমিয়াম প্যাক বেছে নিন।
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-8 bg-white space-y-4">
            <button 
              onClick={() => handleBuy(5, 50)}
              className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-primary/10 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="text-left">
                <div className="font-bold text-accent text-lg">৫টি রিফ্রেশ</div>
                <div className="text-xs text-muted-foreground font-bold uppercase">প্রতিবার ২০টি নতুন সংবাদ</div>
              </div>
              <div className="bg-primary text-white font-display text-xl font-bold px-4 py-2 rounded-xl group-hover:scale-110 transition-transform">
                ₹৫০
              </div>
            </button>
            
            <button 
              onClick={() => handleBuy(20, 150)}
              className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-orange-200 bg-orange-50/30 hover:border-orange-400 hover:bg-orange-50 transition-all group relative"
            >
              <div className="absolute -top-3 left-6 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                বেস্ট ভ্যালু
              </div>
              <div className="text-left">
                <div className="font-bold text-accent text-lg">২০টি রিফ্রেশ</div>
                <div className="text-xs text-muted-foreground font-bold uppercase">দীর্ঘস্থায়ী ব্যবহারের জন্য</div>
              </div>
              <div className="bg-orange-500 text-white font-display text-xl font-bold px-4 py-2 rounded-xl group-hover:scale-110 transition-transform">
                ₹১৫০
              </div>
            </button>
            
            <p className="text-[10px] text-center text-muted-foreground font-medium pt-4">
              * রিফ্রেশগুলো আপনার একাউন্টে যোগ করা হবে এবং আপনি যেকোনো সময় ব্যবহার করতে পারবেন।
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default News;
