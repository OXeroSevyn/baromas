import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, Search, Sparkles, Star, ScrollText, Music, ChevronRight, Share2 } from "lucide-react";
import { MANTRAS, MantraItem } from "@/data/mantras";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toBanglaNum } from "@/lib/bangla-calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/calendar/IconButton";

import { createPortal } from "react-dom";

const Mantras = () => {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "mantra" | "panchali">("all");
  const [selectedMantra, setSelectedMantra] = useState<MantraItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return MANTRAS.filter(m => {
      const matchQuery = m.name.toLowerCase().includes(query.toLowerCase()) || 
                         m.god.toLowerCase().includes(query.toLowerCase());
      const matchType = filterType === "all" || m.type === filterType;
      return matchQuery && matchType;
    });
  }, [query, filterType]);

  const handleOpenMantra = (mantra: MantraItem) => {
    setSelectedMantra(mantra);
    setIsModalOpen(true);
  };

  const handleDownload = (mantra: MantraItem) => {
    const originalTitle = document.title;
    document.title = `${mantra.name} - বারোমাস`;
    setSelectedMantra(mantra);
    
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 100);
  };

  return (
    <PageShell>
      <div className="container py-12 animate-fade-in-up space-y-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between border-b border-primary/5 pb-12">
           <div className="space-y-3">
              <div className="flex items-center gap-2">
                 <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest px-3 py-1 uppercase">আধ্যাত্মিক ডিরেক্টরি</Badge>
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-black text-accent tracking-tighter leading-[1.1] py-2">
                মন্ত্র ও <span className="text-primary/30">পাঁচালী</span>
              </h1>
              <p className="max-w-2xl text-sm font-medium text-muted-foreground leading-relaxed">
                নিত্য প্রয়োজনীয় পূজা মন্ত্র, ব্রতকথা ও পাঁচালীর একটি সংগ্রহশালা। আধ্যাত্মিক শান্তির এক ডিজিটাল ঠিকানা।
              </p>
           </div>

           <div className="flex flex-wrap gap-3">
              {(["all", "mantra", "panchali"] as const).map((t) => (
                <button 
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={cn(
                    "rounded-[20px] px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                    filterType === t 
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                      : "bg-card/40 backdrop-blur-md border border-primary/5 text-accent hover:bg-primary/10"
                  )}
                >
                  {t === "all" ? "সবগুলো" : t === "mantra" ? "মন্ত্র" : "পাঁচালী"}
                </button>
              ))}
           </div>
        </div>

        <div className="relative group max-w-4xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="দেবদেবী বা মন্ত্রের নাম দিয়ে খুঁজুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-16 pl-14 pr-8 rounded-[24px] border-none bg-card/40 backdrop-blur-md text-sm font-bold shadow-xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <Card 
              key={m.id} 
              onClick={() => handleOpenMantra(m)}
              className="group cursor-pointer relative overflow-hidden rounded-[40px] border border-primary/5 bg-card/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 p-8 flex flex-col justify-between min-h-[300px]"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                 {m.type === "mantra" ? <Music className="h-32 w-32" /> : <BookOpen className="h-32 w-32" />}
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    {m.type === "mantra" ? <Music className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
                  </div>
                  <Badge className="bg-primary/5 text-primary border-none text-[9px] font-black uppercase tracking-widest px-3 py-1">
                    {m.type === "mantra" ? "মন্ত্র" : "পাঁচালী"}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-black text-accent tracking-tighter group-hover:text-primary transition-colors py-1">{m.name}</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2 opacity-80">{m.description}</p>
                </div>
              </div>
              
              <div className="relative z-10 flex items-center justify-between pt-6 mt-8 border-t border-primary/5">
                <div className="flex items-center gap-2">
                   <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                      <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-accent/60">{m.god}</span>
                </div>
                <div className="flex items-center gap-2 text-primary opacity-40 group-hover:opacity-100 transition-opacity">
                   <span className="text-[10px] font-black uppercase tracking-widest">পড়ুন</span>
                   <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* High-Fidelity Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-card/95 backdrop-blur-3xl print:hidden">
            {selectedMantra && (
              <div className="flex flex-col h-[85vh] md:h-auto max-h-[90vh]">
                <div className="relative h-48 bg-gradient-to-br from-primary via-primary/80 to-accent/90 flex items-end px-10 pb-8 shrink-0 overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 scale-150">
                     <ScrollText className="h-48 w-48 text-white" />
                  </div>
                  <div className="relative z-10 flex items-end justify-between w-full gap-8">
                    <div className="space-y-2">
                       <Badge className="bg-white/20 text-white border-none uppercase text-[10px] font-black tracking-[0.2em] px-4 py-1">
                          {selectedMantra.type === "mantra" ? "প্রণাম মন্ত্র" : "ব্রতকথা ও পাঁচালী"}
                       </Badge>
                       <DialogTitle className="font-display text-4xl md:text-5xl font-black text-white tracking-tighter py-1 leading-[1.1]">
                         {selectedMantra.name}
                       </DialogTitle>
                    </div>
                    <div className="hidden md:flex flex-col items-center gap-1 p-4 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10">
                       <Star className="h-6 w-6 text-orange-400 fill-orange-400" />
                       <span className="text-[9px] font-black text-white uppercase tracking-widest">{selectedMantra.god}</span>
                    </div>
                  </div>
                </div>

                <div className="p-10 overflow-y-auto flex-1 custom-scrollbar space-y-10">
                  <div className={cn(
                    "text-2xl md:text-3xl leading-[1.8] whitespace-pre-wrap font-display font-black text-accent tracking-tight max-w-2xl mx-auto",
                    selectedMantra.type === "panchali" ? "text-left" : "text-center"
                  )}>
                    {selectedMantra.content}
                  </div>

                  {selectedMantra.description && (
                    <Card className="p-8 rounded-[32px] border-none bg-primary/5 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000">
                          <Sparkles className="h-24 w-24 text-primary" />
                       </div>
                       <div className="relative z-10 flex items-start gap-6">
                          <div className="p-4 bg-primary/10 rounded-2xl shrink-0">
                             <ScrollText className="h-6 w-6 text-primary" />
                          </div>
                          <div className="space-y-3">
                             <h4 className="font-display text-lg font-black text-accent tracking-tight">মাহাত্ম্য ও নিয়ম</h4>
                             <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                               {selectedMantra.description}
                             </p>
                          </div>
                       </div>
                    </Card>
                  )}
                </div>

                <div className="p-8 border-t border-primary/5 bg-white/5 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                         <Share2 className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 italic">সূত্র: ঐতিহ্যবাহী পুথি ও পাঁচালী সংগ্রহ</p>
                   </div>
                   <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => handleDownload(selectedMantra)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-105 transition-all active:scale-95"
                      >
                        <Download className="h-4 w-4" /> PDF ডাউনলোড
                      </button>
                   </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 bg-card/20 rounded-[40px] border border-dashed border-primary/10">
             <BookOpen className="h-16 w-16 text-primary/20 mb-6" />
             <h3 className="text-xl font-black text-accent mb-2">কোনো মন্ত্র পাওয়া যায়নি</h3>
             <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">অনুগ্রহ করে ভিন্ন কিছু খুঁজুন</p>
          </div>
        )}
      </div>

      {/* Specialized Print Template */}
      {selectedMantra && createPortal(
        <div id="print-mantra" className="hidden print:block bg-white text-black">
           <div className="p-16 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-16 border-b-4 border-black pb-8">
                 <div className="flex items-center gap-4">
                    <img src="/branding/logo-color.png" alt="Logo" className="h-12 w-12" />
                    <div>
                      <h1 className="text-2xl font-black">বারোমাস</h1>
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">সংস্কৃতি ও ঐতিহ্যের ডিজিটাল সংগ্রহশালা</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-sm font-black">{toBanglaNum(new Date().toLocaleDateString('bn-BD'))}</div>
                    <div className="text-[10px] font-bold">www.baromas.app</div>
                 </div>
              </div>

              <div className="mb-12 text-center space-y-2">
                 <h2 className="text-5xl font-black tracking-tighter mb-4">{selectedMantra.name}</h2>
                 <div className="inline-block px-6 py-2 border-2 border-black rounded-full text-xs font-black uppercase tracking-widest">
                    {selectedMantra.god} প্রণাম
                 </div>
              </div>

              <div className={cn(
                "text-2xl md:text-3xl leading-[2] whitespace-pre-wrap font-display font-black text-black/90",
                selectedMantra.type === "panchali" ? "text-left" : "text-center"
              )}>
                {selectedMantra.content}
              </div>

              {selectedMantra.description && (
                <div className="mt-20 pt-10 border-t-2 border-black/10 italic text-base leading-relaxed text-black/70">
                  <h4 className="font-black text-black not-italic mb-4 uppercase tracking-widest text-xs">মাহাত্ম্য ও নিয়ম</h4>
                  {selectedMantra.description}
                </div>
              )}

              <div className="mt-32 text-center border-t-2 border-black/10 pt-8 space-y-2">
                 <p className="text-xs font-black uppercase tracking-widest">বারোমাস ডিরেক্টরি থেকে সংগৃহীত</p>
                 <p className="text-[10px] opacity-60">"বাংলার সময়, সংস্কৃতি আর উৎসবের ডিজিটাল ঠিকানা"</p>
              </div>
           </div>
        </div>,
        document.body
      )}
    </PageShell>
  );
};

export default Mantras;
