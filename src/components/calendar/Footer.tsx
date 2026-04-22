export function Footer() {
  return (
    <footer className="mt-8 border-t border-border bg-secondary/40 no-print">
      <div className="alpana-divider" />
      <div className="container py-4 text-center">
        <div className="flex justify-center mb-0">
          <img 
            src="/branding/logo-color.png" 
            alt="বারোমাস" 
            className="h-24 w-auto object-contain"
          />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          তিথি, নক্ষত্র, ঋতু ও উৎসবের সম্পূর্ণ বাংলা ক্যালেন্ডার ·
          সকল তথ্য স্থানীয়ভাবে সংরক্ষিত
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          © {new Date().getFullYear()} বারোমাস · ভালোবেসে তৈরি
        </p>
      </div>
    </footer>
  );
}
