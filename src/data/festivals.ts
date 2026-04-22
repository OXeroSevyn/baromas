import type { Region } from "@/lib/bangla-calendar";

export type FestivalType = "national" | "cultural" | "seasonal" | "literary";

export interface Festival {
  id: string;
  name: string;          // Bangla
  englishName?: string;
  type: FestivalType;
  region: "BD" | "WB" | "both";
  description: string;
  // Date rule:
  // fixed-greg: occurs on fixed gregorian date {month: 1-12, day}
  // fixed-bangla: occurs on fixed bangla {monthIndex: 0-11, day}
  // computed: function returns Date for given gregorian year
  rule:
    | { kind: "fixed-greg"; month: number; day: number }
    | { kind: "fixed-bangla"; monthIndex: number; day: number }
    | { kind: "computed"; compute: (year: number, region: Region) => Date | null };
  emoji?: string;
  image?: string;
}

// Approximate Eid dates (lunar — listed as national public holidays only).
const EID_FITR: Record<number, [number, number]> = {
  2024: [4, 11], 2025: [3, 31], 2026: [3, 20], 2027: [3, 9], 2028: [2, 26],
  2029: [2, 14], 2030: [2, 4],
};
const EID_ADHA: Record<number, [number, number]> = {
  2024: [6, 17], 2025: [6, 7], 2026: [5, 27], 2027: [5, 17], 2028: [5, 5],
  2029: [4, 24], 2030: [4, 14],
};

// Durga Puja (Mahashashthi) approximate
const DURGA_SHASHTHI: Record<number, [number, number]> = {
  2024: [10, 9], 2025: [9, 28], 2026: [10, 17], 2027: [10, 7], 2028: [9, 25],
  2029: [10, 14], 2030: [10, 3],
};

// Saraswati Puja (Vasant Panchami)
const SARASWATI: Record<number, [number, number]> = {
  2024: [2, 14], 2025: [2, 3], 2026: [1, 23], 2027: [2, 11], 2028: [1, 31],
  2029: [2, 18], 2030: [2, 8],
};

// Kali Puja
const KALI: Record<number, [number, number]> = {
  2024: [11, 1], 2025: [10, 21], 2026: [11, 9], 2027: [10, 29], 2028: [10, 17],
  2029: [11, 5], 2030: [10, 26],
};

const LAKSHMI: Record<number, [number, number]> = {
  2024: [10, 16], 2025: [10, 6], 2026: [10, 25], 2027: [10, 15], 2028: [10, 3],
  2029: [10, 22], 2030: [10, 11],
};

function lookup(map: Record<number, [number, number]>, year: number): Date | null {
  const v = map[year];
  return v ? new Date(year, v[0] - 1, v[1]) : null;
}

import { pohelaBoishakhDate } from "@/lib/bangla-calendar";

