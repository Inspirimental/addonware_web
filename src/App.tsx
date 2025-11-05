import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const CaseStudies = lazy(() => import("./pages/best-practice/CaseStudies"));
const CaseStudyDetail = lazy(() => import("./pages/best-practice/CaseStudyDetail"));
const Pricing = lazy(() => import("./pages/best-practice/Pricing"));
const Partners = lazy(() => import("./pages/best-practice/Partners"));
const QuestionnaireTransformation = lazy(() => import("./pages/QuestionnaireTransformation"));
const QuestionnaireFuehrung = lazy(() => import("./pages/QuestionnaireFuehrung"));
const QuestionnaireDigitaleSouveraenitaet = lazy(() => import("./pages/QuestionnaireDigitaleSouveraenitaet"));
const Impressum = lazy(() => import("./pages/Impressum"));
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const AGB = lazy(() => import("./pages/AGB"));
const Admin = lazy(() => import("./pages/Admin"));
const Auth = lazy(() => import("./pages/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const EmployeeDetail = lazy(() => import("./pages/EmployeeDetail"));
const FuehrungskulturStrategie = lazy(() => import("./pages/services/FuehrungskulturStrategie"));
const DigitaleSouveraenitaetCompliance = lazy(() => import("./pages/services/DigitaleSouveraenitaetCompliance"));
const FachbereicheSmarteProjekte = lazy(() => import("./pages/services/FachbereicheSmarteProjekte"));
const KomplexitaetMeistern = lazy(() => import("./pages/services/KomplexitaetMeistern"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen" role="status" aria-live="polite"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div><span className="sr-only">Seite wird geladen...</span></div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/leistungen/fuehrungskultur-strategie" element={<FuehrungskulturStrategie />} />
          <Route path="/leistungen/digitale-souveraenitaet-compliance" element={<DigitaleSouveraenitaetCompliance />} />
          <Route path="/leistungen/struktur-compliance" element={<DigitaleSouveraenitaetCompliance />} />
          <Route path="/leistungen/fachbereiche-smarte-projekte" element={<FachbereicheSmarteProjekte />} />
          <Route path="/leistungen/fachbereiche-digitalisierung" element={<FachbereicheSmarteProjekte />} />
          <Route path="/leistungen/komplexitaet-meistern" element={<KomplexitaetMeistern />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/questionnaire" element={<QuestionnaireTransformation />} />
          <Route path="/umfrage/fuehrung" element={<QuestionnaireFuehrung />} />
          <Route path="/umfrage/digitale-souveraenitaet" element={<QuestionnaireDigitaleSouveraenitaet />} />
          <Route path="/umfrage/digitalisierung" element={<QuestionnaireDigitaleSouveraenitaet />} />
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
        </Suspense>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
