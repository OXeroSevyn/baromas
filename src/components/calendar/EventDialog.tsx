import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEvents, type CalendarEvent } from "@/hooks/use-events";
import { isoDate } from "@/lib/bangla-calendar";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  defaultDate?: Date;
  editing?: CalendarEvent | null;
}

const CATEGORIES: { value: CalendarEvent["category"]; label: string }[] = [
  { value: "personal", label: "ব্যক্তিগত" },
  { value: "birthday", label: "জন্মদিন" },
  { value: "anniversary", label: "বিবাহবার্ষিকী" },
  { value: "work", label: "কাজ" },
  { value: "festival", label: "উৎসব" },
  { value: "other", label: "অন্যান্য" },
];

const RECURRING: { value: CalendarEvent["recurring"]; label: string }[] = [
  { value: "none", label: "একবার" },
  { value: "yearly", label: "বার্ষিক" },
  { value: "monthly", label: "মাসিক" },
  { value: "weekly", label: "সাপ্তাহিক" },
];

export function EventDialog({ open, onOpenChange, defaultDate, editing }: Props) {
  const { add, update } = useEvents();
  const [title, setTitle] = useState(editing?.title ?? "");
  const [date, setDate] = useState(editing?.date ?? (defaultDate ? isoDate(defaultDate) : isoDate(new Date())));
  const [notes, setNotes] = useState(editing?.notes ?? "");
  const [category, setCategory] = useState<CalendarEvent["category"]>(editing?.category ?? "personal");
  const [recurring, setRecurring] = useState<CalendarEvent["recurring"]>(editing?.recurring ?? "none");

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("শিরোনাম দিন");
      return;
    }
    if (editing) {
      update(editing.id, { title, date, notes, category, recurring });
      toast.success("ইভেন্ট আপডেট হয়েছে");
    } else {
      add({ title, date, notes, category, recurring });
      toast.success("ইভেন্ট যুক্ত হয়েছে");
      // Try to enable browser notifications on first creation
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-accent">
            {editing ? "ইভেন্ট সম্পাদনা" : "নতুন ইভেন্ট যোগ করুন"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>শিরোনাম</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="যেমন: মায়ের জন্মদিন" />
          </div>
          <div>
            <Label>তারিখ</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>বিভাগ</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as CalendarEvent["category"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>পুনরাবৃত্তি</Label>
              <Select value={recurring} onValueChange={(v) => setRecurring(v as CalendarEvent["recurring"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RECURRING.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>নোট</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>বাতিল</Button>
          <Button onClick={handleSave}>সংরক্ষণ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
