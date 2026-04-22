import { useState } from "react";
import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatBanglaDate,
  gregorianToBangla,
  isoDate,
  parseIso,
  toBanglaNum,
} from "@/lib/bangla-calendar";
import { useSettings } from "@/hooks/use-settings";

const Tools = () => {
  const [settings] = useSettings();
  const [conv, setConv] = useState(isoDate(new Date()));
  const [birth, setBirth] = useState("");
  const [d1, setD1] = useState(isoDate(new Date()));
  const [d2, setD2] = useState(isoDate(new Date()));

  const convDate = parseIso(conv);
  const convBn = gregorianToBangla(convDate, settings.region);

  const ageBn = (() => {
    if (!birth) return null;
    const b = parseIso(birth);
    const today = new Date();
    const bnB = gregorianToBangla(b, settings.region);
    const bnT = gregorianToBangla(today, settings.region);
    const years = bnT.year - bnB.year;
    return { years, gregYears: today.getFullYear() - b.getFullYear() };
  })();

  const diff = (() => {
    const a = parseIso(d1).getTime();
    const b = parseIso(d2).getTime();
    return Math.abs(Math.round((b - a) / 86400000));
  })();

  return (
    <PageShell>
      <section className="container py-6">
        <h1 className="font-display text-3xl font-bold text-accent">টুলস</h1>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="p-5 shadow-soft">
            <h2 className="font-display text-lg font-bold text-accent">ইংরেজি → বাংলা তারিখ</h2>
            <div className="mt-3 space-y-2">
              <Label>ইংরেজি তারিখ</Label>
              <Input type="date" value={conv} onChange={(e) => setConv(e.target.value)} />
            </div>
            <div className="mt-4 rounded-lg bg-gradient-festive p-4 text-primary-foreground">
              <div className="text-xs uppercase opacity-90">বাংলা তারিখ</div>
              <div className="mt-1 font-display text-xl font-bold">{formatBanglaDate(convBn)}</div>
              <div className="text-sm opacity-95">{convBn.weekdayName} · {convBn.ritu} {convBn.rituEmoji}</div>
            </div>
          </Card>

          <Card className="p-5 shadow-soft">
            <h2 className="font-display text-lg font-bold text-accent">বয়স গণনা</h2>
            <div className="mt-3 space-y-2">
              <Label>জন্ম তারিখ</Label>
              <Input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />
            </div>
            {ageBn && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="text-xs text-muted-foreground">বঙ্গাব্দে</div>
                  <div className="font-display text-xl font-bold text-primary">{toBanglaNum(ageBn.years)} বছর</div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="text-xs text-muted-foreground">খ্রিস্টাব্দে</div>
                  <div className="font-display text-xl font-bold text-accent">{toBanglaNum(ageBn.gregYears)} বছর</div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-5 shadow-soft md:col-span-2">
            <h2 className="font-display text-lg font-bold text-accent">দুই তারিখের ব্যবধান</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <Label>প্রথম তারিখ</Label>
                <Input type="date" value={d1} onChange={(e) => setD1(e.target.value)} />
              </div>
              <div>
                <Label>দ্বিতীয় তারিখ</Label>
                <Input type="date" value={d2} onChange={(e) => setD2(e.target.value)} />
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-gradient-sunrise p-4">
              <div className="text-xs uppercase text-foreground/70">মোট ব্যবধান</div>
              <div className="mt-1 font-display text-2xl font-bold">{toBanglaNum(diff)} দিন</div>
              <div className="text-sm text-foreground/80">
                ≈ {toBanglaNum(Math.floor(diff / 7))} সপ্তাহ · {toBanglaNum(Math.floor(diff / 30))} মাস
              </div>
            </div>
          </Card>
        </div>
      </section>
    </PageShell>
  );
};

export default Tools;
