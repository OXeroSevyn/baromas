import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, Sun, CloudRain, Wind, Droplets, Navigation, 
  Thermometer, MapPin, RefreshCcw, CloudSun, Sunrise, Sunset,
  CloudLightning, CloudFog, Snowflake, Waves
} from "lucide-react";
import { toBanglaNum, CITIES, CityName, sunTimes } from "@/lib/bangla-calendar";
import { useEffect, useState } from "react";
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

const GREGORIAN_MONTHS_BN = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

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
        condition: "Condition", // We use code for icon
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

  const getWeatherIcon = (code: number, isDay = true, size = "h-8 w-8") => {
    if (code === 0) return <Sun className={`${size} text-orange-400`} />;
    if (code <= 3) return isDay ? <CloudSun className={`${size} text-yellow-400`} /> : <Cloud className={`${size} text-blue-300`} />;
    if (code <= 48) return <CloudFog className={`${size} text-gray-400`} />;
    if (code <= 67) return <CloudRain className={`${size} text-blue-400`} />;
    if (code <= 77) return <Snowflake className={`${size} text-blue-200`} />;
    if (code <= 82) return <Waves className={`${size} text-blue-600`} />;
    if (code <= 99) return <CloudLightning className={`${size} text-purple-500`} />;
    return <Cloud className={`${size} text-gray-400`} />;
  };

  const getDayName = (dateStr: string) => {
    const days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  const currentCity = CITIES[settings?.city as CityName] || CITIES.Kolkata;
  const { sunrise, sunset } = sunTimes(new Date(), currentCity.lat, currentCity.lon);

  return (
    <PageShell>
      <div className="container py-6 animate-fade-in mb-20 lg:mb-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="font-display text-4xl font-bold text-accent mb-2">আবহাওয়া</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>আপনার শহরের বর্তমান পরিস্থিতি</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select 
              value={settings?.city} 
              onValueChange={(v) => updateSettings({ city: v as CityName })}
            >
              <SelectTrigger className="w-[180px] h-12 rounded-2xl border-none bg-card shadow-soft font-bold text-accent">
                <SelectValue placeholder="শহর বেছে নিন" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-orange-100 shadow-xl">
                {Object.entries(CITIES).map(([id, c]) => (
                  <SelectItem key={id} value={id} className="rounded-xl focus:bg-primary/10">
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button 
              onClick={fetchWeather}
              disabled={loading}
              className="p-3 bg-card rounded-2xl shadow-soft hover:bg-secondary transition-all disabled:opacity-50"
            >
              <RefreshCcw className={`h-6 w-6 text-primary ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {loading && !weather ? (
          <div className="grid gap-6">
            <div className="h-64 bg-card rounded-[40px] animate-pulse shadow-soft" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-card rounded-3xl animate-pulse shadow-soft" />)}
            </div>
          </div>
        ) : weather ? (
          <div className="space-y-10">
            {/* Hero Card */}
            <Card className="relative overflow-hidden rounded-[40px] border-none shadow-warm bg-gradient-to-br from-white/80 to-secondary/30 backdrop-blur-md p-8 md:p-12">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  {getWeatherIcon(weather.code, true, "h-64 w-64")}
               </div>
               
               <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
                  <div className="space-y-6">
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/20 border-none px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest">
                       আজকের আবহাওয়া
                    </Badge>
                    <div>
                      <div className="text-8xl md:text-9xl font-display font-black text-accent tracking-tighter">
                        {toBanglaNum(Math.round(weather.temp))}°
                      </div>
                      <div className="text-2xl font-bold text-accent/60 mt-2 flex items-center gap-3">
                         {getWeatherIcon(weather.code, true, "h-8 w-8")}
                         {weather.code <= 3 ? "পরিষ্কার আকাশ" : weather.code <= 48 ? "কুয়াশাচ্ছন্ন" : "বৃষ্টির সম্ভাবনা"}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 pt-4">
                       <div className="flex items-center gap-2">
                          <Sunrise className="h-5 w-5 text-orange-400" />
                          <span className="text-sm font-bold text-accent">সূর্যোদয়: {toBanglaNum(sunrise.getHours() % 12 || 12)}:{toBanglaNum(sunrise.getMinutes().toString().padStart(2, '0'))}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Sunset className="h-5 w-5 text-purple-400" />
                          <span className="text-sm font-bold text-accent">সূর্যাস্ত: {toBanglaNum(sunset.getHours() % 12 || 12)}:{toBanglaNum(sunset.getMinutes().toString().padStart(2, '0'))}</span>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full md:w-80">
                    <div className="p-6 bg-white/50 rounded-[32px] shadow-soft backdrop-blur-sm">
                       <div className="flex items-center gap-2 text-blue-500 mb-2">
                          <Droplets className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">আর্দ্রতা</span>
                       </div>
                       <div className="text-2xl font-black text-accent">{toBanglaNum(weather.humidity)}%</div>
                    </div>
                    <div className="p-6 bg-white/50 rounded-[32px] shadow-soft backdrop-blur-sm">
                       <div className="flex items-center gap-2 text-teal-500 mb-2">
                          <Wind className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">বাতাস</span>
                       </div>
                       <div className="text-2xl font-black text-accent">{toBanglaNum(Math.round(weather.windSpeed))} <span className="text-xs">কিমি/ঘ</span></div>
                    </div>
                    <div className="p-6 bg-white/50 rounded-[32px] shadow-soft backdrop-blur-sm">
                       <div className="flex items-center gap-2 text-orange-400 mb-2">
                          <Thermometer className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">সর্বোচ্চ</span>
                       </div>
                       <div className="text-2xl font-black text-accent">{toBanglaNum(Math.round(weather.maxTemp))}°</div>
                    </div>
                    <div className="p-6 bg-white/50 rounded-[32px] shadow-soft backdrop-blur-sm">
                       <div className="flex items-center gap-2 text-indigo-400 mb-2">
                          <Thermometer className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">সর্বনিম্ন</span>
                       </div>
                       <div className="text-2xl font-black text-accent">{toBanglaNum(Math.round(weather.minTemp))}°</div>
                    </div>
                  </div>
               </div>
            </Card>

            {/* 7-Day Forecast */}
            <div>
              <h2 className="font-display text-2xl font-bold text-accent mb-6 flex items-center gap-2 px-2">
                <CloudSun className="h-6 w-6 text-primary" /> আগামী ৭ দিনের পূর্বাভাস
              </h2>
              
              <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <Card className="p-6 shadow-soft rounded-[40px] border-none overflow-hidden">
                  <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 mb-0">
                    {weather.daily.map((day, i) => (
                      <div key={i} className="flex flex-col items-center justify-center text-center p-4 min-w-[120px] md:min-w-0 bg-secondary/20 rounded-3xl hover:bg-primary/5 transition-all cursor-default">
                        <div className="text-xs font-bold text-muted-foreground mb-3">
                          {i === 0 ? "আজ" : i === 1 ? "আগামীকাল" : getDayName(day.date)}
                        </div>
                        <div className="mb-3">
                          {getWeatherIcon(day.code, true, "h-10 w-10")}
                        </div>
                        <div className="text-xl font-black text-accent">
                          {toBanglaNum(Math.round(day.max))}°
                        </div>
                        <div className="text-[10px] font-bold text-muted-foreground">
                          {toBanglaNum(Math.round(day.min))}°
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="space-y-6">
                  <Card className="p-6 shadow-soft rounded-[32px] border-none bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                          <Thermometer className="h-6 w-6" />
                       </div>
                       <h4 className="font-bold">তাপমাত্রার পরিস্থিতি</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl">
                        <span className="text-sm font-medium">সর্বোচ্চ তাপমাত্রা</span>
                        <span className="text-xl font-bold">{toBanglaNum(weather.daily[0].max)}°C</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl">
                        <span className="text-sm font-medium">সর্বনিম্ন তাপমাত্রা</span>
                        <span className="text-xl font-bold">{toBanglaNum(weather.daily[0].min)}°C</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 shadow-soft rounded-[32px] border-none bg-white">
                    <h4 className="font-bold text-accent mb-6 flex items-center gap-2">
                      <Navigation className="h-5 w-5 text-primary" /> অন্যান্য তথ্য
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl">
                        <div className="flex items-center gap-3">
                           <CloudRain className="h-5 w-5 text-blue-500" />
                           <span className="text-sm font-bold text-accent">বৃষ্টিপাত</span>
                        </div>
                        <span className="font-bold text-primary">{toBanglaNum(weather.rain)} মিমি</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl">
                        <div className="flex items-center gap-3">
                           <Navigation className="h-5 w-5 text-teal-500" />
                           <span className="text-sm font-bold text-accent">দৃষ্টিসীমা</span>
                        </div>
                        <span className="font-bold text-primary">{toBanglaNum(10)} কিমি</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl">
                        <div className="flex items-center gap-3">
                           <Sun className="h-5 w-5 text-orange-400" />
                           <span className="text-sm font-bold text-accent">UV ইনডেক্স</span>
                        </div>
                        <span className="font-bold text-primary">{toBanglaNum(6)} (মাঝারি)</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-card border-2 border-dashed rounded-[40px]">
             <CloudRain className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
             <p className="text-muted-foreground font-bold text-xl">আবহাওয়া তথ্য পাওয়া যাচ্ছে না।</p>
             <button 
              onClick={() => fetchWeather()}
              className="mt-6 text-primary font-bold hover:underline"
             >
               আবার চেষ্টা করুন
             </button>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default Weather;
