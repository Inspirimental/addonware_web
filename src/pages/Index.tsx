import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Configurator } from "@/components/Configurator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const Index = () => {
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);

  const handleConfiguratorOpen = () => {
    setIsConfiguratorOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation onConfiguratorOpen={handleConfiguratorOpen} />

      <main className="pt-16">
        <article>
          <Hero onConfiguratorOpen={handleConfiguratorOpen} />
          <section id="services" aria-label="Unsere Dienstleistungen">
            <Services />
          </section>
          <section id="contact" aria-label="Kontaktieren Sie uns">
            <Contact />
          </section>
        </article>
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
