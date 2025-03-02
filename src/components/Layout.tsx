
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  Users, 
  Receipt, 
  BarChart4, 
  Settings, 
  ShoppingCart,
  Menu,
  X,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSettings } from "@/contexts/SettingsContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const { settings } = useSettings();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutGrid className="w-5 h-5" /> },
    { path: "/pos", label: "POS", icon: <ShoppingCart className="w-5 h-5" /> },
    { path: "/inventory", label: "Inventory", icon: <Package className="w-5 h-5" /> },
    { path: "/clients", label: "Clients", icon: <Users className="w-5 h-5" /> },
    { path: "/transactions", label: "Transactions", icon: <Receipt className="w-5 h-5" /> },
    { path: "/reports", label: "Reports", icon: <BarChart4 className="w-5 h-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const NavContent = () => (
    <>
      <div className="px-3 py-4">
        <h1 className="font-extrabold text-2xl tracking-tight text-primary">
          {settings.storeName}
        </h1>
      </div>
      <div className="space-y-1 px-3">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            onClick={() => setOpen(false)}
          >
            <Button
              variant={location.pathname === item.path ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                location.pathname === item.path 
                  ? "theme-accent-bg text-white" 
                  : "hover:bg-theme-sidebar-hover"
              )}
              style={{
                backgroundColor: location.pathname === item.path 
                  ? 'var(--theme-accent-color)' 
                  : undefined
              }}
            >
              {item.icon}
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex theme-bg">
      {isMobile ? (
        <>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                className="fixed top-4 left-4 z-50 p-2"
                size="icon"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 pt-10 w-[250px] theme-sidebar-bg">
              <NavContent />
            </SheetContent>
          </Sheet>
          <div className="w-full overflow-auto">
            <main className="flex-1 p-4 md:p-6">
              {children}
            </main>
          </div>
        </>
      ) : (
        <>
          <div className="w-[250px] h-screen overflow-y-auto fixed left-0 top-0 theme-sidebar-bg">
            <NavContent />
          </div>
          <div className="flex-1 ml-[250px] overflow-auto h-screen">
            <main className="p-6">
              {children}
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
