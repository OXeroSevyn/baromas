import { useEffect, useState } from "react";

export interface CalendarEvent {
  id: string;
  date: string;            // ISO yyyy-mm-dd
  title: string;
  notes?: string;
  category: "personal" | "birthday" | "anniversary" | "work" | "festival" | "other";
  recurring: "none" | "yearly" | "monthly" | "weekly";
  color?: string;          // optional override (HSL)
}

const KEY = "bp:events";

function load(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(events: CalendarEvent[]) {
  localStorage.setItem(KEY, JSON.stringify(events));
}

let cache: CalendarEvent[] | null = null;
let listeners: ((e: CalendarEvent[]) => void)[] = [];

function getAll(): CalendarEvent[] {
  if (!cache) cache = load();
  return cache;
}

function emit() {
  listeners.forEach((l) => l(cache!));
}

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>(getAll);

  useEffect(() => {
    const fn = (next: CalendarEvent[]) => setEvents([...next]);
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((x) => x !== fn);
    };
  }, []);

  const add = (e: Omit<CalendarEvent, "id">) => {
    const ev: CalendarEvent = { ...e, id: crypto.randomUUID() };
    cache = [...getAll(), ev];
    save(cache);
    emit();
    return ev;
  };

  const update = (id: string, patch: Partial<CalendarEvent>) => {
    cache = getAll().map((e) => (e.id === id ? { ...e, ...patch } : e));
    save(cache);
    emit();
  };

  const remove = (id: string) => {
    cache = getAll().filter((e) => e.id !== id);
    save(cache);
    emit();
  };

  return { events, add, update, remove };
}

export function eventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const md = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const dow = date.getDay();
  return events.filter((e) => {
    if (e.date === iso) return true;
    if (e.recurring === "yearly" && e.date.slice(5) === md) return true;
    if (e.recurring === "monthly" && e.date.slice(8) === iso.slice(8)) return true;
    if (e.recurring === "weekly") {
      const orig = new Date(e.date);
      if (orig.getDay() === dow && new Date(e.date) <= date) return true;
    }
    return false;
  });
}

export function exportToICS(events: CalendarEvent[]): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T000000`;
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//BanglaPanjika//EN"];
  for (const e of events) {
    const dt = new Date(e.date);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.id}@bangla-panjika`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(dt)}`,
      `SUMMARY:${e.title}`,
      e.notes ? `DESCRIPTION:${e.notes.replace(/\n/g, "\\n")}` : "",
      e.recurring === "yearly" ? "RRULE:FREQ=YEARLY" : "",
      e.recurring === "monthly" ? "RRULE:FREQ=MONTHLY" : "",
      e.recurring === "weekly" ? "RRULE:FREQ=WEEKLY" : "",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.filter(Boolean).join("\r\n");
}
