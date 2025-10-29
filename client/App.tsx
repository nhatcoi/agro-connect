import "./global.css";
import "./i18n";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useLenis } from "./hooks/useLenis";
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Documentation from "./pages/Documentation";
import Features from "./pages/Features";
import WIPFeature from "@/components/WIPFeature";
import Traceability from "./pages/Traceability";
import QRDemo from "./pages/QRDemo";
import DashboardRoutes from "./pages/DashboardRoutes";
import SidebarDemo from "./pages/SidebarDemo";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";

const queryClient = new QueryClient();

const AppContent = () => {
  useLenis(); // Initialize Lenis smooth scroll
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/traceability/:productId" element={<Traceability />} />
        <Route path="/qr-demo" element={<QRDemo />} />
        <Route path="/features" element={<Features />} />
        <Route path="/wip" element={<WIPFeature />} />
        <Route path="/me/*" element={<DashboardRoutes />} />
        <Route path="/sidebar-demo" element={<SidebarDemo />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
