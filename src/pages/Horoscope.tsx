import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, Star, TrendingUp, Moon, Sun, 
  Compass, Clock, X, MapPin, Timer, RefreshCcw, ArrowRight
} from "lucide-react";
import { toBanglaNum } from "@/lib/bangla-calendar";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface HoroscopeItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
}

const signs = [
  { name: "মেষ", english: "Aries", emoji: "♈", color: "bg-red-500/10 text-red-600 dark:text-red-400", traits: "সাহসী, উদ্যমী এবং আত্মবিশ্বাসী। আজকের দিনে নতুন কোনো উদ্যোগ শুরু করার জন্য ভালো সময়।" },
  { name: "বৃষ", english: "Taurus", emoji: "♉", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", traits: "ধৈর্যশীল, নির্ভরযোগ্য এবং বাস্তববাদী। আজ আর্থিক বিনিয়োগের ক্ষেত্রে শুভ ফল পেতে পারেন।" },
  { name: "মিথুন", english: "Gemini", emoji: "♊", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", traits: "বুদ্ধিমান, কৌতুহলী এবং খাপ খাইয়ে নিতে দক্ষ। সামাজিক যোগাযোগ আপনার জন্য লাভদায়ক হবে।" },
  { name: "কর্কট", english: "Cancer", emoji: "♋", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", traits: "আবেগপ্রবণ, সহানুভূতিশীল এবং সংবেদনশীল। পরিবারের সাথে সময় কাটালে মানসিক শান্তি পাবেন।" },
  { name: "সিংহ", english: "Leo", emoji: "♌", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400", traits: "উদার, সৃজনশীল এবং আত্মবিশ্বাসী। কর্মক্ষেত্রে আপনার নেতৃত্ব দেওয়ার ক্ষমতা প্রশংসিত হবে।" },
  { name: "কন্যা", english: "Virgo", emoji: "♍", color: "bg-pink-500/10 text-pink-600 dark:text-pink-400", traits: "বিশ্লেষণাত্মক, পরিশ্রমী এবং ব্যবহারিক। স্বাস্থ্য ও শৃঙ্খলার দিকে নজর দেওয়া আজ জরুরি।" },
  { name: "তুলা", english: "Libra", emoji: "♎", color: "bg-sky-500/10 text-sky-600 dark:text-sky-400", traits: "ন্যায়পরায়ণ, সামাজিক এবং কূটনৈতিক। অংশীদারি কাজে বিশেষ সাফল্য পাওয়ার সম্ভাবনা রয়েছে।" },
  { name: "বৃশ্চিক", english: "Scorpio", emoji: "♏", color: "bg-red-900/10 text-red-900 dark:text-red-300", traits: "দৃঢ়প্রতিজ্ঞ, সাহসী এবং অন্তর্দৃষ্টিসম্পন্ন। গোপন কোনো তথ্য আজ আপনার উপকারে আসতে পারে।" },
  { name: "ধনু", english: "Sagittarius", emoji: "♐", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400", traits: "আশাবাদী, স্বাধীনচেতা এবং দার্শনিক। ভ্রমণ বা উচ্চশিক্ষার ক্ষেত্রে শুভ সংবাদ পেতে পারেন।" },
  { name: "মকর", english: "Capricorn", emoji: "♑", color: "bg-slate-500/10 text-slate-600 dark:text-slate-400", traits: "দায়িত্বশীল, সুশৃঙ্খল এবং ধৈর্যশীল। দীর্ঘমেয়াদী পরিকল্পনায় মনোযোগ দিন, সাফল্য আসবে।" },
  { name: "কুম্ভ", english: "Aquarius", emoji: "♒", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400", traits: "মানবিক, উদ্ভাবনী এবং স্বতন্ত্র। নতুন কোনো প্রযুক্তি বা আইডিয়া আজ কাজে লাগাতে পারেন।" },
  { name: "মীন", english: "Pisces", emoji: "♓", color: "bg-teal-500/10 text-teal-600 dark:text-teal-400", traits: "সৃজনশীল, সহানুভূতিশীল এবং স্বপ্নদর্শী। শৈল্পিক কাজে নিজের প্রতিভাকে বিকশিত করার সুযোগ পাবেন।" },
];

const CACHE_KEY = "horoscope_cache_v5_final_fix";

const Horoscope = () => {
  const [news, setNews] = useState<HoroscopeItem[]>(() => {
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
  const [selectedSign, setSelectedSign] = useState<typeof signs[0] | null>(null);

  const checkAndFetchHoroscope = async () => {
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
            if (!lastUpdateText) {
              setLastUpdateText(toBanglaNum(lastUpdate.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })));
            }
            
            if (now.getTime() >= sixAM && lastUpdate.getTime() < sixAM) shouldFetch = true;
            else if (now.getTime() >= sixPM && lastUpdate.getTime() < sixPM) shouldFetch = true;
            else if (now.getDate() !== lastUpdate.getDate() && now.getTime() >= sixAM) shouldFetch = true;
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
      if (news.length === 0) setLoading(true);
      const allResults: HoroscopeItem[] = [];
      
      try {
        const apiKey = "pub_f3d290147182418085442b9cf26b1ef9";
        const query = "আজকের রাশিফল";
        const ndUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(query)}&language=bn&country=in`;
        
        // Fetch NewsData and RSS in parallel
        const [ndResponse, rssFeeds] = await Promise.allSettled([
          fetch(ndUrl).then(res => res.json()),
          import("@/lib/rss-fetcher").then(m => m.fetchBengaliNewsRSS("top"))
        ]);

        // Process NewsData results
        if (ndResponse.status === "fulfilled" && ndResponse.value.status === "success" && ndResponse.value.results) {
          ndResponse.value.results.forEach((item: any) => {
            allResults.push({
              title: item.title,
              link: item.link,
              source: item.source_id,
              pubDate: item.pubDate
            });
          });
        }

        // Process RSS results
        if (rssFeeds.status === "fulfilled") {
          const filteredRss = rssFeeds.value
            .filter(item => item.title.includes("রাশিফল") || item.title.includes("রাশি"))
            .map(item => ({
              title: item.title,
              link: item.link,
              source: item.source,
              pubDate: item.time
            }));
          allResults.push(...filteredRss);
        }

        const uniqueResults = Array.from(new Map(allResults.map(item => [item.title, item])).values());
        
        if (uniqueResults.length > 0) {
           setNews(uniqueResults);
           localStorage.setItem(CACHE_KEY, JSON.stringify({
             data: uniqueResults,
             timestamp: Date.now()
           }));
           setLastUpdateText(toBanglaNum(new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })));
        } else if (news.length === 0) {
           const { mockHoroscope } = await import("@/data/mock-news");
           setNews(mockHoroscope);
        }
      } catch (error) {
        console.error("Horoscope Pipeline Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    checkAndFetchHoroscope();
  }, []);

  return (
    <PageShell>
      <section className="container py-4 space-y-6 max-w-6xl mx-auto">
        {/* Panjika-style Alpana Divider */}
        <div className="alpana-divider mb-2" />
        
        <header className="space-y-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold px-3 py-0.5 uppercase rounded-full">রাশিফল</Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
              <Timer className="h-3 w-3" /> আপডেট: {lastUpdateText}
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-accent md:text-4xl">
            আজকের রাশিফল — নক্ষত্র ও গ্রহের অবস্থান
          </h1>
          <p className="text-muted-foreground text-sm">
            বৈদিক জ্যোতিষশাস্ত্র অনুসারে আপনার দিনটি কেমন কাটবে জানুন। প্রতিদিন সকাল ও সন্ধ্যা ৬টায় স্বয়ংক্রিয়ভাবে আপডেট হয়।
          </p>
        </header>

        {/* Zodiac Icons Grid - Styled like Panjika Tabs/Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {signs.map((sign) => (
            <Card 
              key={sign.name} 
              onClick={() => setSelectedSign(sign)}
              className="group relative flex flex-col items-center justify-center p-4 rounded-2xl border border-border bg-card shadow-soft transition-all cursor-pointer hover:border-primary/50 hover:bg-primary/5 active:scale-95 duration-300"
            >
              <div className={cn("mb-2 p-2 rounded-xl transition-all shadow-sm bg-white dark:bg-accent/10")}>
                 <span className="text-2xl">{sign.emoji}</span>
              </div>
              <div className="text-xs font-bold text-accent tracking-tight">{sign.name} রাশি</div>
              <div className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest opacity-60">{sign.english}</div>
            </Card>
          ))}
        </div>

        {/* Sign Popup Modal */}
        {selectedSign && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-accent/20 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedSign(null)}
          >
            <Card 
              className="w-full max-w-sm overflow-hidden rounded-[40px] shadow-2xl border-none animate-in zoom-in duration-300 bg-background"
              onClick={(e) => e.stopPropagation()}
            >
               <div className={cn("p-10 text-center space-y-3 bg-gradient-to-br from-primary/10 to-transparent")}>
                  <div className="inline-block p-6 rounded-[30px] bg-white dark:bg-card shadow-xl mb-2">
                     <span className="text-5xl">{selectedSign.emoji}</span>
                  </div>
                  <h2 className="text-2xl font-bold font-display text-accent">{selectedSign.name} রাশি</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{selectedSign.english}</p>
               </div>
               <div className="p-8 bg-card text-left space-y-6">
                  <div className="flex items-center gap-2 text-primary">
                     <Sparkles className="h-4 w-4" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">বৈশিষ্ট্য ও পরামর্শ</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-accent/80">
                    {selectedSign.traits}
                  </p>
                  <button 
                    onClick={() => setSelectedSign(null)}
                    className="w-full mt-6 py-4 bg-primary text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg"
                  >
                    বন্ধ করুন
                  </button>
               </div>
            </Card>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-12 items-start pt-4 border-t border-border">
          <div className="lg:col-span-4 space-y-6 text-left">
            <Card className="border border-primary/20 bg-primary/5 p-6 rounded-2xl shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                 <Sparkles className="h-5 w-5 text-primary" />
                 <h2 className="font-display text-lg font-bold text-accent">জ্যোতিষ পরামর্শ</h2>
              </div>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>• প্রতিটি রাশির জাতক-জাতিকার জন্য আজকের বিশেষ সতর্কবার্তা ও শুভক্ষণ চেক করুন।</p>
                <p>• জ্যোতিষশাস্ত্র অনুযায়ী সঠিক সময়ে পদক্ষেপ গ্রহণ সাফল্যের পথ প্রশস্ত করে।</p>
              </div>
              <div className="mt-6 pt-4 border-t border-border space-y-3">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">শুভ রং</span>
                    <Badge variant="secondary">লাল ও হলুদ</Badge>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">শুভ সংখ্যা</span>
                    <Badge variant="secondary">{toBanglaNum(7)} ও {toBanglaNum(9)}</Badge>
                 </div>
              </div>
            </Card>

            <Card className="border border-accent/20 bg-accent/5 p-6 rounded-2xl shadow-soft">
               <div className="flex items-center gap-2 mb-3">
                  <Compass className="h-5 w-5 text-accent" />
                  <h3 className="font-display font-bold text-accent">নক্ষত্র পর্যবেক্ষণ</h3>
               </div>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 আমাদের সিস্টেম বর্তমানে ৪টি আন্তর্জাতিক ও দেশীয় নিউজ এপিআই থেকে সরাসরি তথ্য সংগ্রহ করছে।
               </p>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-6 text-left">
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold text-accent tracking-tight">বিস্তারিত রাশিফল ফিড</h2>
               </div>
               {loading && <RefreshCcw className="h-4 w-4 text-primary animate-spin" />}
            </div>
            
            <div className="space-y-4">
               {loading && news.length === 0 ? (
                 [1, 2, 3].map(i => (
                   <div key={i} className="animate-pulse h-24 bg-card rounded-2xl border border-border" />
                 ))
               ) : news.length > 0 ? (
                 news.map((item, idx) => (
                  <Card 
                    key={idx} 
                    className="p-5 rounded-2xl border border-border bg-card shadow-soft hover:border-primary/30 transition-all duration-300"
                  >
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="block space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-primary/10 text-primary border-none text-[9px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full">
                          {item.source}
                        </Badge>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">
                          {toBanglaNum(new Date(item.pubDate).toLocaleDateString('bn-BD'))}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-accent leading-snug group-hover:text-primary">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                         বিস্তারিত পড়ুন <ArrowRight className="h-3 w-3" />
                      </div>
                    </a>
                  </Card>
                ))
               ) : (
                 <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-dashed border-border">
                    <Moon className="h-10 w-10 text-muted-foreground opacity-20 mb-4" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-40">রাশিফল পাওয়া যায়নি</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Horoscope;
