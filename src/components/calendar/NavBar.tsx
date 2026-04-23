import { Link, NavLink } from "react-router-dom";
import { Calendar, Sparkles, BookOpen, Settings as SettingsIcon, Wrench, ListChecks, Flag, Globe, Moon, Vote, Newspaper, Sun, TrendingUp, Star, MoreHorizontal, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const mainItems = [
  { to: "/", label: "মূল পাতা", icon: Calendar },
  { to: "/panjika", label: "পঞ্জিকা", icon: Moon },
  { to: "/horoscope", label: "রাশিফল", icon: Star },
  { to: "/news", label: "সংবাদ", icon: Newspaper },
  { to: "/weather", label: "আবহাওয়া", icon: Sun },
  { to: "/market", label: "বাজার দর", icon: TrendingUp },
];

const secondaryItems = [
  { to: "/festivals", label: "উৎসব", icon: Sparkles },
  { to: "/election-day", label: "নির্বাচনী দিন", icon: Vote },
  { to: "/freedom-fighters", label: "স্বাধীনতা সংগ্রামী", icon: Flag },
  { to: "/holidays", label: "বিশ্বের ছুটি", icon: Globe },
  { to: "/events", label: "ইভেন্ট", icon: ListChecks },
  { to: "/tools", label: "টুলস", icon: Wrench },
  { to: "/about", label: "পরিচয়", icon: BookOpen },
  { to: "/settings", label: "সেটিংস", icon: SettingsIcon },
];

const allItems = [...mainItems, ...secondaryItems];

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md no-print shadow-sm">
      <div className="container flex h-20 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="flex h-14 w-14 items-center justify-center bg-white rounded-full shadow-inner p-1 overflow-hidden border border-orange-100 group-hover:scale-105 transition-transform duration-300">
            <img 
              src="/branding/logo-color.png" 
              alt="বারোমাস" 
              className="h-full w-full object-contain"
              onError={(e) => {
                // Fallback if logo fails
                e.currentTarget.src = "/branding/logo-bright.png";
              }}
            />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xl font-display font-bold text-accent tracking-tight leading-none group-hover:text-primary transition-colors">বারোমাস</span>
            <span className="text-[10px] text-primary/70 font-bold uppercase tracking-widest mt-1">তিথি · নক্ষত্র · উৎসব</span>
          </div>
        </Link>
        
        <nav className="hidden items-center gap-1 lg:flex">
          {mainItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all whitespace-nowrap",
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-foreground/75 hover:bg-secondary hover:text-foreground",
                )
              }
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </NavLink>
          ))}
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-foreground/75 hover:bg-secondary hover:text-foreground transition-all outline-none">
              <MoreHorizontal className="h-4 w-4" />
              আরো <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl border-orange-100 animate-in fade-in zoom-in duration-200">
              {secondaryItems.map((it) => (
                <DropdownMenuItem key={it.to} asChild className="rounded-xl focus:bg-primary/10 focus:text-primary cursor-pointer p-0">
                  <Link to={it.to} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold">
                    <it.icon className="h-4 w-4" />
                    {it.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      {/* Mobile/Compact Tablet Trigger */}
      <div className="lg:hidden flex items-center gap-2">
         {/* We keep the horizontal scroll for mobile as requested before but cleaned up */}
      </div>

      {/* Fixed Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border bg-background/80 backdrop-blur-lg pb-safe">
        <nav className="flex items-center justify-around h-16 px-2">
          {mainItems.slice(0, 5).map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 w-full h-full transition-all",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <it.icon className="h-5 w-5" />
              <span className="text-[10px] font-bold">{it.label.split(' ')[0]}</span>
            </NavLink>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-col items-center justify-center gap-1 w-full h-full text-muted-foreground outline-none">
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-[10px] font-bold">আরো</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="center" className="w-56 p-2 rounded-2xl shadow-xl border-orange-100 mb-2">
              {secondaryItems.map((it) => (
                <DropdownMenuItem key={it.to} asChild className="rounded-xl focus:bg-primary/10 focus:text-primary cursor-pointer p-0">
                  <Link to={it.to} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold">
                    <it.icon className="h-4 w-4" />
                    {it.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
