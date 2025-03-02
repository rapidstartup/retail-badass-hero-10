
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet
} from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";

import Login from "@/pages/Login";
import Inventory from "@/pages/Inventory";
import Index from "@/pages/Index";
import POS from "@/pages/POS";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Outlet />
                    </Layout>
                  </ProtectedRoute>
                }
              >
                <Route index element={<Index />} />
                <Route path="pos" element={<POS />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="settings/*" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
