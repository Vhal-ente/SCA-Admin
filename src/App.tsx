import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tournaments from "./pages/Tournaments";
import League from "./pages/League";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Finance from "./pages/Finance";
import News from "./pages/News";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
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
          <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/tournaments" element={<Layout><Tournaments /></Layout>} />
          <Route path="/league" element={<Layout><League /></Layout>} />
          <Route path="/users" element={<Layout><Users /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/finance" element={<Layout><Finance /></Layout>} />
          <Route path="/news" element={<Layout><News /></Layout>} />
          <Route path="/admin/content/*" element={<Layout><Content /></Layout>} />
          <Route path="/shogun" element={<Layout><Shogun /></Layout>} />
          <Route path="/admin/shogun/*" element={<Layout><Shogun /></Layout>} />
          <Route path="/games" element={<Layout><Games /></Layout>} />
          <Route path="/schedule" element={<Layout><Schedule /></Layout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
