import { ReactNode } from "react";
import { NavBar } from "@/components/calendar/NavBar";
import { Footer } from "@/components/calendar/Footer";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-cream">
      <NavBar />
      <main className="flex-1 animate-fade-in pb-20 lg:pb-0">{children}</main>
      <Footer />
    </div>
  );
}
