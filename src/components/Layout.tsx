import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Trophy,
  Users,
  Settings,
  DollarSign,
  Newspaper,
  Files,
  Shield,
  Award,
  Menu,
  Moon,
  Sun,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import scaLogo from "../../public/sca_white.png";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";

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
  { icon: Files, label: "Website Content", path: "/admin/content" },
  { icon: Shield, label: "Shogun Clan", path: "/shogun" },
];

const NavContent = ({ onItemClick }: { onItemClick?: () => void }) => {
  const location = useLocation();

  return (
    <>
      <div className="px-5 py-6 md:px-6 md:py-8 border-b border-sidebar-border">
        <div className="flex items-center justify-center">
          <div className="rounded-sm bg-[#101916] px-3 py-2.5 dark:bg-transparent dark:p-0">
            <img src={scaLogo} alt="Short Circuit Arena" className="h-12 w-auto object-contain" />
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 md:p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === "/admin/content" ? location.pathname.startsWith(item.path) : location.pathname === item.path;
          const showSeparator = item.path === "/shogun";
          
          return (
            <div key={item.path ?? item.label}>
              {showSeparator && (
                <div className="my-2 border-t border-sidebar-border" />
              )}
              <Link
                to={item.path}
                onClick={onItemClick}
                className={cn(
                  "relative flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-sm transition-colors duration-200",
                  isActive
                    ? "bg-sidebar-accent text-foreground border-l-2 border-primary"
                    : "text-sidebar-foreground border-l-2 border-transparent hover:bg-sidebar-accent hover:text-foreground"
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

const AccountPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-sm border border-sidebar-border px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{user?.name || user?.ign}</p>
        <p className="truncate text-xs text-sidebar-foreground">{user?.email}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={signOut}
        disabled={signingOut}
        aria-label="Sign out"
        title="Sign out"
        className="shrink-0 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="w-5 h-5" />
      </Button>
    </div>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={scaLogo} alt="SCA" className="h-7 w-auto object-contain" />
          <span className="font-semibold text-sidebar-foreground">SCA Admin</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle color theme" className="text-sidebar-foreground hover:bg-primary/10 hover:text-primary">
            {mounted && resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-sidebar-foreground">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-72 flex-col p-0 bg-sidebar border-sidebar-border">
            <NavContent onItemClick={() => setMobileMenuOpen(false)} />
            <div className="border-t border-sidebar-border p-4">
              <AccountPanel />
            </div>
          </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-sidebar border-r border-sidebar-border flex-col fixed h-full">
        <NavContent />
        <div className="space-y-3 border-t border-sidebar-border p-4">
          <AccountPanel />
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-sm border border-sidebar-border px-4 py-3 text-sm font-medium text-sidebar-foreground transition-colors hover:border-primary/40 hover:bg-sidebar-accent hover:text-foreground"
          >
            {mounted && resolvedTheme === "dark" ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
            <span>{mounted && resolvedTheme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative flex-1 overflow-auto lg:ml-64 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
};
