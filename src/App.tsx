import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import Coletas from "./pages/Coletas";
import ColetaDetalhe from "./pages/ColetaDetalhe";
import PontosColeta from "./pages/PontosColeta";
import Perfil from "./pages/Perfil";
import Admin from "./pages/Admin";
import Sobre from "./pages/Sobre";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/coletas" element={<Coletas />} />
          <Route path="/coletas/:id" element={<ColetaDetalhe />} />
          <Route path="/pontos-coleta" element={<PontosColeta />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/sobre" element={<Sobre />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
