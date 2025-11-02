import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import Pricing from "./pages/Pricing";
import Partners from "./pages/Partners";
import QuestionnaireTransformation from "./pages/QuestionnaireTransformation";
import QuestionnaireFuehrung from "./pages/QuestionnaireFuehrung";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import AGB from "./pages/AGB";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import EmployeeDetail from "./pages/EmployeeDetail";
import NotFound from "./pages/NotFound";
import FuehrungskulturStrategie from "./pages/services/FuehrungskulturStrategie";
import StrukturCompliance from "./pages/services/StrukturCompliance";
import FachbereicheDigitalisierung from "./pages/services/FachbereicheDigitalisierung";
import KomplexitaetMeistern from "./pages/services/KomplexitaetMeistern";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/leistungen/fuehrungskultur-strategie" element={<FuehrungskulturStrategie />} />
          <Route path="/leistungen/struktur-compliance" element={<StrukturCompliance />} />
          <Route path="/leistungen/fachbereiche-digitalisierung" element={<FachbereicheDigitalisierung />} />
          <Route path="/leistungen/komplexitaet-meistern" element={<KomplexitaetMeistern />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/questionnaire" element={<QuestionnaireTransformation />} />
          <Route path="/umfrage/:slug" element={<QuestionnaireFuehrung />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/agb" element={<AGB />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/team/:id" element={<EmployeeDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
