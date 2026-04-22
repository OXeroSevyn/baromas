import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Vote, Timer, TrendingUp, MapPin, Users, Info, RefreshCcw, 
  Calendar as CalendarIcon, CheckCircle2, Phone, Fingerprint, 
  ExternalLink, CreditCard, ShieldCheck 
} from "lucide-react";
import { toBanglaNum } from "@/lib/bangla-calendar";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface NewsItem {
  time: string;
  text: string;
  link: string;
}

const ElectionDay = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");
  const [hasVoted, setHasVoted] = useState(() => localStorage.getItem("voted_2026") === "true");

  const schedule = [
    { date: "২৩ এপ্রিল, ২০২৬", label: "প্রথম দফা ভোটগ্রহণ", status: "চলছে", current: true },
    { date: "২৯ এপ্রিল, ২০২৬", label: "দ্বিতীয় দফা ভোটগ্রহণ", status: "আসন্ন", current: false },
    { date: "০৪ মে, ২০২৬", label: "ভোট গণনা ও ফলাফল", status: "আসন্ন", current: false },
  ];

  const parties = [
    { name: "AITC", seats: 215, total: 294, color: "bg-green-600" },
    { name: "BJP", seats: 77, total: 294, color: "bg-orange-600" },
    { name: "ISF+", seats: 1, total: 294, color: "bg-blue-600" },
    { name: "INC/LF", seats: 0, total: 294, color: "bg-red-600" },
  ];

  const checklist = [
    { icon: CreditCard, text: "ভোটার আইডি কার্ড (EPIC)" },
    { icon: Fingerprint, text: "আধার কার্ড / ড্রাইভিং লাইসেন্স" },
    { icon: MapPin, text: "বুথের ঠিকানা যাচাই করুন" },
    { icon: Phone, text: "মোবাইল ফোন বাইরে রাখুন" },
  ];

  const fetchNews = async () => {
    setLoading(true);
    try {
      const query = encodeURIComponent("West Bengal Election News");
      const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://news.google.com/rss/search?q=${query}&hl=bn&gl=IN&ceid=IN:bn`)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, "text/xml");
      const items = xmlDoc.querySelectorAll("item");
      
      const fetchedNews: NewsItem[] = Array.from(items).slice(0, 10).map(item => {
        const pubDate = new Date(item.querySelector("pubDate")?.textContent || "");
        const timeStr = pubDate.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
        return {
          time: toBanglaNum(timeStr),
          text: item.querySelector("title")?.textContent || "",
          link: item.querySelector("link")?.textContent || "#"
        };
      });

      setNews(fetchedNews);
      setLastUpdate(toBanglaNum(new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })));
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsVoted = () => {
    setHasVoted(true);
    localStorage.setItem("voted_2026", "true");
    toast.success("শুভেচ্ছা! আপনি গণতন্ত্রের উৎসবে অংশগ্রহণ করেছেন।", {
      icon: "🗳️",
      duration: 5000,
    });
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageShell>
      <div className="container py-6 animate-fade-in">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="destructive" className="animate-pulse flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white mr-1" /> লাইভ আপডেট
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1 font-medium">
                <Timer className="h-4 w-4" /> শেষ আপডেট: {lastUpdate}
              </span>
            </div>
            <h1 className="font-display text-4xl font-bold text-accent">নির্বাচনী দিন</h1>
            <p className="text-muted-foreground mt-1">রিয়েল-টাইম পশ্চিমবঙ্গ বিধানসভা নির্বাচন ২০২৬ আপডেট</p>
          </div>
          
          <div className="flex gap-2">
            {!hasVoted && (
              <button 
                onClick={markAsVoted}
                className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all"
              >
                <Fingerprint className="h-4 w-4" />
                <span className="text-sm font-bold">আমি ভোট দিয়েছি</span>
              </button>
            )}
            {hasVoted && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-5 py-2 rounded-xl shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm font-bold">ভোট দিয়েছেন</span>
              </div>
            )}
            <button 
              onClick={fetchNews}
              disabled={loading}
              className="flex h-10 w-10 items-center justify-center bg-card border rounded-xl shadow-soft hover:bg-secondary transition-all disabled:opacity-50"
              title="রিফ্রেশ করুন"
            >
              <RefreshCcw className={`h-4 w-4 text-primary ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Election Schedule Bar */}
        <div className="grid gap-4 mb-8 sm:grid-cols-3">
          {schedule.map((item, idx) => (
            <Card key={idx} className={`p-4 relative overflow-hidden transition-all ${item.current ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-card opacity-80'}`}>
              {item.current && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg animate-fade-in">
                   আজকের ইভেন্ট
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${item.current ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>
                  {item.current ? <CalendarIcon className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase">{item.date}</div>
                  <div className={`text-sm font-bold ${item.current ? 'text-primary' : 'text-accent'}`}>{item.label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1.8fr]">
          <div className="space-y-6">
            {/* Voter Help Card */}
            <Card className="p-6 shadow-soft bg-gradient-to-br from-indigo-900 to-accent text-white">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-300" /> ভোটারের নির্দেশিকা
              </h2>
              <div className="space-y-4">
                {checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <item.icon className="h-5 w-5 text-indigo-200" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <a 
                href="https://electorallogin.eci.gov.in/voter-info" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-white text-accent rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors"
              >
                বুথ ও ভোটার তথ্য খুঁজুন <ExternalLink className="h-4 w-4" />
              </a>
            </Card>

            {/* Helpline Section */}
            <Card className="p-6 shadow-soft border-l-4 border-l-orange-500">
               <h2 className="font-display text-xl font-bold text-accent mb-4 flex items-center gap-2">
                 <Phone className="h-5 w-5 text-orange-500" /> হেল্পলাইন নম্বর
               </h2>
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-secondary/30 p-3 rounded-lg text-center">
                    <div className="text-[10px] text-muted-foreground font-bold uppercase">ভোটার হেল্পলাইন</div>
                    <div className="text-xl font-bold text-primary">১৯৫০</div>
                 </div>
                 <div className="bg-secondary/30 p-3 rounded-lg text-center">
                    <div className="text-[10px] text-muted-foreground font-bold uppercase">নির্বাচন কমিশন</div>
                    <div className="text-lg font-bold text-accent">১৮০০ ৩৩৪৫ ৫৬৫৫</div>
                 </div>
               </div>
            </Card>

            {/* Current Tally Card */}
            <Card className="p-6 shadow-soft">
              <h2 className="font-display text-2xl font-bold text-accent mb-6 flex items-center gap-2 border-l-4 border-l-primary pl-3">
                বর্তমান সমীকরণ (২০২১)
              </h2>
              <div className="space-y-8">
                {parties.map((party) => (
                  <div key={party.name} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${party.color}`} />
                        <span className="font-bold text-accent">{party.name}</span>
                      </div>
                      <span className="text-sm font-bold text-accent">
                        {toBanglaNum(party.seats)} <span className="text-muted-foreground font-normal">/ {toBanglaNum(party.total)}</span>
                      </span>
                    </div>
                    <Progress value={(party.seats / party.total) * 100} className="h-2.5" indicatorClassName={party.color} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Live News & Stats */}
          <div className="space-y-6">
            {/* Stats Summary Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-4 border-b-4 border-b-green-600 bg-gradient-to-br from-background to-green-50/30">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-muted-foreground">মোট বিধানসভা আসন</span>
                  <Vote className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-accent">{toBanglaNum("২৯৪")}</div>
                <div className="text-xs text-green-700 mt-1 font-bold">ম্যাজিক ফিগার: {toBanglaNum("১৪৮")}</div>
              </Card>

              <Card className="p-4 border-b-4 border-b-blue-500 bg-gradient-to-br from-background to-blue-50/30">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-muted-foreground">তফসিলি আসন (SC/ST)</span>
                  <MapPin className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-accent">{toBanglaNum("৮৪")}</div>
                <div className="text-xs text-blue-600 mt-1 font-semibold">সংরক্ষিত নির্বাচনী ক্ষেত্র</div>
              </Card>
            </div>

            <Card className="p-6 shadow-soft h-fit">
              <h2 className="font-display text-2xl font-bold text-accent mb-6 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" /> সরাসরি খবরের শিরোনাম
              </h2>
              
              {loading && news.length === 0 ? (
                <div className="space-y-4 py-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="animate-pulse flex gap-4">
                      <div className="h-6 w-16 bg-muted rounded" />
                      <div className="h-6 flex-1 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8 relative before:absolute before:left-[39px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {news.map((item, i) => (
                    <a 
                      key={i} 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex gap-4 relative group"
                    >
                      <div className="bg-background border rounded-lg px-2 py-1 h-fit text-[10px] font-bold text-primary shrink-0 z-10 w-20 text-center group-hover:border-primary transition-colors">
                        {item.time}
                      </div>
                      <div className="flex-1 text-sm leading-relaxed text-accent pt-0.5 group-hover:text-primary transition-colors">
                        {item.text}
                        <div className="h-[1px] w-0 group-hover:w-full bg-primary/20 transition-all duration-300 mt-2" />
                      </div>
                    </a>
                  ))}
                  {news.length === 0 && !loading && (
                    <p className="text-center text-muted-foreground py-10">কোনো খবর পাওয়া যায়নি। একটু পরে আবার চেষ্টা করুন।</p>
                  )}
                </div>
              )}
              
              <a 
                href="https://news.google.com/search?q=West+Bengal+Election+2026&hl=bn&gl=IN&ceid=IN:bn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full mt-8 py-3 text-center text-sm font-bold text-primary bg-primary/5 rounded-xl border border-primary/20 hover:bg-primary hover:text-white transition-all"
              >
                গুগল নিউজ-এ আরো দেখুন
              </a>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default ElectionDay;
