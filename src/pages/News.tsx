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
      const query = encodeURIComponent(cat?.query || "West Bengal News");
      // Added cache buster and optimized URL
      const timestamp = new Date().getTime();
      const targetUrl = `https://news.google.com/rss/search?q=${query}&hl=bn&gl=IN&ceid=IN:bn&t=${timestamp}`;
      const url = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      if (!data.contents) throw new Error("Empty content from proxy");

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, "text/xml");
      const items = xmlDoc.querySelectorAll("item");
      
      const fetchedNews: NewsItem[] = Array.from(items).slice(0, 15).map(item => {
        const title = item.querySelector("title")?.textContent || "";
        const link = item.querySelector("link")?.textContent || "#";
        const source = item.querySelector("source")?.textContent || "News Source";
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
      // Fallback to a hardcoded recent snapshot if API fails completely
      if (news.length === 0) {
        setNews([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(activeCat);
  }, [activeCat]);

  return (
    <PageShell>
      <div className="container py-6 animate-fade-in">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-accent">সংবাদ ফিড</h1>
            <p className="text-muted-foreground mt-1">সর্বশেষ বাংলা খবরের রিয়েল-টাইম আপডেট</p>
          </div>
          <button 
            onClick={() => fetchNews(activeCat)}
            disabled={loading}
            className="flex items-center gap-2 bg-card border px-4 py-2 rounded-xl shadow-soft hover:bg-secondary transition-all disabled:opacity-50"
          >
            <RefreshCcw className={`h-4 w-4 text-primary ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-bold">রিফ্রেশ</span>
          </button>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`flex shrink-0 items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeCat === cat.id 
                ? "bg-primary text-white shadow-lg" 
                : "bg-card border text-muted-foreground hover:bg-secondary"
              }`}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="h-48 animate-pulse bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item, i) => (
              <a 
                key={i} 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full p-6 shadow-soft hover:shadow-warm transition-all border-b-2 border-transparent group-hover:border-primary">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                      {item.source}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {toBanglaNum(new Date(item.time).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }))}
                    </span>
                  </div>
                  <h3 className="font-bold text-accent leading-relaxed group-hover:text-primary transition-colors line-clamp-3">
                    {item.title.split(" - ")[0]}
                  </h3>
                  <div className="mt-6 flex items-center justify-between text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                     <span>বিস্তারিত পড়ুন</span>
                     <ExternalLink className="h-3 w-3" />
                  </div>
                </Card>
              </a>
            ))}
          </div>
        )}
        
        {news.length === 0 && !loading && (
          <div className="text-center py-20 bg-card border rounded-2xl">
             <TrendingUp className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
             <p className="text-muted-foreground">এই ক্যাটাগরিতে কোনো খবর পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default News;
