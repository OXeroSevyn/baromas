import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, RefreshCcw, ExternalLink, Newspaper, Globe, Landmark, PlayCircle, Heart } from "lucide-react";
import { toBanglaNum } from "@/lib/bangla-calendar";
import { useEffect, useState } from "react";

interface NewsItem {
  title: string;
  link: string;
  source: string;
  time: string;
  category: string;
}

const categories = [
  { id: "top", label: "শীর্ষ সংবাদ", query: "West Bengal Latest News", icon: Newspaper },
  { id: "kolkata", label: "কলকাতা", query: "Kolkata News", icon: Globe },
  { id: "politics", label: "রাজনীতি", query: "West Bengal Politics", icon: Landmark },
  { id: "sports", label: "খেলাধুলা", query: "Bengali Sports News", icon: PlayCircle },
  { id: "ent", label: "বিনোদন", query: "Bengali Entertainment News", icon: Heart },
];

const News = () => {
  const [activeCat, setActiveCat] = useState("top");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async (catId: string) => {
    setLoading(true);
    try {
      const cat = categories.find(c => c.id === catId);
      const query = encodeURIComponent(cat?.query || "West Bengal News Today");
      const timestamp = new Date().getTime();
      const targetUrl = `https://news.google.com/rss/search?q=${query}&hl=bn&gl=IN&ceid=IN:bn&t=${timestamp}`;
      
      // Using 'raw' instead of 'get' for more reliability
      const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      
      let xmlText = "";
      try {
        const response = await fetch(url);
        if (response.ok) {
          xmlText = await response.text();
        }
      } catch (e) {
        console.warn("Primary proxy failed, trying fallback...");
      }

      // Fallback proxy if first one fails
      if (!xmlText) {
        const fallbackUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
        const fallbackRes = await fetch(fallbackUrl);
        if (fallbackRes.ok) {
          xmlText = await fallbackRes.text();
        }
      }

      if (!xmlText) throw new Error("Could not fetch news from any source");

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      // Check for parsing errors
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      if (parseError.length > 0) throw new Error("XML Parsing failed");

      const items = xmlDoc.querySelectorAll("item");
      
      const fetchedNews: NewsItem[] = Array.from(items).slice(0, 20).map(item => {
        const title = item.querySelector("title")?.textContent || "";
        const link = item.querySelector("link")?.textContent || "#";
        const source = item.querySelector("source")?.textContent || "Bengali News";
        const pubDate = item.querySelector("pubDate")?.textContent || "";
        
        return {
          title: title.split(" - ")[0],
          link: link,
          source: source,
          time: pubDate,
          category: cat?.label || "সাধারণ"
        };
      });

      setNews(fetchedNews);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(activeCat);
  }, [activeCat]);

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
              <p className="text-muted-foreground mt-1 font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" /> সর্বশেষ আপডেট: {toBanglaNum(new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }))}
              </p>
            </div>
          </div>
          <button 
            onClick={() => fetchNews(activeCat)}
            disabled={loading}
            className="flex items-center gap-2 bg-white border-2 border-primary/20 px-6 py-3 rounded-2xl shadow-soft hover:bg-primary/5 transition-all disabled:opacity-50 text-primary font-bold"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            রিফ্রেশ
          </button>
        </div>

        {/* Categories Tab Bar - Premium Style */}
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
              <a 
                key={i} 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block"
              >
                <Card className="p-5 shadow-soft hover:shadow-warm transition-all border-none bg-gradient-to-r from-white to-secondary/10 flex gap-5 items-center group-hover:translate-x-1 duration-300">
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
                  
                  <div className="shrink-0 text-primary opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-primary/10 rounded-full">
                     <ExternalLink className="h-4 w-4" />
                  </div>
                </Card>
              </a>
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
               বারোমাস নিউজ ফিডে আমরা প্রতিদিনের সবচেয়ে গুরুত্বপূর্ণ ২০টি সংবাদ আপনার জন্য সংগ্রহ করি। সত্য ও সঠিক খবর পৌঁছে দেওয়াই আমাদের লক্ষ্য।
             </p>
           </div>
        </div>
      </div>
    </PageShell>
  );
};

export default News;
