import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";

// Public Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyToken from "./pages/VerifyToken";
import CompleteProfile from "./pages/CompleteProfile";
import NotFound from "./pages/NotFound";

// Authenticated Pages
import Dashboard from "./pages/Dashboard";
import Scanner from "./pages/Scanner";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import CardDetail from "./pages/CardDetail";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-token" element={<VerifyToken />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              
              {/* Authenticated Routes */}
              <Route path="/dashboard" element={
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              } />
              <Route path="/scanner" element={
                <AuthenticatedLayout>
                  <Scanner />
                </AuthenticatedLayout>
              } />
              <Route path="/collections" element={
                <AuthenticatedLayout>
                  <Collections />
                </AuthenticatedLayout>
              } />
              <Route path="/collections/:id" element={
                <AuthenticatedLayout>
                  <CollectionDetail />
                </AuthenticatedLayout>
              } />
              <Route path="/cards/:id" element={
                <AuthenticatedLayout>
                  <CardDetail />
                </AuthenticatedLayout>
              } />
              <Route path="/profile" element={
                <AuthenticatedLayout>
                  <Profile />
                </AuthenticatedLayout>
              } />
              <Route path="/marketplace" element={
                <AuthenticatedLayout>
                  <Marketplace />
                </AuthenticatedLayout>
              } />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
