
import React, { useState, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "sonner";

import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import POS from "@/pages/POS";
import Clients from "@/pages/Clients";
import Transactions from "@/pages/Transactions";
import Reports from "@/pages/Reports";
import SettingsPage from "@/pages/SettingsPage";
import Inventory from "@/pages/Inventory";

function App() {
  const { isLoggedIn, loading } = useAuth();
  const [queryClient] = useState(() => new QueryClient());

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return <div>Loading...</div>; // Or a loading spinner
    }
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={
        createBrowserRouter([
          {
            path: "/login",
            element: isLoggedIn ? <Navigate to="/" replace /> : <Login />
          },
          {
            path: "/register",
            element: isLoggedIn ? <Navigate to="/" replace /> : <Register />
          },
          {
            path: "/",
            element: <ProtectedRoute><Dashboard /></ProtectedRoute>
          },
          {
            path: "/pos",
            element: <ProtectedRoute><POS /></ProtectedRoute>
          },
          {
            path: "/clients",
            element: <ProtectedRoute><Clients /></ProtectedRoute>
          },
          {
            path: "/transactions",
            element: <ProtectedRoute><Transactions /></ProtectedRoute>
          },
          {
            path: "/reports",
            element: <ProtectedRoute><Reports /></ProtectedRoute>
          },
          {
            path: "/settings",
            element: <ProtectedRoute><SettingsPage /></ProtectedRoute>
          },
          {
            path: "/inventory",
            element: <ProtectedRoute><Inventory /></ProtectedRoute>
          },
        ])
      } />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
