import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Globe, Loader2, Calendar as CalIcon } from "lucide-react";
import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toBanglaNum } from "@/lib/bangla-calendar";
import { BengaliWikiDialog } from "@/components/calendar/BengaliWikiDialog";

interface Country {
  countryCode: string;
  name: string;
}

interface PublicHoliday {
  date: string;          // YYYY-MM-DD
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  types: string[];
}

const BN_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

function formatDateBn(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${toBanglaNum(d)} ${BN_MONTHS[m - 1]} ${toBanglaNum(y)}`;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 1 + i);

const HolidaysPage = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [country, setCountry] = useState<string>("IN");
  const [year, setYear] = useState<number>(CURRENT_YEAR);
  const [holidays, setHolidays] = useState<PublicHoliday[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  // Load country list once
  useEffect(() => {
    fetch("https://date.nager.at/api/v3/AvailableCountries")
      .then((r) => r.json())
      .then((data: Country[]) => setCountries(data))
      .catch(() => setError("দেশের তালিকা লোড করা যায়নি।"));
  }, []);

  // Load holidays whenever country/year changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`)
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((data: PublicHoliday[]) => setHolidays(data))
      .catch(() => {
        setError("ছুটির তথ্য লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।");
        setHolidays([]);
      })
      .finally(() => setLoading(false));
  }, [country, year]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return holidays;
    return holidays.filter(
      (h) => h.localName.toLowerCase().includes(t) || h.name.toLowerCase().includes(t),
    );
  }, [holidays, q]);

  const grouped = useMemo(() => {
    const map = new Map<number, PublicHoliday[]>();
    filtered.forEach((h) => {
      const m = Number(h.date.split("-")[1]);
      if (!map.has(m)) map.set(m, []);
      map.get(m)!.push(h);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [filtered]);

  const countryName = countries.find((c) => c.countryCode === country)?.name ?? country;

  return (
    <PageShell>
      <section className="container py-4">
        <div className="mb-3">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← মূল পাতা</Link>
        </div>

        <Card className="mb-4 overflow-hidden border-2 border-primary/20 shadow-warm">
          <div className="bg-gradient-festive p-5 text-primary-foreground">
            <div className="text-xs uppercase tracking-wider opacity-90">বিশ্বজুড়ে</div>
            <h1 className="mt-1 flex items-center gap-2 font-display text-2xl font-bold md:text-3xl">
              <Globe className="h-6 w-6" /> বিশ্বের ছুটি
            </h1>
            <p className="mt-1 text-sm opacity-95">
              যেকোনো দেশের সরকারি ছুটি ও জাতীয় দিবসের তালিকা দেখুন।
            </p>
          </div>
        </Card>

        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">দেশ</label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger><SelectValue placeholder="দেশ নির্বাচন করুন" /></SelectTrigger>
              <SelectContent className="max-h-72">
                {countries.map((c) => (
                  <SelectItem key={c.countryCode} value={c.countryCode}>
                    {c.name} ({c.countryCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">বছর</label>
            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>{toBanglaNum(y)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">খুঁজুন</label>
            <Input placeholder="ছুটির নাম..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-accent">
            {countryName} — {toBanglaNum(year)}
          </h2>
          {!loading && (
            <Badge variant="secondary">মোট {toBanglaNum(filtered.length)}টি ছুটি</Badge>
          )}
        </div>

        {loading && (
          <Card className="flex items-center justify-center gap-2 p-8 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> লোড হচ্ছে...
          </Card>
        )}

        {error && !loading && (
          <Card className="p-6 text-center text-destructive">{error}</Card>
        )}

        {!loading && !error && filtered.length === 0 && (
          <Card className="p-6 text-center text-muted-foreground">কোনো ছুটি পাওয়া যায়নি</Card>
        )}

        {!loading && !error && grouped.length > 0 && (
          <div className="space-y-5">
            {grouped.map(([m, list]) => (
              <div key={m}>
                <h3 className="mb-2 font-display text-base font-bold text-primary">
                  {BN_MONTHS[m - 1]}
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {list.map((h) => (
                    <BengaliWikiDialog
                      key={h.date + h.name}
                      query={h.localName || h.name}
                      title={h.localName || h.name}
                      subtitle="সরকারি ছুটির দিন"
                      trigger={
                        <Card className="flex gap-4 p-4 shadow-soft hover:shadow-warm transition-all cursor-pointer border-primary/5 bg-white/60 backdrop-blur-md group">
                          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-festive text-center shadow-inner ring-2 ring-white/50 group-hover:scale-105 transition-transform">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                              {BN_MONTHS[Number(h.date.split("-")[1]) - 1].slice(0, 3)}
                            </div>
                            <div className="font-display text-xl font-bold leading-none text-white">
                              {toBanglaNum(Number(h.date.split("-")[2]))}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="font-display text-base font-bold text-accent group-hover:text-primary transition-colors">{h.localName}</div>
                              {h.global && <Badge variant="secondary" className="text-[10px] bg-primary/5 text-primary font-bold">জাতীয়</Badge>}
                            </div>
                            {h.name !== h.localName && (
                              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{h.name}</div>
                            )}
                            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/70">
                              <CalIcon className="h-3 w-3" /> {formatDateBn(h.date)}
                            </div>
                          </div>
                        </Card>
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          তথ্যসূত্র: date.nager.at — উন্মুক্ত পাবলিক হলিডে API
        </p>
      </section>
    </PageShell>
  );
};

export default HolidaysPage;
