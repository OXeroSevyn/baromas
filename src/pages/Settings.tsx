import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings, type FontSize, type Theme } from "@/hooks/use-settings";
import type { Region } from "@/lib/bangla-calendar";
import { Badge } from "@/components/ui/badge";
import { Palette, MapPin, Type, CalendarDays, MousePointer2, Settings2, Sparkles, ChevronRight } from "lucide-react";

const Settings = () => {
  const [settings, update] = useSettings();

  return (
    <PageShell>
      <section className="container py-12 space-y-12">
        <div className="space-y-3 border-b border-primary/5 pb-12">
          <div className="flex items-center gap-2">
             <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest px-3 py-1 uppercase">কনফিগারেশন</Badge>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black text-accent tracking-tighter leading-[1.1] py-2">
            আপনার <span className="text-primary/30">সেটিংস</span>
          </h1>
          <p className="max-w-2xl text-sm font-medium text-muted-foreground leading-relaxed">
            আপনার পছন্দ অনুযায়ী পঞ্জিকা সাজান এবং আপনার ডিজিটাল অভিজ্ঞতাকে আরও ব্যক্তিগত করে তুলুন।
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Theme Section */}
          <Card className="p-10 rounded-[40px] border border-primary/5 bg-card/40 backdrop-blur-xl shadow-xl space-y-8">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-primary/10 rounded-2xl">
                  <Palette className="h-6 w-6 text-primary" />
               </div>
               <h2 className="font-display text-2xl font-black text-accent tracking-tight py-1">অ্যাপ থিম</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {(["light", "dark", "festive"] as Theme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => update({ theme: t })}
                  className={`flex items-center justify-between rounded-[24px] px-8 py-5 text-sm font-black uppercase tracking-widest transition-all duration-500 ${
                    settings.theme === t
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                      : "bg-white/5 text-accent hover:bg-primary/10 border border-primary/5"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {themeIcon(t)} {themeLabel(t)}
                  </span>
                  {settings.theme === t && <Sparkles className="h-4 w-4 animate-pulse" />}
                </button>
              ))}
            </div>
          </Card>

          {/* Region Section */}
          <Card className="p-10 rounded-[40px] border border-primary/5 bg-card/40 backdrop-blur-xl shadow-xl space-y-8">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-accent/10 rounded-2xl">
                  <MapPin className="h-6 w-6 text-accent" />
               </div>
               <h2 className="font-display text-2xl font-black text-accent tracking-tight py-1">অঞ্চল ও সময়</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {(["WB", "BD"] as Region[]).map((r) => (
                <button
                  key={r}
                  onClick={() => update({ region: r, city: r === "BD" ? "Dhaka" : "Kolkata" })}
                  className={`rounded-[24px] p-6 text-xs font-black uppercase tracking-widest transition-all duration-500 flex flex-col items-center gap-3 ${
                    settings.region === r
                      ? "bg-accent text-white shadow-lg shadow-accent/20 scale-[1.02]"
                      : "bg-white/5 text-accent hover:bg-accent/10 border border-accent/5"
                  }`}
                >
                  <span className="text-3xl">{r === "WB" ? "🇮🇳" : "🇧🇩"}</span>
                  {r === "WB" ? "পশ্চিমবঙ্গ" : "বাংলাদেশ"}
                </button>
              ))}
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 leading-relaxed italic">
              * এটি পহেলা বৈশাখের তারিখ, ছুটির তালিকা ও সূর্যোদয়ের শহর প্রভাবিত করে।
            </p>
          </Card>

          {/* Font Size Section */}
          <Card className="p-10 rounded-[40px] border border-primary/5 bg-card/40 backdrop-blur-xl shadow-xl space-y-8">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-primary/10 rounded-2xl">
                  <Type className="h-6 w-6 text-primary" />
               </div>
               <h2 className="font-display text-2xl font-black text-accent tracking-tight py-1">অক্ষরের আকার</h2>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {(["sm", "md", "lg", "xl"] as FontSize[]).map((f) => (
                <button
                  key={f}
                  onClick={() => update({ fontSize: f })}
                  className={`rounded-[24px] h-16 text-lg font-black transition-all duration-500 ${
                    settings.fontSize === f 
                      ? "bg-primary text-white shadow-lg scale-110" 
                      : "bg-white/5 text-accent hover:bg-primary/10 border border-primary/5"
                  }`}
                >
                  {f === "sm" ? "ক" : f === "md" ? "কক" : f === "lg" ? "ককক" : "কককক"}
                </button>
              ))}
            </div>
          </Card>

          {/* Week Start Section */}
          <Card className="p-10 rounded-[40px] border border-primary/5 bg-card/40 backdrop-blur-xl shadow-xl space-y-8">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-accent/10 rounded-2xl">
                  <CalendarDays className="h-6 w-6 text-accent" />
               </div>
               <h2 className="font-display text-2xl font-black text-accent tracking-tight py-1">সপ্তাহ শুরু</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {[0, 1].map((day) => (
                <button
                  key={day}
                  onClick={() => update({ startDay: day as 0 | 1 })}
                  className={`flex items-center justify-between rounded-[24px] px-8 py-5 text-sm font-black uppercase tracking-widest transition-all duration-500 ${
                    settings.startDay === day
                      ? "bg-accent text-white shadow-lg scale-[1.02]"
                      : "bg-white/5 text-accent hover:bg-accent/10 border border-accent/5"
                  }`}
                >
                  {day === 0 ? "রবিবার থেকে" : "সোমবার থেকে"}
                  {settings.startDay === day && <ChevronRight className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </Card>

          {/* Font Family Section */}
          <Card className="p-10 rounded-[40px] border border-primary/5 bg-card/40 backdrop-blur-xl shadow-xl space-y-8 md:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-primary/10 rounded-2xl">
                      <Settings2 className="h-6 w-6 text-primary" />
                   </div>
                   <h2 className="font-display text-2xl font-black text-accent tracking-tight py-1">ফন্ট শৈলী</h2>
                </div>
                <div className="max-w-md">
                   <Select 
                    value={settings.fontFamily} 
                    onValueChange={(v) => update({ fontFamily: v as any })}
                  >
                    <SelectTrigger className="h-16 rounded-[24px] border-none bg-white/5 text-accent font-black tracking-widest px-8 shadow-inner">
                      <SelectValue placeholder="ফন্ট নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[24px] border-none bg-card/90 backdrop-blur-xl shadow-2xl">
                      <SelectItem value="hind" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>হিন্দ শিলিগুড়ি (সাধারণ)</SelectItem>
                      <SelectItem value="noto" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>নোটো সান্স বেঙ্গলি</SelectItem>
                      <SelectItem value="notoserif" style={{ fontFamily: "'Noto Serif Bengali', serif" }}>নোটো শেরিফ বেঙ্গলি</SelectItem>
                      <SelectItem value="tiro" style={{ fontFamily: "'Tiro Bangla', serif" }}>তিরো বাংলা (ঐতিহ্যবাহী)</SelectItem>
                      <SelectItem value="mina" style={{ fontFamily: "'Mina', sans-serif" }}>মিনা</SelectItem>
                      <SelectItem value="anek" style={{ fontFamily: "'Anek Bangla', sans-serif" }}>অনেক বাংলা</SelectItem>
                      <SelectItem value="atma" style={{ fontFamily: "'Atma', cursive" }}>আত্মা (হস্তাক্ষর)</SelectItem>
                      <SelectItem value="galada" style={{ fontFamily: "'Galada', cursive" }}>গালদা (স্টাইলিশ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex-1 p-8 rounded-[32px] bg-primary/5 border border-primary/10 flex flex-col items-center justify-center text-center">
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 opacity-60">প্রিভিউ</div>
                 <p className="text-2xl font-black text-accent leading-relaxed" style={{ fontFamily: `var(--font-${settings.fontFamily})` }}>
                   আমাদের এই সুন্দর <span className="text-primary">মাতৃভাষা</span> বাংলা।
                 </p>
              </div>
            </div>
          </Card>

          {/* City Selection Section */}
          <Card className="p-10 rounded-[40px] border border-none bg-accent/5 shadow-2xl md:col-span-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
               <MapPin className="h-48 w-48" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="space-y-3">
                  <h3 className="font-display text-3xl font-black text-accent tracking-tighter">শহর নির্বাচন</h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-lg">
                    সঠিক সূর্যোদয় ও সূর্যাস্তের সময় পেতে আপনার নিকটস্থ শহরটি নির্বাচন করুন। এটি পঞ্জিকার অন্যান্য গণনার জন্যও প্রয়োজনীয়।
                  </p>
               </div>
               <div className="w-full md:w-80">
                  <Select value={settings.city} onValueChange={(v) => update({ city: v as any })}>
                    <SelectTrigger className="h-16 rounded-[24px] border-none bg-white/10 text-accent font-black tracking-widest px-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-[24px] border-none bg-card/90 backdrop-blur-xl shadow-2xl">
                      <SelectItem value="Kolkata">কলকাতা (West Bengal)</SelectItem>
                      <SelectItem value="Siliguri">শিলিগুড়ি (West Bengal)</SelectItem>
                      <SelectItem value="Agartala">আগরতলা (Tripura)</SelectItem>
                      <SelectItem value="Guwahati">গুয়াহাটি (Assam)</SelectItem>
                      <SelectItem value="Dhaka">ঢাকা (Bangladesh)</SelectItem>
                      <SelectItem value="Delhi">দিল্লি (NCR)</SelectItem>
                      <SelectItem value="Mumbai">মুম্বই (Maharashtra)</SelectItem>
                      <SelectItem value="Chennai">চেন্নাই (Tamil Nadu)</SelectItem>
                      <SelectItem value="Bengaluru">বেঙ্গালুরু (Karnataka)</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
            </div>
          </Card>
        </div>
      </section>
    </PageShell>
  );
};

function themeIcon(t: Theme) {
  switch (t) {
    case "light": return "🌞";
    case "dark": return "🌙";
    case "festive": return "🪔";
  }
}

function themeLabel(t: Theme) {
  return t === "light" ? "লাইট মোড" : t === "dark" ? "ডার্ক মোড" : "উৎসব মোড";
}

export default Settings;
