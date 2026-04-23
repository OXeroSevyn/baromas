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
  conditionCode: number;
  humidity: number;
  wind: number;
  rain: number;
  isDay: boolean;
  city: string;
  sunrise: string;
  sunset: string;
  daily: {
    date: string;
    code: number;
    max: number;
    min: number;
  }[];
}

const Weather = () => {
  const [settings, updateSettings] = useSettings();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (cityName?: string) => {
    setLoading(true);
    try {
      const city = (cityName as CityName) || settings?.city || "Kolkata";
      const c = CITIES[city];
      
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
      
      const response = await fetch(url);
      const data = await response.json();
      const current = data.current;
      const daily = data.daily;

      // Weather code to text mapping
      const getCondition = (code: number) => {
        if (code === 0) return "পরিষ্কার আকাশ";
        if (code <= 3) return "আংশিক মেঘলা";
        if (code <= 48) return "কুয়াশাচ্ছন্ন";
        if (code <= 67) return "বৃষ্টি হচ্ছে";
        if (code <= 77) return "তুষারপাত";
        if (code <= 82) return "ভারী বৃষ্টি";
        return "বজ্রবিদ্যুৎ সহ বৃষ্টি";
      };

      const { sunrise, sunset } = sunTimes(new Date(), c.lat, c.lon);
      const formatTime = (d: Date) => {
        return toBanglaNum(d.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', hour12: true }));
      };

      setWeather({
        temp: Math.round(current.temperature_2m),
        condition: getCondition(current.weather_code),
        conditionCode: current.weather_code,
        humidity: current.relative_humidity_2m,
        wind: Math.round(current.wind_speed_10m),
        rain: current.precipitation,
        isDay: current.is_day === 1,
        city: c.label,
        sunrise: formatTime(sunrise),
        sunset: formatTime(sunset),
        daily: daily.time.map((time: string, i: number) => ({
          date: time,
          code: daily.weather_code[i],
          max: Math.round(daily.temperature_2m_max[i]),
          min: Math.round(daily.temperature_2m_min[i])
        }))
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
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
    return <CloudLightning className={`${size} text-purple-400`} />;
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "আজ";
    return date.toLocaleDateString('bn-BD', { weekday: 'long' });
  };

  return (
    <PageShell>
      <div className="container py-6 animate-fade-in max-w-5xl">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl">
               <CloudSun className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-accent">আবহাওয়া আপডেট</h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2 font-medium">
                <MapPin className="h-4 w-4 text-primary" /> 
                {weather?.city} শহর ও পার্শ্ববর্তী অঞ্চলের আবহাওয়া
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select 
              value={settings?.city} 
              onValueChange={(v) => updateSettings({ city: v as CityName })}
            >
              <SelectTrigger className="w-[180px] rounded-2xl border-2 border-primary/20 bg-white shadow-soft h-12 font-bold text-accent">
                <SelectValue placeholder="শহর বেছে নিন" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-primary/10 shadow-xl">
                {Object.entries(CITIES).map(([id, c]) => (
                  <SelectItem key={id} value={id} className="font-bold cursor-pointer">
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button 
              onClick={() => fetchWeather()}
              disabled={loading}
              className="p-3 bg-white border-2 border-primary/20 rounded-2xl shadow-soft hover:bg-primary/5 transition-all disabled:opacity-50 text-primary"
            >
              <RefreshCcw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {loading && !weather ? (
          <div className="space-y-8">
            <Card className="h-[300px] animate-pulse bg-muted rounded-3xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[1, 2, 3, 4].map(i => (
                 <Card key={i} className="h-32 animate-pulse bg-muted rounded-3xl" />
               ))}
            </div>
          </div>
        ) : weather ? (
          <div className="space-y-8">
            {/* Hero Weather Card */}
            <Card className="relative overflow-hidden border-none shadow-2xl rounded-[40px] bg-gradient-to-br from-primary/5 via-background to-accent/5">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-10 blur-2xl">
                 {getWeatherIcon(weather.conditionCode, weather.isDay, "h-96 w-96")}
              </div>
              
              <div className="p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-10">
                <div className="space-y-6">
                  <Badge className="bg-primary text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg shadow-primary/20">
                    {weather.isDay ? "আজকের দিন" : "আজকের রাত"}
                  </Badge>
                  <div>
                    <div className="text-8xl md:text-9xl font-display font-bold text-accent flex items-start gap-2">
                      {toBanglaNum(weather.temp)}<span className="text-4xl md:text-5xl mt-4 font-normal text-muted-foreground">°C</span>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                       <div className="p-3 bg-white shadow-soft rounded-2xl">
                         {getWeatherIcon(weather.conditionCode, weather.isDay, "h-10 w-10")}
                       </div>
                       <div className="text-2xl font-bold text-accent">{weather.condition}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                  <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl shadow-soft border border-white/50 flex flex-col items-center justify-center text-center">
                    <Droplets className="h-8 w-8 text-blue-500 mb-3" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">আর্দ্রতা</span>
                    <span className="text-2xl font-bold text-accent">{toBanglaNum(weather.humidity)}%</span>
                  </div>
                  <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl shadow-soft border border-white/50 flex flex-col items-center justify-center text-center">
                    <Wind className="h-8 w-8 text-teal-500 mb-3" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">বাতাস</span>
                    <span className="text-2xl font-bold text-accent">{toBanglaNum(weather.wind)}<span className="text-sm"> কিমি/ঘ</span></span>
                  </div>
                  <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl shadow-soft border border-white/50 flex flex-col items-center justify-center text-center">
                    <Sunrise className="h-8 w-8 text-orange-400 mb-3" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">সূর্যোদয়</span>
                    <span className="text-xl font-bold text-accent">{weather.sunrise}</span>
                  </div>
                  <div className="p-6 bg-white/60 backdrop-blur-md rounded-3xl shadow-soft border border-white/50 flex flex-col items-center justify-center text-center">
                    <Sunset className="h-8 w-8 text-orange-600 mb-3" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">সূর্যাস্ত</span>
                    <span className="text-xl font-bold text-accent">{weather.sunset}</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Daily Forecast */}
              <Card className="lg:col-span-2 p-8 rounded-[40px] shadow-warm border-none bg-white">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-2xl font-bold text-accent flex items-center gap-3">
                     <RefreshCcw className="h-6 w-6 text-primary" /> আগাম ৭ দিনের পূর্বাভাস
                   </h3>
                </div>
                <div className="space-y-6">
                  {weather.daily.map((day, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-secondary/30 rounded-2xl transition-colors group">
                      <div className="w-32 font-bold text-accent">
                        {getDayName(day.date)}
                      </div>
                      <div className="flex-1 flex items-center gap-4">
                        <div className="p-2 bg-primary/5 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                           {getWeatherIcon(day.code, true, "h-6 w-6")}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground hidden md:block">
                          {day.code <= 3 ? "পরিষ্কার" : day.code <= 67 ? "বৃষ্টির সম্ভাবনা" : "মেঘলা"}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-muted-foreground uppercase">সর্বোচ্চ</span>
                            <span className="text-lg font-bold text-accent">{toBanglaNum(day.max)}°</span>
                         </div>
                         <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-muted-foreground uppercase">সর্বনিম্ন</span>
                            <span className="text-lg font-bold text-muted-foreground">{toBanglaNum(day.min)}°</span>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Extra Stats */}
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