export const FESTIVALS: Festival[] = [
  {
    id: "pohela-boishakh",
    name: "পহেলা বৈশাখ",
    englishName: "Bangla New Year",
    type: "cultural",
    region: "both",
    description: "বাংলা নববর্ষ — নতুন বছরের সূচনা, হালখাতা ও মঙ্গল শোভাযাত্রা।",
    rule: { kind: "computed", compute: (y, r) => pohelaBoishakhDate(y, r) },
    emoji: "🎊",
    image: "/branding/festivals/boishakh.png",
  },
  {
    id: "ekushe",
    name: "একুশে ফেব্রুয়ারি — ভাষা দিবস",
    englishName: "International Mother Language Day",
    type: "national",
    region: "both",
    description: "ভাষা শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস।",
    rule: { kind: "fixed-greg", month: 2, day: 21 },
    emoji: "🕯️",
    image: "/branding/festivals/ekushe.png",
  },
  {
    id: "independence-bd",
    name: "স্বাধীনতা দিবস (বাংলাদেশ)",
    type: "national",
    region: "BD",
    description: "১৯৭১ সালের ২৬ মার্চ বাংলাদেশের স্বাধীনতা ঘোষণা।",
    rule: { kind: "fixed-greg", month: 3, day: 26 },
    emoji: "🇧🇩",
    image: "/branding/festivals/independence-bd.png",
  },
  {
    id: "independence-in",
    name: "স্বাধীনতা দিবস (ভারত)",
    type: "national",
    region: "WB",
    description: "১৯৪৭ সালের ১৫ আগস্ট ভারতের স্বাধীনতা।",
    rule: { kind: "fixed-greg", month: 8, day: 15 },
    emoji: "🇮🇳",
    image: "/branding/festivals/independence-in.png",
  },
  {
    id: "republic-in",
    name: "প্রজাতন্ত্র দিবস (ভারত)",
    type: "national",
    region: "WB",
    description: "১৯৫০ সালের ২৬ জানুয়ারি ভারতের সংবিধান কার্যকর।",
    rule: { kind: "fixed-greg", month: 1, day: 26 },
    emoji: "🇮🇳",
    image: "/branding/festivals/republic-in.png",
  },
  {
    id: "victory-bd",
    name: "বিজয় দিবস (বাংলাদেশ)",
    type: "national",
    region: "BD",
    description: "১৯৭১ সালের ১৬ ডিসেম্বর মুক্তিযুদ্ধে বিজয়।",
    rule: { kind: "fixed-greg", month: 12, day: 16 },
    emoji: "🏆",
    image: "/branding/festivals/victory-bd.png",
  },
  {
    id: "rabindra-jayanti",
    name: "রবীন্দ্র জয়ন্তী",
    type: "literary",
    region: "both",
    description: "কবিগুরু রবীন্দ্রনাথ ঠাকুরের জন্মদিন (২৫ বৈশাখ)।",
    rule: { kind: "fixed-bangla", monthIndex: 0, day: 25 },
    emoji: "📜",
    image: "/branding/festivals/rabindra.png",
  },
  {
    id: "nazrul-jayanti",
    name: "নজরুল জয়ন্তী",
    type: "literary",
    region: "both",
    description: "বিদ্রোহী কবি কাজী নজরুল ইসলামের জন্মদিন (১১ জ্যৈষ্ঠ)।",
    rule: { kind: "fixed-bangla", monthIndex: 1, day: 11 },
    emoji: "✒️",
    image: "/branding/festivals/nazrul.png",
  },
  {
    id: "poush-parbon",
    name: "পৌষ পার্বণ",
    type: "cultural",
    region: "both",
    description: "পিঠা-পুলির উৎসব, পৌষ সংক্রান্তি।",
    rule: { kind: "fixed-greg", month: 1, day: 14 },
    emoji: "🥮",
    image: "/branding/festivals/poush.png",
  },
  {
    id: "saraswati",
    name: "সরস্বতী পূজা",
    type: "cultural",
    region: "both",
    description: "বিদ্যার দেবী সরস্বতীর আরাধনা, বসন্ত পঞ্চমী।",
    rule: { kind: "computed", compute: (y) => lookup(SARASWATI, y) },
    emoji: "📚",
    image: "/branding/festivals/saraswati.png",
  },
  {
    id: "durga-puja",
    name: "দুর্গা পূজা (ষষ্ঠী)",
    type: "cultural",
    region: "both",
    description: "শারদীয়া দুর্গোৎসবের সূচনা।",
    rule: { kind: "computed", compute: (y) => lookup(DURGA_SHASHTHI, y) },
    emoji: "🪔",
    image: "/branding/festivals/durga.png",
  },
  {
    id: "lakshmi",
    name: "লক্ষ্মী পূজা",
    type: "cultural",
    region: "both",
    description: "কোজাগরী লক্ষ্মী পূজা।",
    rule: { kind: "computed", compute: (y) => lookup(LAKSHMI, y) },
    emoji: "🪙",
    image: "/branding/festivals/lakshmi.png",
  },
  {
    id: "kali",
    name: "কালী পূজা",
    type: "cultural",
    region: "both",
    description: "শ্যামা পূজা ও দীপাবলি।",
    rule: { kind: "computed", compute: (y) => lookup(KALI, y) },
    emoji: "🪔",
    image: "/branding/festivals/kali.png",
  },
  {
    id: "eid-fitr",
    name: "ঈদ-উল-ফিতর",
    type: "national",
    region: "both",
    description: "জাতীয় ছুটির দিন।",
    rule: { kind: "computed", compute: (y) => lookup(EID_FITR, y) },
    emoji: "🌙",
    image: "/branding/festivals/eid-fitr.png",
  },
  {
    id: "eid-adha",
    name: "ঈদ-উল-আযহা",
    type: "national",
    region: "both",
    description: "জাতীয় ছুটির দিন।",
    rule: { kind: "computed", compute: (y) => lookup(EID_ADHA, y) },
    emoji: "🌙",
    image: "/branding/festivals/eid-adha.png",
  },
  {
    id: "christmas",
    name: "বড়দিন",
    englishName: "Christmas",
    type: "national",
    region: "both",
    description: "যিশুখ্রিস্টের জন্মদিন, জাতীয় ছুটি।",
    rule: { kind: "fixed-greg", month: 12, day: 25 },
    emoji: "🎄",
    image: "/branding/festivals/christmas.png",
  },
  {
    id: "new-year",
    name: "ইংরেজি নববর্ষ",
    type: "cultural",
    region: "both",
    description: "গ্রেগরিয়ান নববর্ষ।",
    rule: { kind: "fixed-greg", month: 1, day: 1 },
    emoji: "🎆",
    image: "/branding/festivals/new-year.png",
  },
  {
    id: "may-day",
    name: "মে দিবস",
    type: "national",
    region: "both",
    description: "আন্তর্জাতিক শ্রমিক দিবস।",
    rule: { kind: "fixed-greg", month: 5, day: 1 },
    emoji: "⚒️",
    image: "/branding/festivals/may-day.png",
  },
];

