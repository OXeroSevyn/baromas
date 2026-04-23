import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, Star, RefreshCcw, TrendingUp, Info, Moon, Sun, Compass, 
  Orbit, Wind, Waves, Flame, Zap, ArrowRight, ExternalLink, 
  Calendar, Layers, MapPin
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
  { name: "মেষ", english: "Aries", emoji: "♈", element: "অগ্নি", icon: <Flame className="h-4 w-4" />, color: "from-orange-500/20 to-red-600/20", border: "border-orange-500/10", text: "text-orange-500" },
  { name: "বৃষ", english: "Taurus", emoji: "♉", element: "পৃথিবী", icon: <Layers className="h-4 w-4" />, color: "from-emerald-500/20 to-green-600/20", border: "border-emerald-500/10", text: "text-emerald-500" },
  { name: "মিথুন", english: "Gemini", emoji: "♊", element: "বায়ু", icon: <Wind className="h-4 w-4" />, color: "from-sky-400/20 to-blue-500/20", border: "border-sky-500/10", text: "text-sky-500" },
  { name: "কর্কট", english: "Cancer", emoji: "♋", element: "জল", icon: <Waves className="h-4 w-4" />, color: "from-blue-400/20 to-cyan-500/20", border: "border-blue-500/10", text: "text-blue-500" },
  { name: "সিংহ", english: "Leo", emoji: "♌", element: "অগ্নি", icon: <Flame className="h-4 w-4" />, color: "from-amber-400/20 to-orange-600/20", border: "border-amber-500/10", text: "text-amber-500" },
  { name: "কন্যা", english: "Virgo", emoji: "♍", element: "পৃথিবী", icon: <Layers className="h-4 w-4" />, color: "from-teal-400/20 to-emerald-600/20", border: "border-teal-500/10", text: "text-teal-500" },
  { name: "তুলা", english: "Libra", emoji: "♎", element: "বায়ু", icon: <Wind className="h-4 w-4" />, color: "from-pink-400/20 to-rose-500/20", border: "border-pink-500/10", text: "text-pink-500" },
  { name: "বৃশ্চিক", english: "Scorpio", emoji: "♏", element: "জল", icon: <Waves className="h-4 w-4" />, color: "from-red-600/20 to-rose-700/20", border: "border-red-600/10", text: "text-red-600" },
  { name: "ধনু", english: "Sagittarius", emoji: "♐", element: "অগ্নি", icon: <Flame className="h-4 w-4" />, color: "from-purple-500/20 to-indigo-600/20", border: "border-purple-500/10", text: "text-purple-500" },
  { name: "মকর", english: "Capricorn", emoji: "♑", element: "পৃথিবী", icon: <Layers className="h-4 w-4" />, color: "from-slate-600/20 to-zinc-800/20", border: "border-slate-500/10", text: "text-slate-500" },
  { name: "কুম্ভ", english: "Aquarius", emoji: "♒", element: "বায়ু", icon: <Wind className="h-4 w-4" />, color: "from-cyan-400/20 to-blue-600/20", border: "border-cyan-500/10", text: "text-cyan-500" },
  { name: "মীন", english: "Pisces", emoji: "♓", element: "জল", icon: <Waves className="h-4 w-4" />, color: "from-indigo-400/20 to-violet-600/20", border: "border-indigo-500/10", text: "text-indigo-500" },
];

