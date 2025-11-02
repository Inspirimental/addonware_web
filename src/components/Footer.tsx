import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-muted/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-primary mb-2">addonware</h3>
              <p className="text-muted-foreground">
                Digitale Transformation mit Orientierung. Für Unternehmen, Verwaltungen und soziale Träger.
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Leistungen</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/services/strategie" className="hover:text-primary transition-colors">Strategieberatung</Link></li>
              <li><Link to="/services/projektbegleitung" className="hover:text-primary transition-colors">Projektbegleitung</Link></li>
              <li><Link to="/services/datenschutz" className="hover:text-primary transition-colors">Datenschutz & IT-Sicherheit</Link></li>
              <li><Link to="/services/prozessberatung" className="hover:text-primary transition-colors">Prozessberatung</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/impressum" className="hover:text-primary transition-colors">Impressum</Link></li>
              <li><Link to="/datenschutz" className="hover:text-primary transition-colors">Datenschutz</Link></li>
              <li><Link to="/agb" className="hover:text-primary transition-colors">AGB</Link></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div>
            © 2024 addonware. Alle Rechte vorbehalten.
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center gap-2">
              🇩🇪 Deutschland | 🇨🇭 Schweiz
            </span>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          <p>
            <strong>DSGVO-Hinweis:</strong> Ihre Daten werden ausschließlich für die Bearbeitung Ihrer Anfrage verwendet und nicht an Dritte weitergegeben. 
            Für Schweizer Kunden gelten zusätzlich die Bestimmungen des schweizer Datenschutzgesetzes (DSG).
          </p>
        </div>
      </div>
    </footer>
  );
};