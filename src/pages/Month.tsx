import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageShell } from "@/components/calendar/PageShell";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { Button } from "@/components/calendar/IconButton";
import { GREGORIAN_MONTHS_BN, toBanglaNum, isoDate } from "@/lib/bangla-calendar";
import { useSettings } from "@/hooks/use-settings";
import { useEvents } from "@/hooks/use-events";
import { festivalsInYear } from "@/data/festivals";
import { FestivalCard } from "@/components/calendar/FestivalCard";

const Month = () => {
  const { year, month } = useParams();
  const navigate = useNavigate();
  const [settings] = useSettings();
  const { events } = useEvents();
  const y = Number(year) || new Date().getFullYear();
  const m = Math.max(0, Math.min(11, (Number(month) || 1) - 1));
  const [cursor, setCursor] = useState({ y, m });

  const monthFests = festivalsInYear(cursor.y, settings.region).filter(
    (f) => f.date.getMonth() === cursor.m,
  );

  const go = (dy: number) => {
    let nm = cursor.m + dy;
    let ny = cursor.y;
    if (nm < 0) { nm = 11; ny--; }
    if (nm > 11) { nm = 0; ny++; }
    setCursor({ y: ny, m: nm });
    navigate(`/month/${ny}/${nm + 1}`, { replace: true });
  };

  return (
    <PageShell>
      <section className="container py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-bold text-accent">
            {GREGORIAN_MONTHS_BN[cursor.m]} {toBanglaNum(cursor.y)}
          </h1>
          <div className="flex items-center gap-2">
            <Button onClick={() => go(-1)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button onClick={() => window.print()}>প্রিন্ট / PDF</Button>
            <Button onClick={() => go(1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
        <MonthGrid
          year={cursor.y}
          month={cursor.m}
          region={settings.region}
          startDay={settings.startDay}
          events={events}
        />
      </section>

      {monthFests.length > 0 && (
        <section className="container mt-6">
          <h2 className="mb-3 font-display text-xl font-bold text-accent">এই মাসের উৎসব</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {monthFests.map(({ festival, date }) => (
              <FestivalCard key={festival.id} festival={festival} date={date} region={settings.region} />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
};

export default Month;
