
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Create placeholder pages for future implementation
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-screen">
    <h1 className="text-2xl font-bold">{title} - Coming Soon</h1>
  </div>
);

const POSPage = () => <PlaceholderPage title="POS" />;
const ClientsPage = () => <PlaceholderPage title="Clients" />;
const TransactionsPage = () => <PlaceholderPage title="Transactions" />;
const ReportsPage = () => <PlaceholderPage title="Reports" />;
const SettingsPage = () => <PlaceholderPage title="Settings" />;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pos" element={<POSPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
