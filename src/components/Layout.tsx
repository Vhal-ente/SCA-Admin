import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Trophy, 
  Users, 
  Settings, 
  DollarSign, 
  Newspaper,
  Calendar,
  Gamepad2,
  Shield,
  Award,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Trophy, label: "Tournaments", path: "/tournaments" },
  { icon: Award, label: "League", path: "/league" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: DollarSign, label: "Finance", path: "/finance" },
  { icon: Newspaper, label: "News", path: "/news" },
  { icon: Shield, label: "Shogun", path: "/shogun" },
  { icon: Gamepad2, label: "Games and players", path: "/games" },
  { icon: Calendar, label: "Schedule", path: "/schedule" },
];

const NavContent = ({ onItemClick }: { onItemClick?: () => void }) => {
  const location = useLocation();

  return (
    <>
      <div className="p-4 md:p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-primary flex items-center justify-center">
            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-sidebar-foreground">Admin</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 md:p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const showSeparator = item.path === "/shogun";
          
          return (
            <div key={item.path}>
              {showSeparator && (
                <div className="my-2 border-t border-sidebar-border" />
              )}
              <Link
                to={item.path}
                onClick={onItemClick}
                className={cn(
                  "flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-all duration-300",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm md:text-base">{item.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>
    </>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <Trophy className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground">Admin Panel</span>
        </div>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-sidebar border-sidebar-border">
            <NavContent onItemClick={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-sidebar border-r border-sidebar-border flex-col fixed h-full">
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:ml-64 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
};
