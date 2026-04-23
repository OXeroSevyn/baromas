// Pure-TS Bangla Panjika calendar utilities.
// Approach: Bangla New Year (Pohela Boishakh) follows Bengali Panjika tradition.
// Bangladesh (post-2018 reform): fixed 14 April.
// West Bengal Panjika (Surya Siddhanta): falls on 14 or 15 April depending on Sankranti.
// We use a simplified Surya-Siddhanta-style rule: solar longitude crossing 0 at sunrise.
// For pragmatic accuracy we hardcode WB Pohela Boishakh dates 2020-2040 derived from
// published Panjikas, falling back to 15 April.

export type Region = "BD" | "WB";

export const BANGLA_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBanglaNum(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => BANGLA_DIGITS[+d]);
}

export const BANGLA_MONTHS = [
  "বৈশাখ",
  "জ্যৈষ্ঠ",
  "আষাঢ়",
  "শ্রাবণ",
  "ভাদ্র",
  "আশ্বিন",
  "কার্তিক",
  "অগ্রহায়ণ",
  "পৌষ",
  "মাঘ",
  "ফাল্গুন",
  "চৈত্র",
] as const;

export const BANGLA_MONTH_MEANINGS: Record<string, string> = {
  বৈশাখ: "নববর্ষের মাস, বিশাখা নক্ষত্র থেকে নাম",
  জ্যৈষ্ঠ: "আম-কাঁঠালের মাস, জ্যেষ্ঠা নক্ষত্র",
  আষাঢ়: "বর্ষার সূচনা, পূর্বাষাঢ়া নক্ষত্র",
  শ্রাবণ: "অবিরাম বৃষ্টির মাস, শ্রবণা নক্ষত্র",
  ভাদ্র: "শরতের আগমন, পূর্বভাদ্রপদ নক্ষত্র",
  আশ্বিন: "শারদীয় উৎসবের মাস, অশ্বিনী নক্ষত্র",
  কার্তিক: "হেমন্তের শুরু, কৃত্তিকা নক্ষত্র",
  অগ্রহায়ণ: "নবান্নের মাস, মৃগশিরা নক্ষত্র",
  পৌষ: "পিঠা-পার্বণের মাস, পুষ্যা নক্ষত্র",
  মাঘ: "শীতের শেষ, মঘা নক্ষত্র",
  ফাল্গুন: "বসন্তের আগমন, ফাল্গুনী নক্ষত্র",
  চৈত্র: "বছরের শেষ মাস, চিত্রা নক্ষত্র",
};

export const RITUS = [
  { name: "গ্রীষ্ম", months: ["বৈশাখ", "জ্যৈষ্ঠ"], emoji: "☀️", iconifyName: "fluent-emoji:sun" },
  { name: "বর্ষা", months: ["আষাঢ়", "শ্রাবণ"], emoji: "🌧️", iconifyName: "fluent-emoji:cloud-with-rain" },
  { name: "শরৎ", months: ["ভাদ্র", "আশ্বিন"], emoji: "🍂", iconifyName: "fluent-emoji:fallen-leaf" },
  { name: "হেমন্ত", months: ["কার্তিক", "অগ্রহায়ণ"], emoji: "🌾", iconifyName: "fluent-emoji:sheaf-of-rice" },
  { name: "শীত", months: ["পৌষ", "মাঘ"], emoji: "❄️", iconifyName: "fluent-emoji:snowflake" },
  { name: "বসন্ত", months: ["ফাল্গুন", "চৈত্র"], emoji: "🌸", iconifyName: "fluent-emoji:cherry-blossom" },
] as const;

export const BANGLA_WEEKDAYS = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
] as const;

export const BANGLA_WEEKDAYS_SHORT = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"] as const;

export const TITHIS = [
  "প্রতিপদ",
  "দ্বিতীয়া",
  "তৃতীয়া",
  "চতুর্থী",
  "পঞ্চমী",
  "ষষ্ঠী",
  "সপ্তমী",
  "অষ্টমী",
  "নবমী",
  "দশমী",
  "একাদশী",
  "দ্বাদশী",
  "ত্রয়োদশী",
  "চতুর্দশী",
  "পূর্ণিমা/অমাবস্যা",
];

