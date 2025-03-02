import { useState } from "react"
import { Home, Settings, ShoppingCart, Menu, X, Package } from "lucide-react"
import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/useMobile"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"

export function Sidebar() {
  const { isMobile } = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 h-full w-[280px] border-r bg-sidebar transition-transform duration-300 ease-in-out dark:bg-sidebar",
        isMobile && (sidebarOpen ? "translate-x-0" : "-translate-x-full")
      )}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="font-semibold text-2xl">NextPOS</span>
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      
      <nav className="px-3 py-2">
        <div className="space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex h-10 items-center rounded-md px-3 text-base font-medium transition-colors hover:bg-sidebar-hover hover:text-foreground",
                isActive
                  ? "bg-accent text-primary-foreground hover:bg-accent hover:text-primary-foreground"
                  : "text-foreground"
              )
            }
          >
            <Home className="mr-2 h-5 w-5" />
            Dashboard
          </NavLink>
          
          <NavLink
            to="/pos"
            className={({ isActive }) =>
              cn(
                "flex h-10 items-center rounded-md px-3 text-base font-medium transition-colors hover:bg-sidebar-hover hover:text-foreground",
                isActive
                  ? "bg-accent text-primary-foreground hover:bg-accent hover:text-primary-foreground"
                  : "text-foreground"
              )
            }
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            POS
          </NavLink>
          
          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              cn(
                "flex h-10 items-center rounded-md px-3 text-base font-medium transition-colors hover:bg-sidebar-hover hover:text-foreground",
                isActive
                  ? "bg-accent text-primary-foreground hover:bg-accent hover:text-primary-foreground"
                  : "text-foreground"
              )
            }
          >
            <Package className="mr-2 h-5 w-5" />
            Inventory
          </NavLink>
          
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex h-10 items-center rounded-md px-3 text-base font-medium transition-colors hover:bg-sidebar-hover hover:text-foreground",
                isActive
                  ? "bg-accent text-primary-foreground hover:bg-accent hover:text-primary-foreground"
                  : "text-foreground"
              )
            }
          >
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </NavLink>
        </div>
      </nav>
      
      <div className="absolute bottom-0 left-0 w-full border-t p-4">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          {user && (
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user.email}</span>
              <button onClick={logout} className="text-sm text-muted-foreground hover:text-foreground">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
