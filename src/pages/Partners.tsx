import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const partners = [
  {
    name: "Batix Software GmbH",
    url: "https://www.batix.de/",
    logo: "https://www.addonware.de/pic/16F6B4AE892.png"
  },
  {
    name: "Drehtechnik Jakusch GmbH", 
    url: "http://www.drehtechnik-jakusch.de/",
    logo: "https://www.addonware.de/pic/16F6B461E1B.png"
  },
  {
    name: "Bildungszentrum Saalfeld GmbH",
    url: "https://www.bz-saalfeld.de/",
    logo: "https://www.addonware.de/pic/16F6B4A70D4.png"
  },
  {
    name: "RSP GmbH",
    url: "http://www.rsp-germany.com/de/",
    logo: "https://www.addonware.de/pic/16F6B4AC14B.png"
  },
  {
    name: "Fabi-4.0 e.V.",
    url: "https://www.fab-i40.de/",
    logo: "https://www.addonware.de/pic/16F6B48349B.png"
  },
  {
    name: "IMMS GmbH",
    url: "https://www.imms.de/",
    logo: "https://www.addonware.de/pic/16F6B47B03D.png"
  },
  {
    name: "ITnet Thüringen e.V.",
    url: "https://www.itnet-th.de/",
    logo: "https://www.addonware.de/pic/16F6B4B1318.png"
  },
  {
    name: "SaaleWirtschaft e.V.",
    url: "https://www.saalewirtschaft.de/",
    logo: "https://www.addonware.de/pic/16FF702BBC7.png"
  },
  {
    name: "Thüringer Zentrum für Maschinenbau",
    url: "http://www.maschinenbau-thueringen.de/",
    logo: "https://www.addonware.de/pic/16F6B464491.png"
  },
  {
    name: "Mittelstand-Digital Zentrum Ilmenau",
    url: "https://www.kompetenzzentrum-ilmenau.digital/",
    logo: "https://www.addonware.de/pic/18286CC4DC0.png"
  },
  {
    name: "RKW Thüringen GmbH",
    url: "https://www.rkw-thueringen.de/",
    logo: "/lovable-uploads/333d11f9-4aed-4564-b278-a6a93ef9baa6.png"
  }
];

const Partners = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation onConfiguratorOpen={() => {}} />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Stark im Netzwerk
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Gemeinsam erreichen wir mehr. Unsere bewährten Netzwerkpartner ergänzen unser Leistungsspektrum 
                und ermöglichen es uns, Ihnen umfassende Lösungen aus einer Hand zu bieten.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partners.map((partner, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <a 
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-40 h-32 flex items-center justify-center bg-muted/30 rounded-lg p-3">
                          <img 
                            src={partner.logo}
                            alt={`${partner.name} Logo`}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                // Safe DOM manipulation without innerHTML
                                while (parent.firstChild) {
                                  parent.removeChild(parent.firstChild);
                                }
                                const fallbackDiv = document.createElement('div');
                                fallbackDiv.className = 'text-sm text-muted-foreground font-medium text-center';
                                fallbackDiv.textContent = partner.name;
                                parent.appendChild(fallbackDiv);
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {partner.name}
                          </h3>
                          <div className="flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                            <span className="text-sm">Website besuchen</span>
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </div>
                        </div>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">
                    Ihr Partner im Netzwerk?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Wir sind immer auf der Suche nach kompetenten Partnern, die unser Netzwerk bereichern. 
                    Sprechen Sie uns gerne an, wenn Sie Interesse an einer Zusammenarbeit haben.
                  </p>
                  <a 
                    href="/contact" 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    Partnerschaft anfragen
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Partners;