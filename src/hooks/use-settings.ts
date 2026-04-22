import { useEffect, useState } from "react";
import { CityName, Region } from "@/lib/bangla-calendar";

export type Theme = "light" | "dark" | "festive";
export type FontSize = "sm" | "md" | "lg" | "xl";
export type StartDay = 0 | 1; // Sunday=0, Monday=1
export type Language = "bn" | "bn-en";

export interface Settings {
  theme: Theme;
  region: Region;
  fontSize: FontSize;
  startDay: StartDay;
  language: Language;
  city: CityName;
  fontFamily: "hind" | "noto" | "notoserif" | "anek" | "atma" | "galada" | "tiro" | "mina";
}

const DEFAULT: Settings = {
  theme: "light",
  region: "WB",
  fontSize: "md",
  startDay: 0,
  language: "bn",
  city: "Kolkata",
  fontFamily: "hind",
};

const KEY = "bp:settings";

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

function save(s: Settings) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

function applyToDom(s: Settings) {
  const html = document.documentElement;
  html.classList.remove("dark", "festive");
  if (s.theme === "dark") html.classList.add("dark");
  if (s.theme === "festive") html.classList.add("festive");
  html.dataset.fs = s.fontSize;
  html.dataset.font = s.fontFamily;
  html.lang = "bn";
}

let listeners: ((s: Settings) => void)[] = [];
let current: Settings | null = null;

function getCurrent(): Settings {
  if (!current) {
    current = load();
    applyToDom(current);
  }
  return current;
}

export function useSettings(): [Settings, (patch: Partial<Settings>) => void] {
  const [s, setS] = useState<Settings>(getCurrent);

  useEffect(() => {
    const fn = (next: Settings) => setS(next);
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((x) => x !== fn);
    };
  }, []);

  const update = (patch: Partial<Settings>) => {
    current = { ...getCurrent(), ...patch };
    save(current);
    applyToDom(current);
    listeners.forEach((l) => l(current!));
  };

  return [s, update];
}

// Apply once at module load (before React mounts)
if (typeof window !== "undefined") {
  applyToDom(getCurrent());
}