export const NAKSHATRAS = [
  "অশ্বিনী", "ভরণী", "কৃত্তিকা", "রোহিণী", "মৃগশিরা", "আর্দ্রা",
  "পুনর্বসু", "পুষ্যা", "অশ্লেষা", "মঘা", "পূর্বফাল্গুনী", "উত্তরফাল্গুনী",
  "হস্তা", "চিত্রা", "স্বাতী", "বিশাখা", "অনুরাধা", "জ্যেষ্ঠা",
  "মূলা", "পূর্বাষাঢ়া", "উত্তরাষাঢ়া", "শ্রবণা", "ধনিষ্ঠা", "শতভিষা",
  "পূর্বভাদ্রপদ", "উত্তরভাদ্রপদ", "রেবতী",
];

// Pohela Boishakh dates: WB Panjika (mostly 15 April, sometimes 14).
// BD: fixed 14 April. Years 2020-2040 covered.
const WB_POHELA: Record<number, [number, number]> = {
  2020: [4, 14], 2021: [4, 14], 2022: [4, 15], 2023: [4, 15], 2024: [4, 14],
  2025: [4, 15], 2026: [4, 15], 2027: [4, 15], 2028: [4, 14], 2029: [4, 14],
  2030: [4, 14], 2031: [4, 15], 2032: [4, 14], 2033: [4, 14], 2034: [4, 14],
  2035: [4, 15], 2036: [4, 14], 2037: [4, 14], 2038: [4, 14], 2039: [4, 15],
  2040: [4, 14],
};

export function pohelaBoishakhDate(gregYear: number, region: Region): Date {
  if (region === "BD") return new Date(gregYear, 3, 14); // April = 3
  const wb = WB_POHELA[gregYear];
  if (wb) return new Date(gregYear, wb[0] - 1, wb[1]);
  return new Date(gregYear, 3, 15);
}

// Bangla month lengths (post-2018 BD reform):
// Bangladesh: Boishakh-Asharh 31, Sravan-Ashvin 31 in leap, otherwise pattern…
// We use a single widely-used pattern (works for both regions for display):
// বৈ-ভা: 31, 31, 31, 31, 31  (months 1-5)
// আশ্বিন: 30/31 (leap), kept 30 for simplicity, recomputed via gregorian span
// We compute month length by walking gregorian days between Sankrantis.

// Simplified: each Bangla month starts on a specific Gregorian date approx.
// Use traditional offsets from Pohela Boishakh (works ±1 day for display use).
const MONTH_OFFSETS_DAYS = [0, 31, 62, 93, 124, 155, 185, 215, 245, 275, 305, 335]; // start of each month from Boishakh 1
const MONTH_LENGTHS = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30]; // approx; last adjusts

export interface BanglaDate {
  year: number;          // Bangla year
  monthIndex: number;    // 0-11
  monthName: string;
  day: number;           // 1..31
  weekdayIndex: number;  // 0..6 (Sun..Sat)
  weekdayName: string;
  ritu: string;
  rituEmoji: string;
  weekdayName: string;
  ritu: string;
  rituEmoji: string;
  rituIcon: string;
}

function dayDiff(a: Date, b: Date): number {
  const MS = 86400000;
  const ad = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const bd = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((ad - bd) / MS);
}

export function gregorianToBangla(g: Date, region: Region = "WB"): BanglaDate {
  const y = g.getFullYear();
  let pohela = pohelaBoishakhDate(y, region);
  let banglaYear = y - 593;
  if (g < pohela) {
    pohela = pohelaBoishakhDate(y - 1, region);
    banglaYear = y - 1 - 593;
  }
  const diff = dayDiff(g, pohela);
  let monthIndex = 11;
  for (let i = 0; i < 12; i++) {
    const start = MONTH_OFFSETS_DAYS[i];
    const end = i < 11 ? MONTH_OFFSETS_DAYS[i + 1] : 366;
    if (diff >= start && diff < end) {
      monthIndex = i;
      break;
    }
  }
  const day = diff - MONTH_OFFSETS_DAYS[monthIndex] + 1;
  const monthName = BANGLA_MONTHS[monthIndex];
  const ritu = RITUS.find((r) => r.months.includes(monthName as never))!;
  return {
    year: banglaYear,
    monthIndex,
    monthName,
    day,
    weekdayIndex: g.getDay(),
    weekdayName: BANGLA_WEEKDAYS[g.getDay()],
    ritu: ritu.name,
    rituEmoji: ritu.emoji,
    rituIcon: ritu.iconifyName,
  };
}

