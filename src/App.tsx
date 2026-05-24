import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Categories from "./pages/Categories";
import CategoryCaptions from "./pages/CategoryCaptions";
import Trending from "./pages/Trending";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import { AuthProvider } from "./hooks/useAuth";
import { PageTransition } from "./components/PageTransition";
import { PageProgress } from "./components/PageProgress";
import { ScrollRevealInit } from "./components/ScrollRevealInit";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <PageProgress />
            <ScrollRevealInit />
            <PageTransition>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:category" element={<CategoryCaptions />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/profile" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
