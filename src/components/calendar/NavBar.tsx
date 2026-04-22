import { Link, NavLink } from "react-router-dom";
import { Calendar, Sparkles, BookOpen, Settings as SettingsIcon, Wrench, ListChecks, Flag, Globe, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "মূল পাতা", icon: Calendar },
  { to: "/panjika", label: "পঞ্জিকা", icon: Moon },
  { to: "/festivals", label: "উৎসব", icon: Sparkles },
  { to: "/freedom-fighters", label: "স্বাধীনতা সংগ্রামী", icon: Flag },
  { to: "/holidays", label: "বিশ্বের ছুটি", icon: Globe },
  { to: "/events", label: "ইভেন্ট", icon: ListChecks },
  { to: "/tools", label: "টুলস", icon: Wrench },
  { to: "/about", label: "পরিচয়", icon: BookOpen },
  { to: "/settings", label: "সেটিংস", icon: SettingsIcon },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md no-print">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-1.5">
          <div className="flex h-16 w-auto items-center justify-center">
            <img 
              src="/branding/logo-color.png" 
              alt="বারোমাস" 
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="leading-tight">
            <div className="text-[11px] text-muted-foreground">তিথি · নক্ষত্র · উৎসব</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/75 hover:bg-secondary hover:text-foreground",
                )
              }
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="md:hidden border-t border-border">
        <nav className="container flex items-center gap-1 overflow-x-auto py-2">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium",
                  isActive ? "bg-primary/10 text-primary" : "text-foreground/70",
                )
              }
            >
              <it.icon className="h-3.5 w-3.5" />
              {it.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
