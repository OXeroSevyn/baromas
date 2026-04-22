// Famous Bengali / Indian birthdays, deaths and major historical events keyed by "MM-DD"
export interface HistoricalEvent {
  year: number;
  text: string;
  category?: "birth" | "death" | "freedom" | "history" | "culture";
}

export const HISTORICAL: Record<string, HistoricalEvent[]> = {
  // January
  "01-09": [{ year: 1915, text: "মহাত্মা গান্ধী দক্ষিণ আফ্রিকা থেকে ভারতে প্রত্যাবর্তন করেন।", category: "freedom" }],
  "01-12": [{ year: 1863, text: "স্বামী বিবেকানন্দের জন্ম।", category: "birth" }],
  "01-23": [
    { year: 1897, text: "নেতাজি সুভাষচন্দ্র বসুর জন্ম।", category: "birth" },
  ],
  "01-26": [{ year: 1950, text: "ভারতের সংবিধান কার্যকর — প্রজাতন্ত্র দিবস।", category: "history" }],
  "01-28": [{ year: 1865, text: "লালা লাজপত রায়ের জন্ম।", category: "birth" }],
  "01-30": [{ year: 1948, text: "মহাত্মা গান্ধীর হত্যা — শহীদ দিবস।", category: "death" }],
  "01-31": [{ year: 1893, text: "চিত্তরঞ্জন দাশ প্রভাবিত যুগ — দেশবন্ধু পরিচিতি।", category: "history" }],

  // February
  "02-05": [{ year: 1916, text: "জগদীশচন্দ্র বসুর প্রবর্তিত বসু বিজ্ঞান মন্দির প্রতিষ্ঠা।", category: "culture" }],
  "02-17": [{ year: 1899, text: "জীবনানন্দ দাশের জন্ম।", category: "birth" }],
  "02-18": [{ year: 1836, text: "শ্রী রামকৃষ্ণ পরমহংসের জন্ম।", category: "birth" }],
  "02-21": [{ year: 1952, text: "ভাষা আন্দোলনে শহীদ — আন্তর্জাতিক মাতৃভাষা দিবস।", category: "history" }],
  "02-27": [{ year: 1931, text: "চন্দ্রশেখর আজাদের আত্মবলিদান — এলাহাবাদ।", category: "death" }],

  // March
  "03-23": [
    { year: 1910, text: "রামমনোহর লোহিয়ার জন্ম।", category: "birth" },
    { year: 1931, text: "ভগৎ সিং, রাজগুরু ও সুখদেবের ফাঁসি — শহীদ দিবস।", category: "death" },
  ],
  "03-26": [{ year: 1971, text: "বাংলাদেশের স্বাধীনতা ঘোষণা।", category: "history" }],

  // April
  "04-13": [{ year: 1919, text: "জালিয়ানওয়ালাবাগ হত্যাকাণ্ড — অমৃতসর।", category: "history" }],
  "04-14": [
    { year: 1891, text: "ভারতরত্ন ড. ভীমরাও আম্বেদকরের জন্ম।", category: "birth" },
  ],

  // May
  "05-07": [{ year: 1861, text: "রবীন্দ্রনাথ ঠাকুরের জন্ম।", category: "birth" }],
  "05-09": [{ year: 1866, text: "গোপাল কৃষ্ণ গোখলের জন্ম।", category: "birth" }],
  "05-10": [{ year: 1857, text: "প্রথম স্বাধীনতা সংগ্রাম — সিপাহি বিদ্রোহ শুরু।", category: "history" }],
  "05-25": [{ year: 1899, text: "কাজী নজরুল ইসলামের জন্ম।", category: "birth" }],

  // June
  "06-23": [{ year: 1953, text: "ডা. শ্যামাপ্রসাদ মুখোপাধ্যায়ের প্রয়াণ।", category: "death" }],
  "06-29": [{ year: 1864, text: "আশুতোষ মুখোপাধ্যায়ের জন্ম।", category: "birth" }],

  // July
  "07-08": [{ year: 1914, text: "বিপ্লবী যতীন্দ্রনাথ মুখোপাধ্যায় (বাঘা যতীন) — সক্রিয় বিপ্লবী যুগ।", category: "freedom" }],
  "07-23": [
    { year: 1856, text: "বাল গঙ্গাধর তিলকের জন্ম।", category: "birth" },
    { year: 1906, text: "চন্দ্রশেখর আজাদের জন্ম।", category: "birth" },
  ],
  "07-26": [{ year: 1894, text: "আচার্য প্রফুল্ল চন্দ্র রায়ের কর্মময় দিন।", category: "culture" }],
  "07-31": [{ year: 1940, text: "শহীদ উধম সিং — মাইকেল ও'ডায়ার হত্যার শাস্তি।", category: "death" }],

  // August
  "08-07": [{ year: 1941, text: "রবীন্দ্রনাথ ঠাকুরের প্রয়াণ।", category: "death" }],
  "08-08": [{ year: 1942, text: "ভারত ছাড়ো আন্দোলনের সূচনা — মহাত্মা গান্ধী।", category: "history" }],
  "08-15": [{ year: 1947, text: "ভারতের স্বাধীনতা।", category: "history" }],
  "08-18": [{ year: 1945, text: "নেতাজি সুভাষচন্দ্র বসুর রহস্যজনক অন্তর্ধান (তাইহোকু)।", category: "death" }],
  "08-20": [{ year: 1944, text: "রাজীব গান্ধীর জন্ম।", category: "birth" }],
  "08-29": [{ year: 1976, text: "কাজী নজরুল ইসলামের প্রয়াণ।", category: "death" }],

  // September
  "09-05": [{ year: 1888, text: "ড. সর্বপল্লী রাধাকৃষ্ণনের জন্ম — শিক্ষক দিবস।", category: "birth" }],
  "09-07": [{ year: 1934, text: "সুনীল গঙ্গোপাধ্যায়ের জন্ম।", category: "birth" }],
  "09-11": [{ year: 1893, text: "স্বামী বিবেকানন্দের শিকাগো ভাষণ।", category: "history" }],
  "09-27": [{ year: 1907, text: "ভগৎ সিংয়ের জন্ম।", category: "birth" }],

  // October
  "10-02": [
    { year: 1869, text: "মহাত্মা গান্ধীর জন্ম — গান্ধী জয়ন্তী।", category: "birth" },
    { year: 1904, text: "লাল বাহাদুর শাস্ত্রীর জন্ম।", category: "birth" },
  ],
  "10-15": [{ year: 1931, text: "ড. এ.পি.জে. আবদুল কালামের জন্ম।", category: "birth" }],
  "10-22": [{ year: 1954, text: "জীবনানন্দ দাশের প্রয়াণ।", category: "death" }],
  "10-31": [
    { year: 1875, text: "সর্দার বল্লভভাই প্যাটেলের জন্ম — একতা দিবস।", category: "birth" },
    { year: 1984, text: "প্রধানমন্ত্রী ইন্দিরা গান্ধীর হত্যাকাণ্ড।", category: "death" },
  ],

  // November
  "11-07": [{ year: 1888, text: "স্যার সি.ভি. রমনের জন্ম।", category: "birth" }],
  "11-11": [{ year: 1888, text: "মৌলানা আবুল কালাম আজাদের জন্ম — জাতীয় শিক্ষা দিবস।", category: "birth" }],
  "11-14": [{ year: 1889, text: "পন্ডিত জওহরলাল নেহরুর জন্ম — শিশু দিবস।", category: "birth" }],
  "11-19": [{ year: 1917, text: "ইন্দিরা গান্ধীর জন্ম।", category: "birth" }],
  "11-26": [{ year: 1949, text: "ভারতের সংবিধান গৃহীত — সংবিধান দিবস।", category: "history" }],

  // December
  "12-06": [{ year: 1956, text: "ড. বি.আর. আম্বেদকরের প্রয়াণ — মহাপরিনির্বাণ দিবস।", category: "death" }],
  "12-09": [{ year: 1946, text: "ভারতের সংবিধান সভার প্রথম অধিবেশন।", category: "history" }],
  "12-16": [{ year: 1971, text: "মুক্তিযুদ্ধে বিজয় — বাংলাদেশ; ভারতের বিজয় দিবস।", category: "history" }],
  "12-25": [{ year: 1861, text: "মদনমোহন মালব্যের জন্ম।", category: "birth" }],
};

export function eventsOnDate(d: Date): HistoricalEvent[] {
  const key = `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return HISTORICAL[key] || [];
}
