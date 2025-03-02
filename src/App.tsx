
import React, { useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
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
const Register = () => <div>Register Page</div>;
const Clients = () => <div>Clients Page</div>;
const Transactions = () => <div>Transactions Page</div>;
const Reports = () => <div>Reports Page</div>;

function App() {
  const { user, session, loading, isAuthenticated } = useAuth();
  const [queryClient] = useState(() => new QueryClient());

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return <div>Loading...</div>; // Or a loading spinner
    }
    if (!isAuthenticated) {
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
            element: isAuthenticated ? <Navigate to="/" replace /> : <Login />
          },
          {
            path: "/register",
            element: isAuthenticated ? <Navigate to="/" replace /> : <Register />
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
            element: <ProtectedRoute><Settings /></ProtectedRoute>
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
