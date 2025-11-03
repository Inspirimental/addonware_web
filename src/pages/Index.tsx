import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Configurator } from "@/components/Configurator";
import { SEO } from "@/components/SEO";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const Index = () => {
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);

  const handleConfiguratorOpen = () => {
    setIsConfiguratorOpen(true);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Addonware",
    "url": "https://addonware.de",
    "logo": "https://addonware.de/addonware%20Logo.png",
    "description": "Experten für digitale Transformation, IT-Strategie und Compliance",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "DE"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "German"
    },
    "sameAs": []
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Digitale Transformation & IT-Beratung"
        description="Experten für digitale Transformation, IT-Strategie und Compliance. Wir unterstützen Unternehmen bei der Digitalisierung und Optimierung ihrer IT-Infrastruktur."
        keywords="Digitale Transformation, IT-Beratung, IT-Strategie, Compliance, Digitalisierung, IT-Infrastruktur"
        url="/"
        type="website"
        author="addonware GmbH"
        publishedTime="2025-11-01T00:00:00+00:00"
        structuredData={structuredData}
      />
      <Navigation onConfiguratorOpen={handleConfiguratorOpen} />

      <main className="pt-16">
        <div>
          <Hero onConfiguratorOpen={handleConfiguratorOpen} />
          <section id="services" aria-label="Unsere Dienstleistungen">
            <Services />
          </section>
          <section id="contact" aria-label="Kontaktieren Sie uns">
            <Contact />
          </section>
        </div>
      </main>

      <Footer />
      
      {/* Configurator Dialog */}
      <Dialog open={isConfiguratorOpen} onOpenChange={setIsConfiguratorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Kostenlose Bedarfsanalyse</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfiguratorOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-6">
            <Configurator />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
