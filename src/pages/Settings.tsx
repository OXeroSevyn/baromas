import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings, type FontSize, type Theme } from "@/hooks/use-settings";
import type { Region } from "@/lib/bangla-calendar";

const Settings = () => {
  const [settings, update] = useSettings();

  return (
    <PageShell>
      <section className="container py-6">
        <h1 className="font-display text-3xl font-bold text-accent">সেটিংস</h1>
        <p className="mt-1 text-muted-foreground">আপনার পছন্দ অনুযায়ী পঞ্জিকা সাজান</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="p-5 shadow-soft">
            <h2 className="font-display text-lg font-bold text-accent">থিম</h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["light", "dark", "festive"] as Theme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => update({ theme: t })}
                  className={`rounded-lg border-2 p-3 font-semibold transition-all ${
                    settings.theme === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {themeLabel(t)}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5 shadow-soft">
            <h2 className="font-display text-lg font-bold text-accent">অঞ্চল</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["WB", "BD"] as Region[]).map((r) => (
                <button
                  key={r}
                  onClick={() => update({ region: r, city: r === "BD" ? "Dhaka" : "Kolkata" })}
                  className={`rounded-lg border-2 p-3 font-semibold transition-all ${
                    settings.region === r
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {r === "WB" ? "🇮🇳 পশ্চিমবঙ্গ" : "🇧🇩 বাংলাদেশ"}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              এটি পহেলা বৈশাখের তারিখ, ছুটির তালিকা ও সূর্যোদয়ের শহর প্রভাবিত করে।
            </p>
          </Card>

          <Card className="p-5 shadow-soft">
            <h2 className="font-display text-lg font-bold text-accent">ফন্ট সাইজ</h2>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {(["sm", "md", "lg", "xl"] as FontSize[]).map((f) => (
                <button
                  key={f}
                  onClick={() => update({ fontSize: f })}
                  className={`rounded-lg border-2 p-3 font-semibold transition-all ${
                    settings.fontSize === f ? "border-primary bg-primary/10 text-primary" : "border-border"
                  }`}
                >
                  {f === "sm" ? "ক" : f === "md" ? "কক" : f === "lg" ? "ককক" : "কককক"}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5 shadow-soft">
            <h2 className="font-display text-lg font-bold text-accent">সপ্তাহ শুরু</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => update({ startDay: 0 })}
                className={`rounded-lg border-2 p-3 font-semibold ${settings.startDay === 0 ? "border-primary bg-primary/10 text-primary" : "border-border"}`}
              >
                রবিবার থেকে
              </button>
              <button
                onClick={() => update({ startDay: 1 })}
                className={`rounded-lg border-2 p-3 font-semibold ${settings.startDay === 1 ? "border-primary bg-primary/10 text-primary" : "border-border"}`}
              >
                সোমবার থেকে
              </button>
            </div>
          </Card>

          <Card className="p-5 shadow-soft">
            <h2 className="font-display text-lg font-bold text-accent">ফন্ট শৈলী (Font Family)</h2>
            <div className="mt-3 grid grid-cols-1 gap-2">
              <Select 
                value={settings.fontFamily} 
                onValueChange={(v) => update({ fontFamily: v as any })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="ফন্ট নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hind" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>হিন্দ শিলিগুড়ি (সাধারণ)</SelectItem>
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
            <p className="mt-2 text-xs text-muted-foreground italic" style={{ fontFamily: "var(--font-main)" }}>
              এই লাইনটি নির্বাচিত ফন্টে দেখা যাবে।
            </p>
          </Card>

          <Card className="p-5 shadow-soft md:col-span-2">
            <h2 className="font-display text-lg font-bold text-accent">শহর (সূর্যোদয়/সূর্যাস্ত)</h2>
            <div className="mt-3 max-w-xs">
              <Label>শহর নির্বাচন করুন</Label>
              <Select value={settings.city} onValueChange={(v) => update({ city: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
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
          </Card>
        </div>
      </section>
    </PageShell>
  );
};

function themeLabel(t: Theme) {
  return t === "light" ? "🌞 দিনের আলো" : t === "dark" ? "🌙 রাত" : "🪔 উৎসব";
}

export default Settings;
