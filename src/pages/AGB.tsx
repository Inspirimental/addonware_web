import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const AGB = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation onConfiguratorOpen={() => {}} />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              Allgemeine Geschäftsbedingungen
            </h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <h2>§ 1 Geltungsbereich</h2>
              <p>
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen 
                der addonware GmbH (nachfolgend "Auftragnehmer") und ihren Auftraggebern 
                (nachfolgend "Auftraggeber") über Beratungsleistungen.
              </p>
              
              <h2>§ 2 Vertragsgegenstand</h2>
              <p>
                Gegenstand der Verträge sind Beratungsleistungen in den Bereichen:
              </p>
              <ul>
                <li>Strategieberatung und Zielbildentwicklung</li>
                <li>Projektbegleitung und Digitalisierung</li>
                <li>Datenschutz und Informationssicherheit</li>
                <li>Prozessberatung für den öffentlichen Bereich</li>
              </ul>
              
              <h2>§ 3 Vertragsschluss</h2>
              <p>
                Der Vertrag kommt durch Annahme eines schriftlichen Angebots des Auftragnehmers 
                durch den Auftraggeber zustande. Mündliche Nebenabreden bedürfen zu ihrer 
                Wirksamkeit der schriftlichen Bestätigung.
              </p>
              
              <h2>§ 4 Leistungserbringung</h2>
              <p>
                Der Auftragnehmer erbringt seine Leistungen nach den anerkannten Regeln der 
                Technik und mit der Sorgfalt eines ordentlichen Kaufmanns. Alle Leistungen 
                werden fachkundig und gewissenhaft ausgeführt.
              </p>
              
              <h2>§ 5 Mitwirkungspflichten des Auftraggebers</h2>
              <p>
                Der Auftraggeber stellt alle für die Leistungserbringung erforderlichen 
                Informationen und Unterlagen rechtzeitig zur Verfügung und gewährt den 
                erforderlichen Zugang zu seinen Systemen und Räumlichkeiten.
              </p>
              
              <h2>§ 6 Vergütung und Zahlungsbedingungen</h2>
              <p>
                Die Vergütung richtet sich nach der jeweiligen Vereinbarung. Sofern nicht 
                anders vereinbart, sind Rechnungen innerhalb von 14 Tagen nach Rechnungsstellung 
                ohne Abzug zur Zahlung fällig.
              </p>
              
              <h2>§ 7 Vertraulichkeit</h2>
              <p>
                Beide Parteien verpflichten sich, alle im Rahmen der Zusammenarbeit 
                bekannt gewordenen vertraulichen Informationen streng vertraulich zu 
                behandeln und nur für die Zwecke der Vertragserfüllung zu verwenden.
              </p>
              
              <h2>§ 8 Gewährleistung und Haftung</h2>
              <p>
                Der Auftragnehmer haftet für Schäden nur bei Vorsatz und grober Fahrlässigkeit. 
                Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen, soweit nicht 
                wesentliche Vertragspflichten verletzt werden.
              </p>
              
              <h2>§ 9 Kündigung</h2>
              <p>
                Dauerverträge können von beiden Parteien mit einer Frist von vier Wochen 
                zum Monatsende gekündigt werden. Das Recht zur außerordentlichen Kündigung 
                aus wichtigem Grund bleibt unberührt.
              </p>
              
              <h2>§ 10 Schlussbestimmungen</h2>
              <p>
                Es gilt deutsches Recht. Erfüllungsort und Gerichtsstand ist der Sitz des 
                Auftragnehmers. Sollten einzelne Bestimmungen dieser AGB unwirksam sein, 
                bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
              </p>
              
              <p className="text-sm text-muted-foreground mt-8">
                Stand: Dezember 2024
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AGB;