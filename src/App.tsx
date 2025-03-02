
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

// Root component for nested routes
function Root() {
  return (
    <>
      <Outlet />
      <Toaster position="top-right" />
    </>
  );
}

// Create router instance outside of components to avoid recreation
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/",
        element: <Dashboard />
      },
      {
        path: "/pos",
        element: <POS />
      },
      {
        path: "/clients",
        element: <Clients />
      },
      {
        path: "/transactions",
        element: <Transactions />
      },
      {
        path: "/reports",
        element: <Reports />
      },
      {
        path: "/settings",
        element: <Settings />
      },
      {
        path: "/inventory",
        element: <Inventory />
      }
    ]
  }
]);

function App() {
  const [queryClient] = useState(() => new QueryClient());
  console.log("App rendering");

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