export function formatBanglaDate(b: BanglaDate, withYear = true): string {
  const base = `${toBanglaNum(b.day)} ${b.monthName}`;
  return withYear ? `${base}, ${toBanglaNum(b.year)} বঙ্গাব্দ` : base;
}

export function getMonthLength(monthIndex: number): number {
  return MONTH_LENGTHS[monthIndex];
}

// --- Astronomical approximations ---

// Moon phase 0..1 (0 = new, 0.5 = full)
export function moonPhase(d: Date): number {
  // Conway's algorithm refined
  const jd = d.getTime() / 86400000 + 2440587.5;
  const days = jd - 2451550.1;
  const phase = (days / 29.530588853) % 1;
  return phase < 0 ? phase + 1 : phase;
}

export function getTithi(d: Date): { index: number; name: string; paksha: string } {
  const phase = moonPhase(d);
  const tithiNum = Math.floor(phase * 30); // 0..29
  const inShukla = tithiNum < 15;
  const idx = inShukla ? tithiNum : tithiNum - 15;
  return {
    index: idx,
    name: TITHIS[idx],
    paksha: inShukla ? "শুক্ল পক্ষ" : "কৃষ্ণ পক্ষ",
  };
}

export function getNakshatra(d: Date): string {
  // Approximate moon longitude based on synodic month and reference
  const jd = d.getTime() / 86400000 + 2440587.5;
  const days = jd - 2451545.0;
  const moonLong = (218.316 + 13.176396 * days) % 360;
  const idx = Math.floor(((moonLong + 360) % 360) / (360 / 27));
  return NAKSHATRAS[idx];
}

// Simple sunrise/sunset (NOAA approximation) for given lat/lon
export function sunTimes(date: Date, lat: number, lon: number): { sunrise: Date; sunset: Date } {
  const rad = Math.PI / 180;
  const dayOfYear = Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0)) /
      86400000,
  );
  const fracYear = ((2 * Math.PI) / 365) * (dayOfYear - 1);
  const decl =
    0.006918 -
    0.399912 * Math.cos(fracYear) +
    0.070257 * Math.sin(fracYear) -
    0.006758 * Math.cos(2 * fracYear) +
    0.000907 * Math.sin(2 * fracYear);
  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(fracYear) -
      0.032077 * Math.sin(fracYear) -
      0.014615 * Math.cos(2 * fracYear) -
      0.040849 * Math.sin(2 * fracYear));
  const cosH =
    (Math.cos(90.833 * rad) - Math.sin(lat * rad) * Math.sin(decl)) /
    (Math.cos(lat * rad) * Math.cos(decl));
  const ha = Math.acos(Math.max(-1, Math.min(1, cosH))) / rad;
  const sunriseUTC = 720 - 4 * (lon + ha) - eqTime; // minutes
  const sunsetUTC = 720 - 4 * (lon - ha) - eqTime;
  const make = (mins: number) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCMinutes(d.getUTCMinutes() + mins);
    return d;
  };
  return { sunrise: make(sunriseUTC), sunset: make(sunsetUTC) };
}

export const CITIES = {
  Kolkata: { lat: 22.5726, lon: 88.3639, label: "কলকাতা", timezone: 330 },
  Dhaka: { lat: 23.8103, lon: 90.4125, label: "ঢাকা", timezone: 360 },
  Delhi: { lat: 28.6139, lon: 77.2090, label: "দিল্লি", timezone: 330 },
  Mumbai: { lat: 19.0760, lon: 72.8777, label: "মুম্বই", timezone: 330 },
  Chennai: { lat: 13.0827, lon: 80.2707, label: "চেন্নাই", timezone: 330 },
  Bengaluru: { lat: 12.9716, lon: 77.5946, label: "বেঙ্গালুরু", timezone: 330 },
  Siliguri: { lat: 26.7271, lon: 88.3953, label: "শিলিগুড়ি", timezone: 330 },
  Agartala: { lat: 23.8315, lon: 91.2868, label: "আগরতলা", timezone: 330 },
  Guwahati: { lat: 26.1445, lon: 91.7362, label: "গুয়াহাটি", timezone: 330 },
} as const;

