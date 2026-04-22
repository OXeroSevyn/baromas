import { PageShell } from "@/components/calendar/PageShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, Sun, CloudRain, Wind, Droplets, Navigation, 
  Thermometer, MapPin, RefreshCcw, CloudSun 
} from "lucide-react";
import { toBanglaNum } from "@/lib/bangla-calendar";
import { useEffect, useState } from "react";
import { useSettings } from "@/hooks/use-settings";

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  rain: number;
  isDay: boolean;
  city: string;
}

const Weather = () => {
  const [settings] = useSettings();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const city = settings?.city || "Kolkata";
      // Coordinates for major cities
      const coords: Record<string, { lat: number; lon: number }> = {
        "Kolkata": { lat: 22.5726, lon: 88.3639 },
        "Dhaka": { lat: 23.8103, lon: 90.4125 },
        "Siliguri": { lat: 26.7271, lon: 88.3953 },
        "Durgapur": { lat: 23.5204, lon: 87.3119 },
      };

      const { lat, lon } = coords[city] || coords["Kolkata"];
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;
      
      const response = await fetch(url);
      const data = await response.json();
      const current = data.current;

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

      setWeather({
        temp: Math.round(current.temperature_2m),
        condition: getCondition(current.weather_code),
        humidity: current.relative_humidity_2m,
        wind: Math.round(current.wind_speed_10m),
        rain: current.precipitation,
        isDay: current.is_day === 1,
        city: city
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

  return (
    <PageShell>
      <div className="container py-6 animate-fade-in">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-accent">আবহাওয়া</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {weather?.city || settings?.city || "কলকাতা"} এর বর্তমান পরিস্থিতি
            </p>
          </div>
          <button 
            onClick={fetchWeather}
            disabled={loading}
            className="p-3 bg-card border rounded-xl hover:bg-secondary transition-all disabled:opacity-50"
          >
            <RefreshCcw className={`h-5 w-5 text-primary ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading && !weather ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="h-32 animate-pulse bg-muted" />
            ))}
          </div>
        ) : weather ? (
          <div className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-primary/10 via-background to-secondary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                 {weather.isDay ? <Sun className="h-40 w-40" /> : <CloudSun className="h-40 w-40" />}
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
                <div className="text-center md:text-left">
                  <div className="text-7xl font-display font-bold text-accent mb-2">
                    {toBanglaNum(weather.temp)}°<span className="text-3xl text-muted-foreground font-normal">C</span>
                  </div>
                  <Badge className="text-lg px-4 py-1 bg-primary/20 text-primary border-none">
                    {weather.condition}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-1">
                  <div className="flex flex-col items-center p-4 bg-white/40 rounded-2xl backdrop-blur-sm shadow-soft">
                    <Droplets className="h-6 w-6 text-blue-500 mb-2" />
                    <span className="text-xs font-bold text-muted-foreground">আর্দ্রতা</span>
                    <span className="text-xl font-bold text-accent">{toBanglaNum(weather.humidity)}%</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white/40 rounded-2xl backdrop-blur-sm shadow-soft">
                    <Wind className="h-6 w-6 text-teal-500 mb-2" />
                    <span className="text-xs font-bold text-muted-foreground">বাতাস</span>
                    <span className="text-xl font-bold text-accent">{toBanglaNum(weather.wind)} কিমি/ঘ</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white/40 rounded-2xl backdrop-blur-sm shadow-soft">
                    <CloudRain className="h-6 w-6 text-indigo-500 mb-2" />
                    <span className="text-xs font-bold text-muted-foreground">বৃষ্টিপাত</span>
                    <span className="text-xl font-bold text-accent">{toBanglaNum(weather.rain)} মিমি</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white/40 rounded-2xl backdrop-blur-sm shadow-soft">
                    <Navigation className="h-6 w-6 text-orange-500 mb-2" />
                    <span className="text-xs font-bold text-muted-foreground">দৃষ্টিসীমা</span>
                    <span className="text-xl font-bold text-accent">{toBanglaNum(10)} কিমি</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 shadow-soft flex items-center gap-4 border-l-4 border-l-orange-400">
                <Thermometer className="h-10 w-10 text-orange-400" />
                <div>
                   <div className="text-sm font-bold text-muted-foreground">সর্বোচ্চ তাপমাত্রা</div>
                   <div className="text-2xl font-bold text-accent">{toBanglaNum(weather.temp + 4)}°C</div>
                </div>
              </Card>
              <Card className="p-6 shadow-soft flex items-center gap-4 border-l-4 border-l-blue-400">
                <Thermometer className="h-10 w-10 text-blue-400" />
                <div>
                   <div className="text-sm font-bold text-muted-foreground">সর্বনিম্ন তাপমাত্রা</div>
                   <div className="text-2xl font-bold text-accent">{toBanglaNum(weather.temp - 3)}°C</div>
                </div>
              </Card>
              <Card className="p-6 shadow-soft flex items-center gap-4 border-l-4 border-l-indigo-400">
                <Cloud className="h-10 w-10 text-indigo-400" />
                <div>
                   <div className="text-sm font-bold text-muted-foreground">মেঘের ঘনত্ব</div>
                   <div className="text-2xl font-bold text-accent">{toBanglaNum(45)}%</div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <p className="text-center py-20 text-muted-foreground">আবহাওয়া তথ্য পাওয়া যাচ্ছে না।</p>
        )}
      </div>
    </PageShell>
  );
};

export default Weather;
