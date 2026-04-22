import { useEffect, useMemo, useState } from "react";

const LOADING_MESSAGES = [
  "শুভ দিনের অপেক্ষায়...",
  "আজকের পঞ্জিকা সাজছে...",
  "বাংলার সময় আসছে...",
  "দিনের শুরু বাংলার সাথে...",
  "আজকের দিন প্রস্তুত হচ্ছে...",
  "নতুন দিনের পাতায় স্বাগতম...",
  "সময়ের পাতায় বাংলার ছোঁয়া...",
  "আজকের শুভক্ষণ আসছে...",
  "বাংলা তারিখ লোড হচ্ছে...",
  "প্রতিটি দিনে বাংলার রং...",
  "একটু অপেক্ষা করুন, দিন আসছে...",
  "আপনার বাংলা ক্যালেন্ডার প্রস্তুত হচ্ছে...",
  "আজকের তিথি ও তারিখ আসছে...",
  "সময়কে বাংলায় দেখুন...",
  "নতুন সকাল, নতুন পঞ্জিকা...",
  "শুভ সময় শুরু হোক...",
  "ঋতুর ছন্দে দিনপঞ্জি আসছে...",
  "বাংলা দিনের সাথে থাকুন...",
  "আজকের পাতা খুলছে...",
  "বাংলার দিনে, বাংলার মনে...",
];

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const message = useMemo(
    () => LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)],
    []
  );
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setLeaving(true), 2500);
    const t2 = window.setTimeout(() => onDone(), 2900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-cream transition-opacity duration-500 pb-32 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="relative mb-0 h-96 w-96">
        <img 
          src="/branding/logo-bright.png" 
          alt="বারোমাস" 
          className="h-full w-full object-contain animate-pulse"
        />
      </div>

      <div 
        className="font-display text-2xl font-normal text-accent md:text-2xl text-center px-6 animate-fade-in -mt-24 relative z-10"
        style={{ fontFamily: "'Tiro Bangla', serif" }}
      >
        {message}
      </div>

      <div className="mt-6 flex gap-2">
        <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-festive [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-accent" />
      </div>


    </div>
  );
}
