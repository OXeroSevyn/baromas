import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";

const About = () => {
  return (
    <PageShell>
      <section className="container py-8">
        <h1 className="font-display text-3xl font-bold text-accent">পরিচয়</h1>
        <Card className="mt-4 p-6 shadow-soft">
          <p className="text-base leading-relaxed">
            <span className="font-decorative text-xl text-primary">বারোমাস</span> — একটি সম্পূর্ণ
            বাংলা ভাষার ক্যালেন্ডার অ্যাপ্লিকেশন। তিথি, নক্ষত্র, পক্ষ, ঋতু, উৎসব ও
            ব্যক্তিগত ইভেন্ট — সবকিছু এক জায়গায়।
          </p>
          <p className="mt-3 text-base leading-relaxed">
            এটি বাংলাদেশ ও পশ্চিমবঙ্গ — উভয় অঞ্চলের ঐতিহ্য মান্য করে। পহেলা বৈশাখ
            পশ্চিমবঙ্গ পঞ্জিকা অনুযায়ী ১৪ বা ১৫ এপ্রিল হয়, এবং বাংলাদেশের ক্ষেত্রে
            ১৪ এপ্রিল নির্দিষ্ট। সেটিংস থেকে আপনার অঞ্চল বেছে নিন।
          </p>
          <p className="mt-3 text-base leading-relaxed">
            উৎসব তালিকায় সাংস্কৃতিক, সাহিত্যিক ও জাতীয় ছুটির দিন অন্তর্ভুক্ত।
            ব্যক্তিগত ইভেন্টগুলো শুধুমাত্র আপনার ব্রাউজারে স্থানীয়ভাবে সংরক্ষিত —
            কোনো সার্ভারে পাঠানো হয় না।
          </p>
          <div className="mt-6 pt-4 border-t border-border/50">
            <p className="text-accent font-bold">
              তৈরি করেছেন: <span className="text-primary text-lg">শুভম দে</span>
            </p>
          </div>
        </Card>

        <Card className="mt-4 p-6 shadow-soft">
          <h2 className="font-display text-xl font-bold text-accent">বৈশিষ্ট্যসমূহ</h2>
          <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
            {FEATURES.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary">✦</span> {f}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </PageShell>
  );
};

const FEATURES = [
  "মাসিক ক্যালেন্ডার গ্রিড", "বার্ষিক ভিউ", "দৈনিক বিস্তারিত পাতা", "মিনি ক্যালেন্ডার",
  "বাংলা তারিখ ও মাস", "তিথি ও পক্ষ গণনা", "নক্ষত্র", "ঋতু ব্যানার",
  "মাসের অর্থ ও বিবরণ", "সূর্যোদয়/সূর্যাস্ত (কলকাতা/ঢাকা)", "দিনমান গণনা",
  "শুভ মুহূর্ত (ব্রাহ্ম)", "পহেলা বৈশাখ", "একুশে ফেব্রুয়ারি", "স্বাধীনতা দিবস",
  "বিজয় দিবস", "রবীন্দ্র জয়ন্তী", "নজরুল জয়ন্তী", "দুর্গা পূজা", "কালী পূজা",
  "লক্ষ্মী পূজা", "সরস্বতী পূজা", "পৌষ পার্বণ", "ঈদ-উল-ফিতর/আযহা (জাতীয় ছুটি)",
  "বড়দিন", "ব্যক্তিগত ইভেন্ট যোগ", "সম্পাদনা ও মুছে ফেলা",
  "পুনরাবৃত্তি ইভেন্ট (বার্ষিক/মাসিক/সাপ্তাহিক)", "জন্মদিন ট্র্যাকার",
  "বিবাহবার্ষিকী", "ইভেন্ট বিভাগ", "ইভেন্ট অনুসন্ধান", "ICS এক্সপোর্ট",
  "ব্রাউজার নোটিফিকেশন অনুমতি", "দৈনিক উদ্ধৃতি", "প্রবাদ", "ইতিহাসে আজকের দিন",
  "ঋতুর রন্ধন", "দিনের গান", "জানেন কি? তথ্য", "উৎসব কাউন্টডাউন",
  "ইংরেজি ↔ বাংলা তারিখ রূপান্তরকারী", "বয়স গণনা (বঙ্গাব্দ ও খ্রিস্টাব্দ)",
  "তারিখ ব্যবধান", "প্রিন্ট/PDF মাস", "শেয়ার লিংক", "কীবোর্ড শর্টকাট",
  "লাইট/ডার্ক/উৎসব থিম", "ফন্ট সাইজ নিয়ন্ত্রণ", "অঞ্চল টগল (BD/WB)",
  "সপ্তাহ শুরুর দিন", "শহর নির্বাচন", "স্থানীয় সংরক্ষণ",
];

export default About;
