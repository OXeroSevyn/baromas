import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, Sun, CloudRain, Wind, Droplets, Navigation, 
  Thermometer, MapPin, RefreshCcw, CloudSun, Sunrise, Sunset,
  CloudLightning, CloudFog, Snowflake, Waves, Moon
} from "lucide-react";
import { toBanglaNum, CITIES, CityName, sunTimes } from "@/lib/bangla-calendar";
import { useEffect, useState, useMemo } from "react";
import { useSettings } from "@/hooks/use-settings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rain: number;
  maxTemp: number;
  minTemp: number;
  code: number;
  daily: {
    date: string;
    max: number;
    min: number;
    code: number;
  }[];
}

const Weather = () => {
  const [settings, updateSettings] = useSettings();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    setError(false);
    try {
      const city = settings?.city || "Kolkata";
      const coords = CITIES[city as CityName] || CITIES.Kolkata;
      
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const data = await res.json();

      setWeather({
        temp: data.current.temperature_2m,
        condition: "Condition",
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        rain: data.current.precipitation,
        maxTemp: data.daily.temperature_2m_max[0],
        minTemp: data.daily.temperature_2m_min[0],
        code: data.current.weather_code,
        daily: data.daily.time.map((date: string, i: number) => ({
          date,
          max: data.daily.temperature_2m_max[i],
          min: data.daily.temperature_2m_min[i],
          code: data.daily.weather_code[i],
        })),
      });
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [settings?.city]);

  const currentCity = CITIES[settings?.city as CityName] || CITIES.Kolkata;
  const { sunrise, sunset } = useMemo(() => sunTimes(new Date(), currentCity.lat, currentCity.lon), [currentCity]);
  
  const isNight = useMemo(() => {
    const now = new Date();
    return now < sunrise || now > sunset;
  }, [sunrise, sunset]);

  const weatherTheme = useMemo(() => {
    if (!weather) return { color: "bg-primary", gradient: "from-primary/20 to-accent/20", icon: "text-primary" };
    
    const code = weather.code;
    if (code === 0) return isNight 
      ? { color: "bg-[#0f172a]", gradient: "from-[#1e293b] to-[#0f172a]", icon: "text-indigo-300" }
      : { color: "bg-orange-500", gradient: "from-orange-400 to-yellow-300", icon: "text-orange-100" };
    
    if (code <= 3) return isNight
      ? { color: "bg-[#1e1b4b]", gradient: "from-[#312e81] to-[#1e1b4b]", icon: "text-indigo-200" }
      : { color: "bg-blue-400", gradient: "from-blue-400 to-cyan-300", icon: "text-blue-50" };
    
    if (code <= 67) return { color: "bg-[#1d4ed8]", gradient: "from-[#1e40af] to-[#1e3a8a]", icon: "text-blue-200" };
    if (code <= 99) return { color: "bg-[#581c87]", gradient: "from-[#6b21a8] to-[#4c1d95]", icon: "text-purple-300" };
    
    return { color: "bg-[#475569]", gradient: "from-[#64748b] to-[#334155]", icon: "text-slate-100" };
  }, [weather, isNight]);

  const getWeatherIcon = (code: number, isDay = true, size = "h-8 w-8") => {
    if (code === 0) return isDay ? <Sun className={`${size} text-orange-400`} /> : <Moon className={`${size} text-indigo-300`} />;
    if (code <= 3) return isDay ? <CloudSun className={`${size} text-yellow-400`} /> : <Cloud className={`${size} text-slate-400`} />;
    if (code <= 48) return <CloudFog className={`${size} text-slate-400`} />;
    if (code <= 67) return <CloudRain className={`${size} text-blue-400`} />;
    if (code <= 77) return <Snowflake className={`${size} text-cyan-200`} />;
    if (code <= 82) return <Waves className={`${size} text-blue-600`} />;
    if (code <= 99) return <CloudLightning className={`${size} text-purple-500`} />;
    return <Cloud className={`${size} text-slate-400`} />;
  };

  const getDayName = (dateStr: string) => {
    const days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  return (
    <PageShell>
      <div className="container py-8 animate-fade-in mb-20 lg:mb-0">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="font-display text-5xl font-black text-accent tracking-tight leading-[1.3] py-2">আবহাওয়া</h1>
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{currentCity.label} — এখনকার পরিস্থিতি</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-card/50 p-2 rounded-[24px] backdrop-blur-sm border border-primary/5 shadow-soft">
            <Select 
              value={settings?.city} 
              onValueChange={(v) => updateSettings({ city: v as CityName })}
            >
              <SelectTrigger className="w-[160px] h-11 rounded-2xl border-none bg-transparent font-bold text-accent shadow-none focus:ring-0">
                <SelectValue placeholder="শহর বেছে নিন" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl bg-card/95 backdrop-blur-xl">
                {Object.entries(CITIES).map(([id, c]) => (
                  <SelectItem key={id} value={id} className="rounded-xl focus:bg-primary/10">
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="h-6 w-[1px] bg-primary/10" />
            <button 
              onClick={fetchWeather}
              disabled={loading}
              className="p-2.5 hover:bg-primary/5 rounded-xl transition-all disabled:opacity-50"
              title="আপডেট করুন"
            >
              <RefreshCcw className={`h-5 w-5 text-primary ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {loading && !weather ? (
          <div className="grid gap-8">
            <div className="h-[400px] bg-card rounded-[48px] animate-pulse shadow-soft" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-card rounded-[32px] animate-pulse shadow-soft" />)}
            </div>
          </div>
        ) : weather ? (
          <div className="space-y-12">
            {/* Main Weather Visual */}
            <Card className={`relative overflow-hidden rounded-[48px] border-none shadow-2xl transition-all duration-1000 ${weatherTheme.color} p-8 md:p-16 text-white group`}>
               {/* Background Decorative Element */}
               <div className={`absolute top-0 right-0 p-8 opacity-20 pointer-events-none transition-all duration-1000 group-hover:scale-125 group-hover:rotate-12 ${loading ? 'scale-90' : 'scale-110'}`}>
                  {getWeatherIcon(weather.code, !isNight, "h-80 w-80")}
               </div>
               
               <div className="absolute inset-0 bg-gradient-to-br opacity-40 mix-blend-overlay pointer-events-none" 
                    style={{ backgroundImage: `linear-gradient(135deg, white, transparent)` }} />

               <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-12 items-center">
                  <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold tracking-[0.2em] uppercase">
                       {isNight ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />} 
                       {isNight ? "শুভ রাত্রি" : "শুভ দিন"}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-[120px] md:text-[160px] font-display font-black leading-none tracking-tighter drop-shadow-2xl">
                        {toBanglaNum(Math.round(weather.temp))}°
                      </div>
                      <div className="text-2xl md:text-3xl font-bold opacity-90 flex items-center gap-4">
                         {getWeatherIcon(weather.code, !isNight, "h-10 w-10 text-white")}
                         {weather.code <= 3 ? (isNight ? "স্বচ্ছ আকাশ" : "পরিষ্কার আকাশ") : weather.code <= 48 ? "কুয়াশাচ্ছন্ন" : "বৃষ্টির সম্ভাবনা"}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-8 pt-4">
                       <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-2xl bg-white/10"><Sunrise className="h-5 w-5" /></div>
                          <div className="text-sm">
                            <div className="opacity-60 text-[10px] font-bold uppercase tracking-wider">সূর্যোদয়</div>
                            <div className="font-bold">{toBanglaNum(sunrise.getHours() % 12 || 12)}:{toBanglaNum(sunrise.getMinutes().toString().padStart(2, '0'))} {sunrise.getHours() >= 12 ? "PM" : "AM"}</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-2xl bg-white/10"><Sunset className="h-5 w-5" /></div>
                          <div className="text-sm">
                            <div className="opacity-60 text-[10px] font-bold uppercase tracking-wider">সূর্যাস্ত</div>
                            <div className="font-bold">{toBanglaNum(sunset.getHours() % 12 || 12)}:{toBanglaNum(sunset.getMinutes().toString().padStart(2, '0'))} {sunset.getHours() >= 12 ? "PM" : "AM"}</div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <WeatherDetailCard icon={<Droplets className="h-5 w-5" />} label="আর্দ্রতা" value={`${toBanglaNum(weather.humidity)}%`} color="bg-blue-400" />
                    <WeatherDetailCard icon={<Wind className="h-5 w-5" />} label="বাতাস" value={`${toBanglaNum(Math.round(weather.windSpeed))} কিমি/ঘ`} color="bg-teal-400" />
                    <WeatherDetailCard icon={<Thermometer className="h-5 w-5" />} label="সর্বোচ্চ" value={`${toBanglaNum(Math.round(weather.maxTemp))}°`} color="bg-orange-400" />
                    <WeatherDetailCard icon={<Thermometer className="h-5 w-5" />} label="সর্বনিম্ন" value={`${toBanglaNum(Math.round(weather.minTemp))}°`} color="bg-indigo-400" />
                  </div>
               </div>
            </Card>

            {/* Forecast & Extra Info */}
            <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
              <section>
                <div className="flex items-center justify-between mb-8 px-4">
                  <h2 className="font-display text-2xl font-bold text-accent">আগামী ৭ দিন</h2>
                  <div className="h-px flex-1 mx-6 bg-primary/10" />
                </div>
                
                <div className="grid gap-4">
                  {weather.daily.map((day, i) => (
                    <div 
                      key={i} 
                      className="group flex items-center justify-between p-6 rounded-[32px] bg-card/40 hover:bg-card border border-transparent hover:border-primary/10 transition-all duration-300 shadow-soft hover:shadow-xl"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-24 text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">
                          {i === 0 ? "আজ" : i === 1 ? "আগামীকাল" : getDayName(day.date)}
                        </div>
                        <div className="p-2 rounded-2xl bg-secondary/50 group-hover:scale-110 transition-transform">
                          {getWeatherIcon(day.code, true, "h-8 w-8")}
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <div className="text-xl font-black text-accent">{toBanglaNum(Math.round(day.max))}°</div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">সর্বোচ্চ</div>
                        </div>
                        <div className="h-8 w-[1px] bg-primary/10" />
                        <div className="text-right">
                          <div className="text-xl font-black text-muted-foreground/60">{toBanglaNum(Math.round(day.min))}°</div>
                          <div className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">সর্বনিম্ন</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center justify-between mb-8 px-4">
                  <h2 className="font-display text-2xl font-bold text-accent">অন্যান্য তথ্য</h2>
                </div>

                <Card className="p-8 rounded-[40px] border-none shadow-xl bg-card/60 backdrop-blur-md border border-primary/10 overflow-hidden relative group">
                   <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700 text-primary`}>
                    <CloudRain className="h-48 w-48" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-primary/10 rounded-2xl backdrop-blur-md">
                          <CloudRain className="h-6 w-6 text-primary" />
                       </div>
                       <h4 className="font-bold text-lg tracking-tight text-accent">বৃষ্টিপাতের সম্ভাবনা</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-primary/5 backdrop-blur-sm p-4 rounded-3xl border border-primary/10">
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">আজকের পরিমাণ</div>
                        <div className="text-3xl font-black text-accent">{toBanglaNum(weather.rain)} <span className="text-sm font-bold opacity-60">মিমি</span></div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        {weather.rain > 0 ? "আজ হালকা থেকে মাঝারি বৃষ্টির সম্ভাবনা রয়েছে।" : "আজ বৃষ্টির কোনো বিশেষ সম্ভাবনা নেই, আকাশ পরিষ্কার থাকবে।"}
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="grid gap-4">
                   <InfoTile icon={<Navigation className="h-4 w-4" />} label="দৃষ্টিসীমা" value={`${toBanglaNum(10)} কিমি`} color="text-teal-500" />
                   <InfoTile icon={<Sun className="h-4 w-4" />} label="UV ইনডেক্স" value={`${toBanglaNum(6)} (মাঝারি)`} color="text-orange-500" />
                   <InfoTile icon={<Waves className="h-4 w-4" />} label="আদ্রতা মাত্রা" value={weather.humidity > 60 ? "বেশি" : "স্বাভাবিক"} color="text-blue-500" />
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-card/40 border-2 border-dashed border-primary/10 rounded-[48px] backdrop-blur-sm">
             <CloudRain className="h-20 w-20 text-primary mx-auto mb-6 opacity-20" />
             <h3 className="text-accent font-black text-2xl mb-2">আবহাওয়া তথ্য পাওয়া যাচ্ছে না</h3>
             <p className="text-muted-foreground font-medium mb-8">দয়া করে আপনার ইন্টারনেট সংযোগ চেক করুন।</p>
             <button 
              onClick={() => fetchWeather()}
              className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:shadow-warm transition-all"
             >
               আবার চেষ্টা করুন
             </button>
          </div>
        )}
      </div>
    </PageShell>
  );
};

function WeatherDetailCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="p-5 md:p-6 bg-white/10 backdrop-blur-md rounded-[32px] border border-white/10 shadow-xl transition-all hover:bg-white/15 group">
       <div className={`flex items-center gap-2 mb-2 opacity-80 group-hover:opacity-100 transition-opacity`}>
          {icon}
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{label}</span>
       </div>
       <div className="text-2xl md:text-3xl font-black tracking-tight">{value}</div>
    </div>
  );
}

function InfoTile({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-3xl bg-card/50 border border-primary/5 hover:border-primary/20 transition-all shadow-soft group">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl bg-primary/5 ${color} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        <span className="text-sm font-bold text-accent/80">{label}</span>
      </div>
      <span className="font-black text-primary text-sm">{value}</span>
    </div>
  );
}

export default Weather;