import { gregorianToBangla, isSameDay } from "@/lib/bangla-calendar";

export function getFestivalDate(f: Festival, gregYear: number, region: Region): Date | null {
  if (f.rule.kind === "fixed-greg") {
    return new Date(gregYear, f.rule.month - 1, f.rule.day);
  }
  if (f.rule.kind === "computed") {
    return f.rule.compute(gregYear, region);
  }
  // fixed-bangla — find gregorian day in this gregYear matching bangla month/day
  for (let m = 0; m < 12; m++) {
    for (let d = 1; d <= 31; d++) {
      const g = new Date(gregYear, m, d);
      if (g.getFullYear() !== gregYear) continue;
      const b = gregorianToBangla(g, region);
      if (b.monthIndex === f.rule.monthIndex && b.day === f.rule.day) {
        return g;
      }
    }
  }
  return null;
}

export function festivalsOnDate(date: Date, region: Region): Festival[] {
  return FESTIVALS.filter((f) => {
    if (f.region !== "both" && f.region !== region) return false;
    const d = getFestivalDate(f, date.getFullYear(), region);
    return d ? isSameDay(d, date) : false;
  });
}

export function festivalsInYear(
  gregYear: number,
  region: Region,
): { festival: Festival; date: Date }[] {
  const out: { festival: Festival; date: Date }[] = [];
  for (const f of FESTIVALS) {
    if (f.region !== "both" && f.region !== region) continue;
    const d = getFestivalDate(f, gregYear, region);
    if (d) out.push({ festival: f, date: d });
  }
  return out.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function upcomingFestivals(
  from: Date,
  region: Region,
  limit = 5,
): { festival: Festival; date: Date }[] {
  const y = from.getFullYear();
  const all = [...festivalsInYear(y, region), ...festivalsInYear(y + 1, region)];
  return all
    .filter((x) => x.date >= new Date(from.getFullYear(), from.getMonth(), from.getDate()))
    .slice(0, limit);
}
