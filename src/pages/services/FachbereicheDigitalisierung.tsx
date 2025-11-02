import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle, ArrowRight, X, Workflow, Zap, Users2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Configurator } from "@/components/Configurator";

const FachbereicheDigitalisierung = () => {
  const navigate = useNavigate();
  const [showConfigurator, setShowConfigurator] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation onConfiguratorOpen={() => setShowConfigurator(true)} />

      <main className="flex-1">
        <section className="relative py-24 bg-gradient-to-br from-slate-50 via-cyan-50/30 to-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
                Fachbereiche & Digitalisierung
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 font-light">
                Wandel sichtbar machen – dort, wo er wirkt
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mb-8">
                Digitalisierung findet nicht in der IT-Abteilung statt – sondern dort, wo gearbeitet wird.
                Wir begleiten Ihre Fachbereiche dabei, digitale Tools wirklich zu nutzen, Prozesse zu verbessern
                und Veränderung gemeinsam zu gestalten.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => setShowConfigurator(true)}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  Jetzt Beratungsgespräch vereinbaren
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/contact")}
                >
                  Unverbindlich anfragen
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900">
                Unsere Leistungen im Überblick
              </h2>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <Card className="border-2 hover:border-primary transition-colors">
                  <CardContent className="pt-6">
                    <Workflow className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-3 text-slate-900">
                      Prozessdigitalisierung
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Analoge Abläufe digital abbilden – ohne die Menschen aus den Augen zu
                      verlieren, die damit arbeiten müssen.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary transition-colors">
                  <CardContent className="pt-6">
                    <Zap className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-3 text-slate-900">
                      Tool-Einführung & Akzeptanz
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Neue Software einführen, alte Gewohnheiten ablösen – mit Methodik,
                      Geduld und klarer Kommunikation.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary transition-colors">
                  <CardContent className="pt-6">
                    <Users2 className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-3 text-slate-900">
                      Change Management
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Veränderung begleiten – nicht nur technisch, sondern vor allem menschlich
                      und organisational.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-slate-900">
                  Warum ist das wichtig?
                </h3>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    Digitalisierung scheitert selten an der Technik – sondern daran, dass Fachbereiche
                    nicht abgeholt werden. Dass Tools eingeführt, aber nicht genutzt werden. Dass der
                    Alltag weiterläuft wie bisher, nur mit mehr Systemen.
                  </p>
                  <p>
                    Wir sorgen dafür, dass Digitalisierung dort ankommt, wo sie wirken soll: bei den
                    Menschen, die täglich mit den Prozessen arbeiten.
                  </p>
                </div>

                <div className="bg-cyan-50 border-l-4 border-primary p-6 rounded-r-lg">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Unser Ansatz</h4>
                      <p className="text-slate-700">
                        Wir moderieren zwischen Fachbereichen und IT, begleiten Einführungen operativ
                        und schaffen Akzeptanz durch Transparenz und Beteiligung.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                Bereit für den nächsten Schritt?
              </h2>
              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                Lassen Sie uns gemeinsam klären, wie wir Ihre Fachbereiche bei der
                Digitalisierung unterstützen können.
              </p>
              <Button
                size="lg"
                onClick={() => setShowConfigurator(true)}
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                Jetzt Beratungsgespräch vereinbaren
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Dialog open={showConfigurator} onOpenChange={setShowConfigurator}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setShowConfigurator(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <Configurator />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FachbereicheDigitalisierung;
