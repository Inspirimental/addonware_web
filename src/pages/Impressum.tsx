import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Impressum = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation onConfiguratorOpen={() => {}} />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              Impressum
            </h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <h2>ADDONWARE GmbH</h2>
              <p>
                Saalstraße 16<br />
                07318 Saalfeld<br />
                <br />
                Telefon: +49 (03671) 52 42 79 0<br />
                Telefax: +49 (03671) 52 77 11<br />
                E-Mail: info@addonware.de<br />
                Internet: www.addonware.de
              </p>
              
              <p>
                Eingetragen im Handelsregister HRB 305755 beim Amtsgericht Jena<br />
                Steuer-Nr.: 161 / 105 / 15611<br />
                Ust.-Ident.-Nr.: DE287564732
              </p>
              
              <p>
                <strong>Geschäftsführer:</strong> Jörg Flügge<br />
                <strong>Mitglied der</strong> Industrie- und Handelskammer Ostthüringen zu Gera<br />
                <strong>Inhaltlich Verantwortlicher:</strong> Jörg Flügge
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Copyrights</h2>
              <p>
                Die ADDONWARE GmbH ist bestrebt, in allen Publikationen die Urheberrechte der verwendeten 
                Grafiken, Tondokumente, Videosequenzen und Texte zu beachten, von ihr selbst erstellte 
                Grafiken, Tondokumente, Videosequenzen und Texte zu nutzen oder auf lizenzfreie Grafiken, 
                Tondokumente, Videosequenzen und Texte zurückzugreifen.
              </p>
              
              <p>
                Alle innerhalb des Internetangebotes genannten und ggf. durch Dritte geschützten Marken- 
                und Warenzeichen unterliegen uneingeschränkt den Bestimmungen des jeweils gültigen 
                Kennzeichenrechts und den Besitzrechten der jeweiligen eingetragenen Eigentümer. Allein 
                aufgrund der bloßen Nennung ist nicht der Schluss zu ziehen, dass Markenzeichen nicht 
                durch Rechte Dritter geschützt sind! Das Copyright für veröffentlichte, vom Autor selbst 
                erstellte Objekte bleibt allein beim Autor der Seiten. Eine Vervielfältigung oder 
                Verwendung solcher Grafiken, Tondokumente, Videosequenzen und Texte in anderen 
                elektronischen oder gedruckten Publikationen ist ohne ausdrückliche Zustimmung der 
                ADDONWARE GmbH nicht gestattet.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Datenschutz</h2>
              <p>
                In der Regel können Sie die Internet-Seiten von ADDONWARE besuchen, ohne dass diese 
                persönliche Daten von Ihnen benötigt. Das Unternehmen erfährt nur Ihre IP-Adresse, 
                die Internet-Seite, von der Sie kommen, die Seiten, die Sie anklicken, sowie das Datum 
                und die Dauer des Besuches. Diese Informationen werden ausschließlich zu statistischen 
                Zwecken genutzt. Als einzelner Nutzer bleiben Sie hierbei anonym.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Nutzung und Weitergabe persönlicher Daten</h2>
              <p>
                Verarbeitet und gespeichert werden diese Daten nur insoweit, wie dies für die Bearbeitung 
                der Anfrage notwendig ist. Eine Weitergabe der Daten an Dritte findet in keinem Fall statt 
                und sie werden von uns selbstverständlich nach den geltenden Datenschutzvorschriften behandelt.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Auskunft</h2>
              <p>
                Auf Anforderung teilen wir Ihnen ohne schuldhaftes Zögern, im Einklang mit geltendem Recht 
                mit, ob und welche persönlichen Daten über Sie bei uns gespeichert sind.
              </p>
              
              <p>
                <strong>Bitte beachten Sie:</strong> Unsere Webseiten können Links zu Webseiten anderer 
                Anbieter enthalten, auf die sich diese Datenschutzerklärung nicht erstreckt.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Impressum;