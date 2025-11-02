import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const Datenschutz = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation onConfiguratorOpen={() => {}} />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              Datenschutzerklärung
            </h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <h2 className="text-2xl font-bold mt-8 mb-4">Verantwortlichkeit</h2>
              <p>
                Die verantwortliche Stelle im Sinne der Datenschutzgesetze, insbesondere der 
                EU-Datenschutzgrundverordnung (DSGVO), ist:
              </p>
              <p>
                Jörg Flügge<br />
                Saalstraße 16<br />
                07318 Saalfeld
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Ihre Betroffenenrechte</h2>
              <p>
                Unter den angegebenen Kontaktdaten unseres Datenschutzbeauftragten können Sie jederzeit 
                folgende Rechte ausüben:
              </p>
              <ul>
                <li>Auskunft über Ihre bei uns gespeicherten Daten und deren Verarbeitung,</li>
                <li>Berichtigung unrichtiger personenbezogener Daten,</li>
                <li>Löschung Ihrer bei uns gespeicherten Daten,</li>
                <li>Einschränkung der Datenverarbeitung, sofern wir Ihre Daten aufgrund gesetzlicher Pflichten noch nicht löschen dürfen,</li>
                <li>Widerspruch gegen die Verarbeitung Ihrer Daten bei uns und</li>
                <li>Datenübertragbarkeit, sofern Sie in die Datenverarbeitung eingewilligt haben oder einen Vertrag mit uns abgeschlossen haben.</li>
              </ul>
              
              <p>
                Sofern Sie uns eine Einwilligung erteilt haben, können Sie diese jederzeit mit Wirkung 
                für die Zukunft widerrufen.
              </p>
              
              <p>
                Sie können sich jederzeit mit einer Beschwerde an die für Sie zuständige Aufsichtsbehörde 
                wenden. Ihre zuständige Aufsichtsbehörde richtet sich nach dem Bundesland Ihres Wohnsitzes, 
                Ihrer Arbeit oder der mutmaßlichen Verletzung. Eine Liste der Aufsichtsbehörden (für den 
                nichtöffentlichen Bereich) mit Anschrift finden Sie unter:{" "}
                <a href="https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html" 
                   target="_blank" rel="noopener noreferrer">
                  https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html
                </a>
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Zwecke der Datenverarbeitung</h2>
              <p>
                Zum Zweck der Datenverarbeitung durch die verantwortliche Stelle und Dritte verarbeiten 
                wir Ihre personenbezogenen Daten nur zu den in dieser Datenschutzerklärung genannten 
                Zwecken. Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den genannten 
                Zwecken findet nicht statt. Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:
              </p>
              <ul>
                <li>Sie Ihre ausdrückliche Einwilligung dazu erteilt haben,</li>
                <li>die Verarbeitung zur Abwicklung eines Vertrags mit Ihnen erforderlich ist,</li>
                <li>die Verarbeitung zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist,</li>
                <li>die Verarbeitung zur Wahrung berechtigter Interessen erforderlich ist und kein Grund zur Annahme besteht, dass Sie ein überwiegendes schutzwürdiges Interesse an der Nichtweitergabe Ihrer Daten haben.</li>
              </ul>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Löschung und Sperrung der Daten</h2>
              <p>
                Wir halten uns an die Grundsätze der Datenvermeidung und Datensparsamkeit. Wir speichern 
                Ihre personenbezogenen Daten daher nur so lange, wie dies zur Erreichung der hier genannten 
                Zwecke erforderlich ist oder wie es die vom Gesetzgeber vorgesehenen vielfältigen 
                Speicherfristen vorsehen. Nach Fortfall des jeweiligen Zweckes bzw. Ablauf dieser Fristen 
                werden die entsprechenden Daten routinemäßig und entsprechend den gesetzlichen Vorschriften 
                gesperrt oder gelöscht.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Erfassung von Informationen</h2>
              <p>
                Wenn Sie auf unsere Website zugreifen, werden automatisch mittels eines Cookies 
                Informationen allgemeiner Natur erfasst. Diese Informationen (Server-Logfiles) beinhalten 
                etwa die Art des Webbrowsers, das verwendete Betriebssystem, den Domainnamen Ihres 
                Internet-Service-Providers und ähnliches. Hierbei handelt es sich ausschließlich um 
                Informationen, welche keine Rückschlüsse auf Ihre Person zulassen.
              </p>
              
              <p>
                Diese Informationen sind technisch notwendig, um von Ihnen angeforderte Inhalte von 
                Webseiten korrekt auszuliefern und fallen bei Nutzung des Internets zwingend an. 
                Sie werden insbesondere zu folgenden Zwecken verarbeitet:
              </p>
              <ul>
                <li>Sicherstellung eines problemlosen Verbindungsaufbaus der Website,</li>
                <li>Sicherstellung einer reibungslosen Nutzung unserer Website,</li>
                <li>Auswertung der Systemsicherheit und -stabilität sowie</li>
                <li>zu weiteren administrativen Zwecken.</li>
              </ul>
              
              <p>
                Die Verarbeitung Ihrer personenbezogenen Daten basiert auf unserem berechtigten Interesse 
                aus den vorgenannten Zwecken zur Datenerhebung. Wir verwenden Ihre Daten nicht, um 
                Rückschlüsse auf Ihre Person zu ziehen. Empfänger der Daten sind nur die verantwortliche 
                Stelle und ggf. Auftragsverarbeiter.
              </p>
              
              <p>
                Anonyme Informationen dieser Art werden von uns ggfs. statistisch ausgewertet, um unseren 
                Internetauftritt und die dahinterstehende Technik zu optimieren.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Kontaktformular</h2>
              <p>
                Treten Sie bezüglich Fragen jeglicher Art per E-Mail oder Kontaktformular mit uns in 
                Kontakt, erteilen Sie uns zum Zwecke der Kontaktaufnahme Ihre freiwillige Einwilligung. 
                Hierfür ist die Angabe einer validen E-Mail-Adresse erforderlich.
              </p>
              
              <p>
                Diese dient der Zuordnung der Anfrage und der anschließenden Beantwortung derselben. 
                Die Angabe weiterer Daten ist optional. Die von Ihnen gemachten Angaben werden zum Zwecke 
                der Bearbeitung der Anfrage sowie für mögliche Anschlussfragen gespeichert. Nach Erledigung 
                der von Ihnen gestellten Anfrage werden personenbezogene Daten automatisch gelöscht.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Verwendung von Google Maps</h2>
              <p>
                Diese Website verwendet Google Maps API, um geografische Informationen visuell darzustellen.
              </p>
              
              <p>
                Bei der Nutzung von Google Maps werden von Google auch Daten über die Nutzung der 
                Kartenfunktionen durch Besucher erhoben, verarbeitet und genutzt. Nähere Informationen 
                über die Datenverarbeitung durch Google können Sie{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                  den Google-Datenschutzhinweisen
                </a>{" "}
                entnehmen.
              </p>
              
              <p>
                Dort können Sie im Datenschutzcenter auch Ihre persönlichen Datenschutz-Einstellungen verändern.
              </p>
              
              <p>
                Ausführliche Anleitungen zur Verwaltung der eigenen Daten im Zusammenhang mit Google-Produkten{" "}
                <a href="https://support.google.com/accounts/answer/3024190" target="_blank" rel="noopener noreferrer">
                  finden Sie hier
                </a>.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Änderung unserer Datenschutzbestimmungen</h2>
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen 
                rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der 
                Datenschutzerklärung umzusetzen, z.B. bei der Einführung neuer Services.
              </p>
              
              <p>
                Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Fragen an den Datenschutzbeauftragten</h2>
              <p>
                Wenn Sie Fragen zum Datenschutz haben, schreiben Sie uns bitte eine E-Mail oder wenden 
                Sie sich direkt an die für den Datenschutz verantwortliche Person in unserer Organisation:
              </p>
              
              <p>
                <strong>E-Mail:</strong> info@addonware.de
              </p>
              
              <p className="text-sm text-muted-foreground">
                <em>
                  Die Datenschutzerklärung wurde mit dem{" "}
                  <a href="https://www.activemind.de/datenschutz/generatoren/datenschutzerklaerung/" 
                     target="_blank" rel="noopener noreferrer">
                    Datenschutzerklärungsgenerator der activeMind AG
                  </a>{" "}
                  erstellt.
                </em>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Datenschutz;