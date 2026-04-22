import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Month from "./pages/Month";
import Day from "./pages/Day";
import Year from "./pages/Year";
import Festivals from "./pages/Festivals";
import Events from "./pages/Events";
import Tools from "./pages/Tools";
import Settings from "./pages/Settings";
import About from "./pages/About";
import FreedomFighters from "./pages/FreedomFighters";
import Holidays from "./pages/Holidays";
import Panjika from "./pages/Panjika";
import NotFound from "./pages/NotFound";
import { LoadingScreen } from "./components/calendar/LoadingScreen";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isLoading && <LoadingScreen onDone={() => setIsLoading(false)} />}
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/month/:year/:month" element={<Month />} />
          <Route path="/day/:date" element={<Day />} />
          <Route path="/year/:year" element={<Year />} />
          <Route path="/festivals" element={<Festivals />} />
          <Route path="/events" element={<Events />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/freedom-fighters" element={<FreedomFighters />} />
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/panjika" element={<Panjika />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
