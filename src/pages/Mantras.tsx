import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, Search, Sparkles, Star, ScrollText, Music } from "lucide-react";
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

const Mantras = () => {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "mantra" | "panchali">("all");
  const [selectedMantra, setSelectedMantra] = useState<MantraItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return MANTRAS.filter(m => {
      const matchQuery = m.name.includes(query) || m.god.includes(query);
      const matchType = filterType === "all" || m.type === filterType;
      return matchQuery && matchType;
    });
  }, [query, filterType]);

  const handleOpenMantra = (mantra: MantraItem) => {
    setSelectedMantra(mantra);
    setIsModalOpen(true);
  };

  const handleDownload = (mantra: MantraItem) => {
    setSelectedMantra(mantra);
    // Give state time to update the print hidden element
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <PageShell>
      <div className="container py-6 animate-fade-in mb-20 lg:mb-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="font-display text-4xl font-bold text-accent mb-2">মন্ত্র ও পাঁচালী</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ScrollText className="h-4 w-4 text-primary" />
              <span>নিত্য প্রয়োজনীয় পূজা মন্ত্র ও ব্রতকথা</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="দেবদেবী বা মন্ত্র খুঁজুন..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 rounded-2xl border-none bg-card shadow-soft font-bold text-accent"
              />
            </div>
            <div className="flex gap-2">
               <button 
                onClick={() => setFilterType("all")}
                className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all", filterType === "all" ? "bg-primary text-white" : "bg-card hover:bg-secondary")}
               >
                 সব
               </button>
               <button 
                onClick={() => setFilterType("mantra")}
                className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all", filterType === "mantra" ? "bg-primary text-white" : "bg-card hover:bg-secondary")}
               >
                 মন্ত্র
               </button>
               <button 
                onClick={() => setFilterType("panchali")}
                className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all", filterType === "panchali" ? "bg-primary text-white" : "bg-card hover:bg-secondary")}
               >
                 পাঁচালী
               </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <Card 
              key={m.id} 
              onClick={() => handleOpenMantra(m)}
              className="group cursor-pointer overflow-hidden rounded-[32px] border-none shadow-soft hover:shadow-warm hover:scale-[1.02] active:scale-[0.98] transition-all p-6 flex flex-col justify-between bg-white/80 backdrop-blur-sm"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary/5 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                    {m.type === "mantra" ? <Music className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
                  </div>
                  <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 uppercase text-[10px] font-bold">
                    {m.type === "mantra" ? "মন্ত্র" : "পাঁচালী"}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-accent mb-2 group-hover:text-primary transition-colors">{m.name}</h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{m.description}</p>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-secondary">
                <span className="text-xs font-bold text-accent/60 flex items-center gap-1">
                   <Star className="h-3 w-3 text-orange-400 fill-orange-400" /> {m.god}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(m);
                  }}
                  className="flex items-center gap-2 text-primary hover:underline text-xs font-bold"
                >
                  <Download className="h-4 w-4" /> ডাউনলোড PDF
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Full View Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-white">
            {selectedMantra && (
              <div className="flex flex-col h-[80vh] md:h-auto max-h-[90vh]">
                <div className="h-32 bg-gradient-to-br from-primary to-orange-600 flex items-end px-8 pb-6 shrink-0">
                  <div className="flex items-center justify-between w-full">
                    <div>
                       <Badge className="bg-white/20 text-white border-none mb-2 uppercase text-[10px] font-bold">
                          {selectedMantra.type === "mantra" ? "প্রণাম মন্ত্র" : "ব্রতকথা ও পাঁচালী"}
                       </Badge>
                       <DialogTitle className="text-2xl md:text-3xl font-bold text-white">{selectedMantra.name}</DialogTitle>
                    </div>
                    <div className="hidden md:block p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                       <ScrollText className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary mb-6">
                     <Star className="h-4 w-4 text-orange-400 fill-orange-400" /> {selectedMantra.god}
                  </div>
                  
                  <div className="text-xl md:text-2xl leading-relaxed whitespace-pre-wrap font-serif text-accent text-center mb-10">
                    {selectedMantra.content}
                  </div>

                  {selectedMantra.description && (
                    <div className="p-6 bg-secondary/30 rounded-3xl border-l-4 border-primary">
                      <h4 className="font-bold text-accent mb-2">মাহাত্ম্য ও নিয়ম:</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedMantra.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-secondary bg-secondary/10 flex items-center justify-between shrink-0">
                   <p className="text-[10px] text-muted-foreground italic">সূত্র: ঐতিহ্যবাহী পুথি ও পাঁচালী</p>
                   <button 
                    onClick={() => handleDownload(selectedMantra)}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                   >
                     <Download className="h-4 w-4" /> PDF ডাউনলোড করুন
                   </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-card/30 border-2 border-dashed rounded-[40px]">
             <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
             <p className="text-muted-foreground font-bold text-xl">এই বিভাগে কোনো তথ্য পাওয়া যায়নি।</p>
          </div>
        )}

        {/* Specialized Print Template (Hidden from Screen, Visible on Print) */}
        {selectedMantra && (
          <div id="print-mantra" className="hidden print:block fixed inset-0 z-[100] bg-white p-12 text-black overflow-visible">
             <div className="border-4 border-double border-primary/30 p-10 h-full relative">
                {/* Branding */}
                <div className="flex items-center justify-between mb-12 pb-8 border-b-2 border-primary/10">
                   <div className="flex items-center gap-4">
                      <img src="/branding/logo-color.png" alt="Logo" className="h-16 w-16" />
                      <div>
                         <h1 className="text-3xl font-bold text-primary">বারোমাস</h1>
                         <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">বাংলার সময় ও সংস্কৃতি</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-sm font-bold text-accent">{toBanglaNum(new Date().toLocaleDateString('bn-BD'))}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Mantra & Panchali Series</div>
                   </div>
                </div>

                {/* Content */}
                <div className="text-center mb-10">
                   <Badge className="bg-primary/10 text-primary border-none mb-4 uppercase text-xs font-bold px-4 py-1">
                      {selectedMantra.type === "mantra" ? "প্রণাম মন্ত্র" : "ব্রতকথা ও পাঁচালী"}
                   </Badge>
                   <h2 className="text-4xl font-bold text-accent">{selectedMantra.name}</h2>
                   <div className="w-24 h-1 bg-primary/20 mx-auto mt-6" />
                </div>

                <div className="max-w-2xl mx-auto">
                   <div className="text-2xl leading-relaxed whitespace-pre-wrap font-serif text-center italic text-accent/90">
                      {selectedMantra.content}
                   </div>
                   
                   {selectedMantra.description && (
                     <div className="mt-16 p-6 bg-secondary/30 rounded-2xl border-l-4 border-primary">
                        <h4 className="font-bold text-accent mb-2">মাহাত্ম্য:</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                           {selectedMantra.description}
                        </p>
                     </div>
                   )}
                </div>

                {/* Footer */}
                <div className="absolute bottom-10 left-10 right-10 pt-8 border-t border-primary/10 flex justify-between items-end">
                   <div className="text-[10px] text-muted-foreground italic">
                      © ২০২৬ বারোমাস - সর্বস্বত্ব সংরক্ষিত। <br /> 
                      ডাউনলোড করুন: baromas.app
                   </div>
                   <div className="opacity-10 h-24 w-24">
                      <img src="/branding/logo-color.png" alt="Logo" className="grayscale" />
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default Mantras;