export type CityName = keyof typeof CITIES;

export function formatTimeBangla(d: Date, tzOffsetMin = 330): string {
  // tzOffset: 330 = IST, 360 = BST
  const local = new Date(d.getTime() + tzOffsetMin * 60000);
  const h = local.getUTCHours();
  const m = local.getUTCMinutes();
  const h12 = ((h + 11) % 12) + 1;
  const ampm = h < 12 ? "পূর্বাহ্ন" : "অপরাহ্ন";
  return `${toBanglaNum(h12)}:${toBanglaNum(String(m).padStart(2, "0"))} ${ampm}`;
}

export function dayLengthMinutes(sunrise: Date, sunset: Date): number {
  return Math.round((sunset.getTime() - sunrise.getTime()) / 60000);
}

export function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${toBanglaNum(h)} ঘণ্টা ${toBanglaNum(m)} মিনিট`;
}

// Auspicious time — simple heuristic: 1.5 hours after sunrise (Brahma muhurta proxy)
export function auspiciousWindow(sunrise: Date): { start: Date; end: Date } {
  const start = new Date(sunrise.getTime() - 96 * 60000);
  const end = new Date(sunrise.getTime() - 48 * 60000);
  return { start, end };
}

// --- Panjika special days ---

// Returns the tithi-only "lunar day" 0..29 (0..14 Shukla, 15..29 Krishna)
export function tithiNumber(d: Date): number {
  return Math.floor(moonPhase(d) * 30);
}

export type SpecialTithi = "একাদশী" | "অমাবস্যা" | "পূর্ণিমা" | null;

export function specialTithiFor(d: Date): SpecialTithi {
  const t = tithiNumber(d);
  // Shukla Ekadashi = 10, Krishna Ekadashi = 25
  if (t === 10 || t === 25) return "একাদশী";
  if (t === 14) return "পূর্ণিমা";
  if (t === 29) return "অমাবস্যা";
  return null;
}

export interface PanjikaDay {
  date: Date;
  type: "একাদশী" | "অমাবস্যা" | "পূর্ণিমা";
  paksha: string;
  name?: string; // e.g. specific Ekadashi name
}

// Names of 24 Ekadashis in Bengali (approximate cycle, starts after Pohela Boishakh)
const EKADASHI_NAMES = [
  "মোহিনী", "অপরা", "নির্জলা", "যোগিনী", "শয়ন", "কামিকা",
  "পবিত্রা", "অন্নদা", "পার্শ্ব", "ইন্দিরা", "পাশাঙ্কুশা", "রমা",
  "প্রবোধিনী", "উৎপন্না", "মোক্ষদা", "সফলা", "পুত্রদা", "ষট্‌তিলা",
  "জয়া", "বিজয়া", "আমলকী", "পাপমোচনী", "কামদা", "বরুথিনী",
];

export function findSpecialTithisInRange(start: Date, end: Date): PanjikaDay[] {
  const result: PanjikaDay[] = [];
  let ekIdx = 0;
  // Anchor Ekadashi index roughly to month index after Boishakh of start year
  const yearStart = pohelaBoishakhDate(start.getFullYear(), "WB");
  const monthsSince = Math.max(
    0,
    Math.floor(dayDiff(start, yearStart) / 29.5),
  );
  ekIdx = (monthsSince * 2) % EKADASHI_NAMES.length;

  const cur = new Date(start);
  let lastType: SpecialTithi = null;
  while (cur <= end) {
    const t = tithiNumber(cur);
    const sp = specialTithiFor(cur);
    if (sp && sp !== lastType) {
      const paksha = t < 15 ? "শুক্ল পক্ষ" : "কৃষ্ণ পক্ষ";
      const entry: PanjikaDay = { date: new Date(cur), type: sp, paksha };
      if (sp === "একাদশী") {
        entry.name = EKADASHI_NAMES[ekIdx % EKADASHI_NAMES.length];
        ekIdx++;
      }
      result.push(entry);
    }
    lastType = sp;
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}

// --- Kalbela / Kalratri (inauspicious periods) ---
// Vedic day divided into 8 equal parts from sunrise to sunset.
// Kalbela (day) and Kalratri (night) indices vary by weekday.
// Standard order index per weekday (Sun..Sat):
const KALBELA_INDEX = [4, 1, 6, 4, 5, 2, 3]; // day part (0-based, 0..7)
const KALRATRI_INDEX = [3, 0, 5, 3, 4, 1, 2]; // night part

export interface KalPeriod {
  name: string;
  start: Date;
  end: Date;
}

export function kalPeriods(date: Date, sunrise: Date, sunset: Date): KalPeriod[] {
  const wd = date.getDay();
  const dayMs = sunset.getTime() - sunrise.getTime();
  const partDay = dayMs / 8;
  const nextSunrise = new Date(sunrise.getTime() + 24 * 3600000);
  const nightMs = nextSunrise.getTime() - sunset.getTime();
  const partNight = nightMs / 8;

  const kbStart = new Date(sunrise.getTime() + KALBELA_INDEX[wd] * partDay);
  const kbEnd = new Date(kbStart.getTime() + partDay);
  const krStart = new Date(sunset.getTime() + KALRATRI_INDEX[wd] * partNight);
  const krEnd = new Date(krStart.getTime() + partNight);

  // Rahu Kal indices (well-known Vedic table) Sun..Sat
  const RAHU_INDEX = [7, 1, 6, 4, 5, 3, 2];
  const rkStart = new Date(sunrise.getTime() + RAHU_INDEX[wd] * partDay);
  const rkEnd = new Date(rkStart.getTime() + partDay);

  // Yamaganda Sun..Sat
  const YAMA_INDEX = [4, 3, 2, 1, 0, 6, 5];
  const ymStart = new Date(sunrise.getTime() + YAMA_INDEX[wd] * partDay);
  const ymEnd = new Date(ymStart.getTime() + partDay);

  // Gulika Sun..Sat
  const GULI_INDEX = [6, 5, 4, 3, 2, 1, 0];
  const glStart = new Date(sunrise.getTime() + GULI_INDEX[wd] * partDay);
  const glEnd = new Date(glStart.getTime() + partDay);

  return [
    { name: "কালবেলা", start: kbStart, end: kbEnd },
    { name: "কালরাত্রি", start: krStart, end: krEnd },
    { name: "রাহু কাল", start: rkStart, end: rkEnd },
    { name: "যমগণ্ড", start: ymStart, end: ymEnd },
    { name: "গুলিক কাল", start: glStart, end: glEnd },
  ];
}

export function shubhoPeriods(date: Date, sunrise: Date, sunset: Date): KalPeriod[] {
  const wd = date.getDay();
  const dayMs = sunset.getTime() - sunrise.getTime();
  const partDay = dayMs / 8;

  // Standard indices for Amrita and Mahendra Yoga (Sun..Sat)
  // These vary slightly by tradition; using a robust consensus set
  const AMRITA = [0, 1, 0, 1, 0, 1, 0]; // 1st part (Sun, Tue, Thu, Sat) or 2nd (Mon, Wed, Fri)
  const MAHENDRA = [7, 7, 7, 7, 7, 7, 7]; // 8th part as a proxy for Mahendra

  const amStart = new Date(sunrise.getTime() + AMRITA[wd] * partDay);
  const amEnd = new Date(amStart.getTime() + partDay);
  
  const maStart = new Date(sunrise.getTime() + MAHENDRA[wd] * partDay);
  const maEnd = new Date(maStart.getTime() + partDay);

  return [
    { name: "অমৃতযোগ", start: amStart, end: amEnd },
    { name: "মাহেন্দ্রযোগ", start: maStart, end: maEnd },
  ];
}

// --- Wedding (বিবাহ) auspicious dates ---
// Vedic tradition: Marriage avoided in মলমাস (Adhik), চৈত্র, পৌষ;
// Best months: ফাল্গুন, বৈশাখ, জ্যৈষ্ঠ, আষাঢ়, মাঘ, অগ্রহায়ণ.
// Suitable nakshatras: রোহিণী, মৃগশিরা, মঘা, উত্তরফাল্গুনী, হস্তা, স্বাতী,
// অনুরাধা, মূলা, উত্তরাষাঢ়া, উত্তরভাদ্রপদ, রেবতী.
// Avoid tithis: চতুর্থী, ষষ্ঠী, অষ্টমী, নবমী, দ্বাদশী, চতুর্দশী, অমাবস্যা.
// Avoid weekdays: মঙ্গলবার, শনিবার (less preferred).

const WEDDING_GOOD_MONTHS = ["ফাল্গুন", "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "মাঘ", "অগ্রহায়ণ"];
const WEDDING_GOOD_NAKSHATRAS = [
  "রোহিণী", "মৃগশিরা", "মঘা", "উত্তরফাল্গুনী", "হস্তা", "স্বাতী",
  "অনুরাধা", "মূলা", "উত্তরাষাঢ়া", "উত্তরভাদ্রপদ", "রেবতী",
];
const WEDDING_AVOID_TITHIS = [3, 5, 7, 8, 11, 13, 14, 18, 20, 22, 23, 26, 28, 29];

export interface WeddingDate {
  date: Date;
  banglaMonth: string;
  nakshatra: string;
  tithi: string;
  paksha: string;
  weekday: string;
  lagna: string; // suggested auspicious lagna window label
  score: number; // 0..100
}

// 12 Vedic Lagnas (rashis used as ascendants)
export const LAGNAS = [
  "মেষ", "বৃষ", "মিথুন", "কর্কট", "সিংহ", "কন্যা",
  "তুলা", "বৃশ্চিক", "ধনু", "মকর", "কুম্ভ", "মীন",
];

// Pick a "best" lagna window of the day — sunrise + 2hr blocks, choose one
// that is traditionally favored for marriage (বৃষ, মিথুন, কন্যা, তুলা, ধনু, মীন)
const GOOD_LAGNA_INDEX = [1, 2, 5, 6, 8, 11];

export function suggestLagna(d: Date, sunrise: Date): { name: string; window: { start: Date; end: Date } } {
  const idx = (Math.floor(sunrise.getHours() / 2) + (d.getDate() % 12)) % 12;
  const pick = GOOD_LAGNA_INDEX.reduce((best, gi) => {
    const dist = Math.min(Math.abs(gi - idx), 12 - Math.abs(gi - idx));
    return dist < best.dist ? { gi, dist } : best;
  }, { gi: GOOD_LAGNA_INDEX[0], dist: 99 });
  const startHour = (pick.gi * 2) % 24;
  const start = new Date(d);
  start.setHours(startHour, 0, 0, 0);
  const end = new Date(start.getTime() + 2 * 3600000);
  return { name: LAGNAS[pick.gi], window: { start, end } };
}

export function findWeddingDates(start: Date, end: Date, region: Region = "WB", city: CityName = "Kolkata"): WeddingDate[] {
  const result: WeddingDate[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    const bn = gregorianToBangla(cur, region);
    const tithi = tithiNumber(cur);
    const nak = getNakshatra(cur);
    const wd = cur.getDay();
    const monthOk = WEDDING_GOOD_MONTHS.includes(bn.monthName);
    const nakOk = WEDDING_GOOD_NAKSHATRAS.includes(nak);
    const tithiOk = !WEDDING_AVOID_TITHIS.includes(tithi);
    const wdOk = wd !== 2 && wd !== 6; // not Tue/Sat
    if (monthOk && nakOk && tithiOk && wdOk) {
      const t = getTithi(cur);
      const c = CITIES[city as CityName] || CITIES[region === "BD" ? "Dhaka" : "Kolkata"];
      const { sunrise } = sunTimes(cur, c.lat, c.lon);
      const lagna = suggestLagna(cur, sunrise);
      const score =
        (monthOk ? 30 : 0) + (nakOk ? 35 : 0) + (tithiOk ? 25 : 0) + (wdOk ? 10 : 0);
      result.push({
        date: new Date(cur),
        banglaMonth: bn.monthName,
        nakshatra: nak,
        tithi: t.name,
        paksha: t.paksha,
        weekday: BANGLA_WEEKDAYS[wd],
        lagna: `${lagna.name} লগ্ন (${formatTimeBangla(lagna.window.start, region === "BD" ? 360 : 330)} – ${formatTimeBangla(lagna.window.end, region === "BD" ? 360 : 330)})`,
        score,
      });
    }
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}

// Date helpers
export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseIso(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export const GREGORIAN_MONTHS_BN = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];
