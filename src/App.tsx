import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import RequireStaff from "@/components/RequireStaff";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tournaments from "./pages/Tournaments";
import League from "./pages/League";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Finance from "./pages/Finance";
import News from "./pages/News";
import LoginPage from "./pages/Login";
import Games from "./pages/Games";
import Schedule from "./pages/Schedule";
import Shogun from "./pages/Shogun";
import Content from "./pages/Content";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "next-themes";
import { applyBrandColor, getSavedBrandColor } from "./lib/brand-theme";

const queryClient = new QueryClient();

applyBrandColor(getSavedBrandColor());

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
          <Routes>
          <Route path="/" element={<RequireStaff><Layout><Dashboard /></Layout></RequireStaff>} />
          <Route path="/tournaments" element={<RequireStaff><Layout><Tournaments /></Layout></RequireStaff>} />
          <Route path="/league" element={<RequireStaff><Layout><League /></Layout></RequireStaff>} />
          <Route path="/users" element={<RequireStaff><Layout><Users /></Layout></RequireStaff>} />
          <Route path="/settings" element={<RequireStaff><Layout><Settings /></Layout></RequireStaff>} />
          <Route path="/finance" element={<RequireStaff><Layout><Finance /></Layout></RequireStaff>} />
          <Route path="/news" element={<RequireStaff><Layout><News /></Layout></RequireStaff>} />
          <Route path="/admin/content/*" element={<RequireStaff><Layout><Content /></Layout></RequireStaff>} />
          <Route path="/shogun" element={<RequireStaff><Layout><Shogun /></Layout></RequireStaff>} />
          <Route path="/admin/shogun/*" element={<RequireStaff><Layout><Shogun /></Layout></RequireStaff>} />
          <Route path="/games" element={<RequireStaff><Layout><Games /></Layout></RequireStaff>} />
          <Route path="/schedule" element={<RequireStaff><Layout><Schedule /></Layout></RequireStaff>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
