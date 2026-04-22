import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BANGLA_WEEKDAYS_SHORT,
  GREGORIAN_MONTHS_BN,
  gregorianToBangla,
  isSameDay,
  isoDate,
  toBanglaNum,
  type Region,
} from "@/lib/bangla-calendar";
import { festivalsOnDate } from "@/data/festivals";
import { eventsForDate, type CalendarEvent } from "@/hooks/use-events";

interface MonthGridProps {
  year: number;
  month: number; // 0-11
  region: Region;
  startDay: 0 | 1;
  events: CalendarEvent[];
  selected?: Date;
  onSelect?: (d: Date) => void;
  compact?: boolean;
}

export function MonthGrid({
  year,
  month,
  region,
  startDay,
  events,
  selected,
  onSelect,
  compact,
}: MonthGridProps) {
  const today = new Date();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const firstWeekday = first.getDay();
  const offset = (firstWeekday - startDay + 7) % 7;
  const totalCells = Math.ceil((offset + last.getDate()) / 7) * 7;

  const headers: string[] = [];
  for (let i = 0; i < 7; i++) {
    headers.push(BANGLA_WEEKDAYS_SHORT[(i + startDay) % 7]);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-soft md:p-4">
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="font-display text-base font-semibold text-accent md:text-lg">
          {GREGORIAN_MONTHS_BN[month]} {toBanglaNum(year)}
        </h3>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground">
        {headers.map((h, i) => (
          <div
            key={i}
            className={cn("py-1.5", i === (0 - startDay + 7) % 7 && "text-festive")}
          >
            {h}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: totalCells }).map((_, i) => {
          const dayNum = i - offset + 1;
          if (dayNum < 1 || dayNum > last.getDate()) {
            return <div key={i} className="aspect-square rounded-lg bg-secondary/30" />;
          }
          const date = new Date(year, month, dayNum);
          const bn = gregorianToBangla(date, region);
          const fests = festivalsOnDate(date, region);
          const evs = eventsForDate(events, date);
          const isToday = isSameDay(date, today);
          const isSelected = selected && isSameDay(date, selected);
          const isSunday = date.getDay() === 0;

          const cell = (
            <div
              className={cn(
                "group relative flex aspect-square cursor-pointer flex-col rounded-lg border p-1 text-left transition-all hover:scale-[1.03] hover:shadow-warm",
                isToday
                  ? "border-primary bg-primary/10 shadow-gold"
                  : "border-transparent bg-background hover:border-border",
                isSelected && "ring-2 ring-primary",
                fests.length && !isToday && "border-festive/30 bg-festive/5",
              )}
              onClick={() => onSelect?.(date)}
            >
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    "font-display text-base font-bold leading-none md:text-lg",
                    isToday ? "text-primary" : isSunday ? "text-festive" : "text-foreground",
                  )}
                >
                  {toBanglaNum(dayNum)}
                </span>
                <span className="text-[10px] font-medium leading-none text-muted-foreground md:text-[12px]">
                  {toBanglaNum(bn.day)}
                </span>
              </div>
              {!compact && (
                <div className="mt-auto flex flex-wrap items-end gap-0.5">
                  {fests.slice(0, 2).map((f) => (
                    <span key={f.id} title={f.name} className="text-xs leading-none">
                      {f.emoji ?? "🎉"}
                    </span>
                  ))}
                  {evs.length > 0 && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                  )}
                </div>
              )}
            </div>
          );

          return (
            <Link
              key={i}
              to={`/day/${isoDate(date)}`}
              onClick={(e) => {
                if (onSelect) {
                  e.preventDefault();
                  onSelect(date);
                }
              }}
            >
              {cell}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
