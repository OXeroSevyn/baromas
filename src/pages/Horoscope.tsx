import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, RefreshCcw, TrendingUp, Info } from "lucide-react";
import { toBanglaNum } from "@/lib/bangla-calendar";
import { useEffect, useState } from "react";

interface HoroscopeItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
}

const signs = [
  { name: "মেষ", english: "Aries", emoji: "♈" },
  { name: "বৃষ", english: "Taurus", emoji: "♉" },
  { name: "মিথুন", english: "Gemini", emoji: "♊" },
  { name: "কর্কট", english: "Cancer", emoji: "♋" },
  { name: "সিংহ", english: "Leo", emoji: "♌" },
  { name: "কন্যা", english: "Virgo", emoji: "♍" },
  { name: "তুলা", english: "Libra", emoji: "♎" },
  { name: "বৃশ্চিক", english: "Scorpio", emoji: "♏" },
  { name: "ধনু", english: "Sagittarius", emoji: "♐" },
  { name: "মকর", english: "Capricorn", emoji: "♑" },
  { name: "কুম্ভ", english: "Aquarius", emoji: "♒" },
  { name: "মীন", english: "Pisces", emoji: "♓" },
];

const Horoscope = () => {
  const [news, setNews] = useState<HoroscopeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHoroscope = async () => {
    setLoading(true);
    try {
      const query = encodeURIComponent("আজকের রাশিফল");
      const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://news.google.com/rss/search?q=${query}&hl=bn&gl=IN&ceid=IN:bn`)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, "text/xml");
      const items = xmlDoc.querySelectorAll("item");
      
      const fetchedNews: HoroscopeItem[] = Array.from(items).slice(0, 15).map(item => ({
        title: item.querySelector("title")?.textContent || "",
        link: item.querySelector("link")?.textContent || "#",
        source: item.querySelector("source")?.textContent || "Bengali News",
        pubDate: item.querySelector("pubDate")?.textContent || ""
      }));

      setNews(fetchedNews);
    } catch (error) {
      console.error("Error fetching horoscope:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoroscope();
  }, []);

  return (
    <PageShell>
      <div className="container py-6 animate-fade-in">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-accent">আজকের রাশিফল</h1>
            <p className="text-muted-foreground mt-1">আপনার রাশি অনুযায়ী আজকের দিনটি কেমন কাটবে তা জেনে নিন</p>
          </div>
          <button 
            onClick={fetchHoroscope}
            disabled={loading}
            className="p-3 bg-card border rounded-xl hover:bg-secondary transition-all disabled:opacity-50"
          >
            <RefreshCcw className={`h-5 w-5 text-primary ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Zodiac Signs Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-10">
          {signs.map((sign) => (
            <Card key={sign.name} className="p-4 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group cursor-pointer">
              <div className="text-4xl group-hover:scale-110 transition-transform">{sign.emoji}</div>
              <div className="text-sm font-bold text-accent">{sign.name}</div>
              <div className="text-[10px] text-muted-foreground uppercase">{sign.english}</div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-6">
            <Card className="p-6 shadow-soft bg-gradient-to-br from-indigo-900 to-accent text-white">
              <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-indigo-300" /> জ্যোতিষ পরামর্শ
              </h2>
              <div className="space-y-4 text-sm leading-relaxed opacity-90">
                <p>• প্রতিটি রাশির জাতক-জাতিকার জন্য আজকের বিশেষ সতর্কবার্তা ও শুভক্ষণ চেক করুন।</p>
                <p>• জ্যোতিষশাস্ত্র অনুযায়ী সঠিক সময়ে পদক্ষেপ গ্রহণ আপনার সাফল্যের পথ প্রশস্ত করে।</p>
                <p>• কোনো গুরুত্বপূর্ণ কাজ শুরু করার আগে অমৃতযোগ সময়টি দেখে নিন।</p>
              </div>
              <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
                 <div className="text-xs font-bold uppercase mb-2">আজকের শুভ রং</div>
                 <div className="flex gap-2">
                   <div className="h-6 w-6 rounded-full bg-yellow-400 border border-white/40" />
                   <span className="font-bold">হলুদ ও সোনালী</span>
                 </div>
              </div>
            </Card>

            <Card className="p-6 shadow-soft border-l-4 border-l-primary">
              <h3 className="font-bold text-accent mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" /> তথ্যসূত্র
              </h3>
              <p className="text-xs text-muted-foreground">
                এই রাশিফল ফিডটি আনন্দবাজার পত্রিকা, নিউজ১৮ বাংলা এবং অন্যান্য প্রথম সারির বাংলা সংবাদপত্র থেকে সরাসরি সংগ্রহ করা হচ্ছে।
              </p>
            </Card>
          </div>

          <Card className="p-6 shadow-soft">
            <h2 className="font-display text-2xl font-bold text-accent mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" /> সরাসরি রাশিফল আপডেট
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="animate-pulse h-16 bg-muted rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {news.map((item, i) => (
                  <a 
                    key={i} 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-[10px] uppercase">{item.source}</Badge>
                      <span className="text-[10px] text-muted-foreground">{toBanglaNum(new Date(item.pubDate).toLocaleDateString('bn-BD'))}</span>
                    </div>
                    <div className="font-bold text-accent group-hover:text-primary transition-colors">
                      {item.title.split(" - ")[0]}
                    </div>
                  </a>
                ))}
                {news.length === 0 && (
                  <p className="text-center py-10 text-muted-foreground">আজকের জন্য কোনো আপডেট পাওয়া যায়নি।</p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageShell>
  );
};

export default Horoscope;
