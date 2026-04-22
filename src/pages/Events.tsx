import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Download, Search } from "lucide-react";
import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/calendar/IconButton";
import { EventDialog } from "@/components/calendar/EventDialog";
import { useEvents, exportToICS, type CalendarEvent } from "@/hooks/use-events";
import { useSettings } from "@/hooks/use-settings";
import { GREGORIAN_MONTHS_BN, gregorianToBangla, parseIso, toBanglaNum } from "@/lib/bangla-calendar";
import { toast } from "sonner";

const Events = () => {
  const { events, remove } = useEvents();
  const [settings] = useSettings();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return [...events]
      .filter((e) => !query || e.title.includes(query) || (e.notes ?? "").includes(query))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events, query]);

  const handleExport = () => {
    if (events.length === 0) {
      toast.error("কোনো ইভেন্ট নেই");
      return;
    }
    const blob = new Blob([exportToICS(events)], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bangla-panjika-events.ics";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("ICS ফাইল ডাউনলোড শুরু");
  };

  return (
    <PageShell>
      <section className="container py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-bold text-accent">আমার ইভেন্ট</h1>
          <div className="flex gap-2">
            <Button onClick={handleExport}><Download className="h-4 w-4" /> ICS এক্সপোর্ট</Button>
            <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> নতুন ইভেন্ট
            </Button>
          </div>
        </div>

        <div className="relative mt-4 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ইভেন্ট খুঁজুন..." className="pl-9" />
        </div>

        {filtered.length === 0 ? (
          <Card className="mt-6 p-8 text-center text-muted-foreground">
            কোনো ইভেন্ট নেই — উপরের বোতাম দিয়ে নতুন ইভেন্ট যোগ করুন
          </Card>
        ) : (
          <div className="mt-6 grid gap-2">
            {filtered.map((e) => {
              const d = parseIso(e.date);
              const bn = gregorianToBangla(d, settings.region);
              return (
                <Card key={e.id} className="flex flex-wrap items-center justify-between gap-3 p-4 shadow-soft">
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-accent">{e.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {toBanglaNum(d.getDate())} {GREGORIAN_MONTHS_BN[d.getMonth()]} {toBanglaNum(d.getFullYear())} · {toBanglaNum(bn.day)} {bn.monthName}
                    </div>
                    {e.notes && <p className="mt-1 text-sm">{e.notes}</p>}
                    <div className="mt-1 flex flex-wrap gap-1">
                      <Badge variant="secondary">{categoryLabel(e.category)}</Badge>
                      {e.recurring !== "none" && <Badge variant="secondary">{recurringLabel(e.recurring)}</Badge>}
                      {e.category === "birthday" && (
                        <Badge variant="outline" className="text-primary border-primary/40">
                          বয়স: {toBanglaNum(new Date().getFullYear() - d.getFullYear())} বছর
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button onClick={() => { setEditing(e); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button onClick={() => { remove(e.id); toast.success("মুছে ফেলা হয়েছে"); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <EventDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} />
    </PageShell>
  );
};

function categoryLabel(c: CalendarEvent["category"]): string {
  const map: Record<string, string> = {
    personal: "ব্যক্তিগত", birthday: "জন্মদিন", anniversary: "বিবাহবার্ষিকী",
    work: "কাজ", festival: "উৎসব", other: "অন্যান্য",
  };
  return map[c] ?? c;
}
function recurringLabel(r: CalendarEvent["recurring"]): string {
  const map: Record<string, string> = { yearly: "বার্ষিক", monthly: "মাসিক", weekly: "সাপ্তাহিক", none: "" };
  return map[r] ?? "";
}

export default Events;
