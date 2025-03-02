
import React, { useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";

// Import pages
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import POS from "@/pages/POS";
import Inventory from "@/pages/Inventory";
import Settings from "@/pages/Settings";

// Temporary placeholder pages for components not yet implemented
const Register = () => <div className="p-8 text-lg">Register Page</div>;
const Clients = () => <div className="p-8 text-lg">Clients Page</div>;
const Transactions = () => <div className="p-8 text-lg">Transactions Page</div>;
const Reports = () => <div className="p-8 text-lg">Reports Page</div>;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Root component for layout with toaster
function Root() {
  return (
    <>
      <Outlet />
      <Toaster position="top-right" />
    </>
  );
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  console.log("App rendering with standard Routes");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Root />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route index element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="pos" element={
              <ProtectedRoute>
                <POS />
              </ProtectedRoute>
            } />
            <Route path="clients" element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            } />
            <Route path="transactions" element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            } />
            <Route path="reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="inventory" element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
