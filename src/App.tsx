
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import POS from "./pages/POS";
import Settings from "./pages/Settings";
import { SettingsProvider } from "./contexts/SettingsContext";

// Create placeholder pages for future implementation
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-screen">
    <h1 className="text-2xl font-bold">{title} - Coming Soon</h1>
  </div>
);

const ClientsPage = () => <PlaceholderPage title="Clients" />;
const TransactionsPage = () => <PlaceholderPage title="Transactions" />;
const ReportsPage = () => <PlaceholderPage title="Reports" />;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
