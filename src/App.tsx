
import React, { useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Route,
  createRoutesFromElements,
  Outlet
} from "react-router-dom";
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";
import { SettingsProvider } from '@/contexts/SettingsContext';

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

function Root() {
  return (
    <>
      <Outlet />
      <Toaster position="top-right" />
    </>
  );
}

function AppRoutes() {
  const { user, session, loading, isAuthenticated } = useAuth();
  console.log("Auth state:", { isAuthenticated, loading, user });

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Root />}>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/pos"
          element={<ProtectedRoute><POS /></ProtectedRoute>}
        />
        <Route
          path="/clients"
          element={<ProtectedRoute><Clients /></ProtectedRoute>}
        />
        <Route
          path="/transactions"
          element={<ProtectedRoute><Transactions /></ProtectedRoute>}
        />
        <Route
          path="/reports"
          element={<ProtectedRoute><Reports /></ProtectedRoute>}
        />
        <Route
          path="/settings"
          element={<ProtectedRoute><Settings /></ProtectedRoute>}
        />
        <Route
          path="/inventory"
          element={<ProtectedRoute><Inventory /></ProtectedRoute>}
        />
      </Route>
    )
  );
  
  return <RouterProvider router={router} />;
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  console.log("App rendering");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <AppRoutes />
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
