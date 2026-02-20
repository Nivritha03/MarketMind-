import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import SalesPitch from "./pages/SalesPitch";
import Insights from "./pages/Insights";
import Sentiment from "./pages/Sentiment";
import LeadScoring from "./pages/LeadScoring";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import CompetitorAnalysis from "./pages/CompetitorAnalysis";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/pitch" element={<SalesPitch />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/sentiment" element={<Sentiment />} />
            <Route path="/leads" element={<LeadScoring />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/competitor-analysis" element={<CompetitorAnalysis />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