const Horoscope = () => {
  const [news, setNews] = useState<HoroscopeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHoroscope = async () => {
    setLoading(true);
    try {
      const apiKey = "pub_f3d290147182418085442b9cf26b1ef9";
      const query = "আজকের রাশিফল";
      const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(query)}&language=bn&country=in`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === "success" && data.results) {
        const fetchedNews: HoroscopeItem[] = data.results.slice(0, 15).map((item: any) => ({
          title: item.title || "",
          link: item.link || "#",
          source: item.source_id || "Bengali News",
          pubDate: item.pubDate || new Date().toISOString()
        }));
        setNews(fetchedNews);
      }
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
      <div className="container py-12 animate-fade-in-up space-y-12">
        <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between border-b border-primary/5 pb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest px-4 py-1 uppercase">নক্ষত্রমণ্ডল</Badge>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                 <Orbit className="h-3 w-3" /> মহাজাগতিক আপডেট
              </div>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black text-accent tracking-tighter leading-[1.1] py-2">
              দৈনিক <span className="text-primary/30">রাশিফল</span>
            </h1>
            <p className="max-w-2xl text-sm font-medium text-muted-foreground leading-relaxed">
              নক্ষত্র ও গ্রহের গতিবিধিতে আপনার দিনটি কেমন কাটবে? বারোমাসের নির্ভুল জ্যোতিষীয় বিশ্লেষণ ও দৈনিক পূর্বাভাস।
            </p>
          </div>
          
          <button 
            onClick={fetchHoroscope}
            disabled={loading}
            className="group relative flex items-center gap-4 px-10 py-5 bg-card/40 backdrop-blur-xl border border-primary/5 rounded-[28px] shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-primary/10 disabled:opacity-50"
          >
            <div className={cn("p-2 rounded-xl bg-primary/10 text-primary transition-transform duration-1000", loading ? "animate-spin" : "group-hover:rotate-180")}>
               <RefreshCcw className="h-5 w-5" />
            </div>
            <span className="font-black text-accent uppercase tracking-widest text-xs">আপডেট করুন</span>
          </button>
        </header>

        {/* Premium Zodiac Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {signs.map((sign) => (
            <Card 
              key={sign.name} 
              className={cn(
                "group relative overflow-hidden rounded-[48px] border bg-card/40 backdrop-blur-xl p-8 transition-all duration-700 hover:-translate-y-2 hover:shadow-3xl hover:shadow-primary/5 cursor-pointer text-center",
                sign.border
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700", sign.color)} />
              
              <div className="relative z-10 space-y-6">
                <div className="text-6xl transition-transform duration-700 group-hover:scale-125 group-hover:-rotate-12">
                   {sign.emoji}
                </div>
                <div>
                  <div className="text-2xl font-black text-accent tracking-tight">{sign.name}</div>
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">
                    {sign.english}
                  </div>
                </div>
                <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase bg-white/10", sign.text)}>
                   {sign.icon} {sign.element}
                </div>
              </div>

              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
                 <Sparkles className={cn("h-8 w-8", sign.text)} />
              </div>
            </Card>
          ))}
        </div>

        {/* High-Impact Insights Architecture */}
        <div className="grid gap-12 lg:grid-cols-12 items-start pt-12">
          <div className="lg:col-span-4 space-y-8">
            <Card className="relative overflow-hidden p-10 rounded-[56px] border-none shadow-3xl bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white group">
              <div className="absolute -right-12 -bottom-12 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                <Compass className="h-64 w-64 text-yellow-300" />
              </div>
              
              <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                  <Badge className="bg-yellow-400/20 text-yellow-400 border-none font-black text-[9px] tracking-widest uppercase px-4 py-1">মহাজাগতিক গাইড</Badge>
                  <h2 className="font-display text-4xl font-black tracking-tighter leading-tight">জ্যোতিষীয় <br /><span className="text-yellow-400/50">পরামর্শ</span></h2>
                </div>

                <div className="space-y-6">
                   {[
                     { text: "আজকের বিশেষ শুভক্ষণে পদক্ষেপ গ্রহণ আপনার সাফল্যের পথ প্রশস্ত করবে।", color: "bg-yellow-400" },
                     { text: "আপনার ব্যক্তিগত জীবন ও কর্মক্ষেত্রের মধ্যে ভারসাম্য বজায় রাখার চেষ্টা করুন।", color: "bg-cyan-400" }
                   ].map((item, idx) => (
                     <div key={idx} className="flex gap-4 p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl group/item">
                        <div className={cn("h-3 w-3 rounded-full mt-1.5 shrink-0 shadow-lg", item.color)} />
                        <p className="text-sm font-medium leading-relaxed text-white/80 group-hover/item:text-white transition-colors">{item.text}</p>
                     </div>
                   ))}
                </div>

                <div className="pt-8 border-t border-white/10">
                   <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">আজকের মহাজাগতিক স্পন্দন</div>
                   <div className="flex items-center gap-6">
                      <div className="flex flex-col gap-1">
                         <span className="text-[9px] font-black text-yellow-400 uppercase tracking-widest">শুভ রং</span>
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 shadow-xl border border-white/20" />
                            <span className="font-black text-lg">সোনালী</span>
                         </div>
                      </div>
                      <div className="h-10 w-px bg-white/10" />
                      <div className="flex flex-col gap-1">
                         <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">শুভ সংখ্যা</span>
                         <div className="text-3xl font-black text-white tracking-tighter">{toBanglaNum("৭")}</div>
                      </div>
                   </div>
                </div>
              </div>
            </Card>

            <Card className="p-10 rounded-[48px] border border-primary/5 bg-card/40 backdrop-blur-xl space-y-6 group">
               <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                     <Info className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-black text-accent tracking-tight">নির্ভুল তথ্যসূত্র</h3>
               </div>
               <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                  এই রাশিফল ফিডটি আনন্দবাজার পত্রিকা, নিউজ১৮ বাংলা এবং অন্যান্য প্রথম সারির বাংলা সংবাদপত্র থেকে সরাসরি সংগ্রহ করা হচ্ছে। বারোমাস তথ্যের নির্ভুলতা বজায় রাখতে বদ্ধপরিকর।
               </p>
               <div className="flex flex-wrap gap-2 pt-4">
                  {["Anandabazar", "News18", "Sangbad Pratidin"].map(tag => (
                    <span key={tag} className="text-[9px] font-black text-accent/40 uppercase tracking-widest px-3 py-1.5 rounded-full bg-primary/5">
                      {tag}
                    </span>
                  ))}
               </div>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                 <div className="h-14 w-14 rounded-3xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-7 w-7 text-primary" />
                 </div>
                 <h2 className="font-display text-4xl font-black text-accent tracking-tighter">রাশিফল ফিড</h2>
              </div>
              <div className="h-px flex-1 mx-8 bg-primary/5 hidden md:block" />
              <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:gap-3 transition-all">
                সব দেখুন <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            
            {loading ? (
              <div className="grid gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse h-44 bg-card rounded-[56px] shadow-xl" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6">
                {news.length > 0 ? news.map((item, i) => (
                  <a 
                    key={i} 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col gap-6 p-10 rounded-[56px] bg-card/40 backdrop-blur-xl border border-transparent hover:border-primary/10 transition-all duration-700 shadow-xl hover:shadow-3xl hover:-translate-y-1 group"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700">
                            <Star className="h-5 w-5" />
                         </div>
                         <Badge className="bg-primary/5 text-primary border-none text-[9px] font-black uppercase tracking-widest px-4 py-1">
                           {item.source}
                         </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="h-2 w-2 rounded-full bg-primary/20 animate-pulse" />
                         <div className="flex items-center gap-2 text-muted-foreground">
                           <Calendar className="h-3.5 w-3.5" />
                           <span className="text-[9px] font-black uppercase tracking-widest">
                             {toBanglaNum(new Date(item.pubDate).toLocaleDateString('bn-BD'))}
                           </span>
                         </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black text-accent tracking-tighter leading-[1.2] group-hover:text-primary transition-colors duration-500">
                        {item.title.split(" - ")[0]}
                      </h3>
                      <div className="flex items-center gap-3 text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 duration-500">
                         <span className="text-[10px] font-black uppercase tracking-widest">বিস্তারিত পড়ুন</span>
                         <ExternalLink className="h-4 w-4" />
                      </div>
                    </div>
                  </a>
                )) : (
                  <div className="flex flex-col items-center justify-center py-40 bg-card/20 rounded-[56px] border-2 border-dashed border-primary/10">
                     <Orbit className="h-20 w-20 text-primary/10 mb-8 animate-spin-slow" />
                     <h3 className="text-2xl font-black text-accent mb-3">মহাজাগতিক ফিড খালি</h3>
                     <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest max-w-xs text-center leading-relaxed">
                        গ্রহের অবস্থান পরিবর্তনের কারণে তথ্য আসতে দেরি হচ্ছে। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।
                     </p>
                  </div>
                )}
              </div>
            )}

            <div className="relative overflow-hidden p-12 rounded-[64px] bg-accent text-white group">
               <div className="absolute top-0 left-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000 -rotate-12">
                  <Star className="h-64 w-64" />
               </div>
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                  <div className="space-y-4 flex-1">
                     <h4 className="font-display text-4xl font-black tracking-tighter">আপনার নক্ষত্রের পথপ্রদর্শক</h4>
                     <p className="text-sm font-medium text-white/60 leading-relaxed max-w-xl">
                        বারোমাস আপনার জীবনের প্রতিটি বাঁকে জ্যোতিষীয় পথপ্রদর্শক হিসেবে সাথে আছে। আমাদের প্রিমিয়াম বিশ্লেষণের মাধ্যমে আপনার ভবিষ্যৎকে আরও স্বচ্ছ করে তুলুন।
                     </p>
                  </div>
                  <button className="px-12 py-6 bg-white text-accent rounded-[32px] font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-primary hover:text-white transition-all shrink-0">
                    এখনই শুরু করুন
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Horoscope;
