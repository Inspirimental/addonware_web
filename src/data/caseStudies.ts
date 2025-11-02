import { Factory, Car, Database, Lightbulb, Target, Shield, Building, Users, Cog, LucideIcon } from "lucide-react";

export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  category: string;
  icon: LucideIcon;
  challenge: string;
  solution: string;
  result: string;
  duration: string;
  date: string;
  tags: string[];
  company: string;
  detailedDescription?: string;
  technologies?: string[];
  outcomes?: string[];
  imageUrl?: string;
}

export const caseStudies: CaseStudy[] = [
  // Smart Factory
  {
    id: "noah-arbeitsplattform",
    title: "Digitale Arbeitsplattform NOAH",
    industry: "Drehtechnik & Fertigung",
    category: "Smart Factory",
    icon: Factory,
    challenge: "Vernetzung aller CNC-Maschinen und Mitarbeiter-Arbeitsplätze für optimale Maschinenauslastung",
    solution: "Entwicklung einer internen Arbeitsplattform mit KI-basierter Auftragssteuerung",
    result: "15% Senkung der Rüstkosten, 80% weniger Archivierungskosten, 90% weniger Suchkosten",
    duration: "12 Monate",
    date: "2018-01-01",
    tags: ["Industrie 4.0", "KI", "Prozessoptimierung"],
    company: "Drehtechnik Jakusch GmbH",
    detailedDescription: "Industrie 4.0 bestimmt maßgeblich die Zukunftsfähigkeit der Drehtechnik Jakusch GmbH. Seit 2016 setzt das Unternehmen auf digitale Technologien und hat damit ungeahnte Interaktions- und Gestaltungsräume gewonnen. Alle CNC-Maschinen und Mitarbeiter-Arbeitsplätze sind heute vernetzt und an die Datenerfassung angeschlossen. Alle Mitarbeiter nutzen die interne Arbeitsplatzform 'NOAH'. Der Einsatz von KI sorgt für eine optimale Maschinenauslastung und eine Auftragssteuerung. Die Produktion wird intelligent geplant, überwacht und dokumentiert – auch mit dem Mobiltelefon.",
    technologies: ["KI-basierte Auftragssteuerung", "CNC-Maschinenvernetzung", "Mobile Anwendungen", "Datenerfassung"],
    outcomes: ["15% Senkung der Rüstkosten", "80% Reduktion der Archivierungskosten", "90% weniger Suchkosten", "Optimale Maschinenauslastung"]
  },
  {
    id: "qrs-qualitaetssystem",
    title: "Qualitätssystem Röntgenstrahler QRS",
    industry: "Medizintechnik",
    category: "Smart Factory",
    icon: Shield,
    challenge: "Lückenlose digitale Prozessdokumentation bei reduziertem Personalaufwand",
    solution: "Digitaler Zwilling für jede Röntgenröhre mit virtueller Planung",
    result: "95% Reduktion der Fehleranalyseaufwände, von 10 Min auf 2 Sek pro Prüfung",
    duration: "12 Monate",
    date: "2018-06-01",
    tags: ["Digitaler Zwilling", "Qualitätssicherung", "Automatisierung"],
    company: "Petrick GmbH",
    detailedDescription: "Die Petrick GmbH Bad Blankenburg nutzt den systemischen Ansatz von BX:SMART FACTORY. Neben der Kostenreduktion durch Prozessoptimierung rückte schnell das firmeninterne Produktcontrolling in den Fokus. Die individuell entwickelte digitale Lösung wurde gemeinsam entwickelt und erfolgreich eingeführt. Das QRS erzeugt für jede Röntgenröhre ein virtuelles Abbild (Digitaler Zwilling).",
    technologies: ["Digitaler Zwilling", "Sensordatenerfassung", "Simulationsmodelle", "Automatisierte Qualitätsprüfung"],
    outcomes: ["95% Reduktion der Fehleranalyseaufwände", "Zeitreduktion von 10 Min auf 2 Sek pro Prüfung", "Lückenlose Prozessdokumentation", "Erhöhte Transparenz und Effizienz"]
  },
  {
    id: "mixed-reality-schweissen",
    title: "Mixed Reality in der Fabrik",
    industry: "Schweißtechnik",
    category: "Smart Factory", 
    icon: Lightbulb,
    challenge: "Entwicklung autonomer Schweißzellen mit digitaler Programmierung",
    solution: "Augmented Reality-Steuerung mit HoloLens 2 für WAAM-Verfahren",
    result: "Praxisnahe Demonstration von Industrie 4.0 zum Anfassen",
    duration: "18 Monate",
    date: "2020-03-01",
    tags: ["Augmented Reality", "3D-Druck", "Innovation"],
    company: "Batix & Kompetenzzentrum Ilmenau",
    detailedDescription: "Gemeinsam mit dem Mittelstand 4.0-Kompetenzzentrum Ilmenau wurde eine Augmented Reality-Steuerung für eine Schweißanlage entwickelt. Der sogenannte 'Welding Cube' kommt bei der additiven Fertigung von Bauteilen aus Metall mittels Wire Arc Additive Manufacturing (WAAM) zum Einsatz. Die Software in Kombination mit der HoloLens 2 von Microsoft erzeugt direkt an der Anlage eine digitale Informationsebene innerhalb der realen Welt.",
    technologies: ["Microsoft HoloLens 2", "Wire Arc Additive Manufacturing", "Augmented Reality", "3D-Metallschweißen"],
    outcomes: ["Digitalisierung zum Anfassen", "Praxisnahe Demonstration", "Zukunftsweisende Schweißtechnologie", "Industrie 4.0 Integration"]
  },
  {
    id: "digitalstrategie-mms",
    title: "Digitalstrategie MMS 4.0",
    industry: "Mittelstand",
    category: "Smart Factory",
    icon: Target,
    challenge: "Strategische Neuausrichtung traditioneller Geschäftsmodelle bis 2025",
    solution: "Experten-Tandem-Modell mit prozessgesteuertem Ansatz",
    result: "Erfolgreiche digitale Transformation mit strukturierter Roadmap",
    duration: "10 Monate",
    date: "2019-09-01",
    tags: ["Digitalstrategie", "Transformation", "Beratung"],
    company: "MMS GmbH",
    detailedDescription: "MMS verfügt über ein ausgeprägtes Prozessdenken ('gelebtes Prozesshaus'). Die Digitalisierung soll alle Kern- und Unterstützungsprozesse des Unternehmens erfassen und zudem alle 'Insellösungen' ersetzen bzw. miteinander verknüpfen. Über 80% aller Digitalprojekte scheitern aufgrund schlechter Planung, unnötigen Druck oder mangelnde Professionalität. Batix konnte hier sein Tandem-Modell einbringen: Ein Organisationsentwickler und ein Softwareentwickler bilden zusammen das externe 'Expertenteam'.",
    technologies: ["Experten-Tandem-Modell", "Prozessmanagement", "Strategieberatung", "Change Management"],
    outcomes: ["Strukturierte Roadmap bis 2025", "Fokussierte Umsetzung", "Risikominimierung", "Nachhaltige Transformation"]
  },
  {
    id: "komos-kunststoff",
    title: "Digitalisierung Kunststoffbranche",
    industry: "Kunststoffverarbeitung",
    category: "Smart Factory",
    icon: Cog,
    challenge: "Optimierte Auftragsabwicklung durch smarte Software-Lösungen",
    solution: "Eingangsrechnungstool und Werkzeugverwaltung mit hoher Nutzerakzeptanz",
    result: "Zentrale Plattform für alle Rechnungen und präzise Werkzeugverwaltung",
    duration: "8 Monate",
    date: "2021-02-01",
    tags: ["Auftragsabwicklung", "Werkzeugverwaltung", "Automation"],
    company: "KOMOS GmbH",
    detailedDescription: "Als Auftragsfertiger von Stanz- und Drehteilen, Kunststoff-Spritzteilen und elektromechanischen Baugruppen bündelt KOMOS zahlreiche verschiedene Technologien unter einem Dach. Der Einstieg in die gemeinsame Zusammenarbeit zwischen KOMOS und Batix gelang durch die Einführung des Eingangsrechnungstools. Das Modul bündelt alle eingehenden Rechnungen zentral auf einer Plattform.",
    technologies: ["Eingangsrechnungstool", "Werkzeugverwaltungssystem", "Zentrale Plattform", "Prozessautomatisierung"],
    outcomes: ["Hohe Nutzerakzeptanz", "Zentrale Rechnungsbearbeitung", "Präzise Werkzeugverwaltung", "Nahtlose Integration"]
  },
  
  // Smart Mobility
  {
    id: "oepnv-integration",
    title: "ÖPNV Integrationslösung",
    industry: "Öffentlicher Verkehr",
    category: "Smart Mobility",
    icon: Car,
    challenge: "Abbildung aller Geschäftsprozesse in Verkehrsunternehmen",
    solution: "Webbasierte Anwendungen mit bidirektionalen Schnittstellen",
    result: "Echtzeit-Datenverfügung für alle Unternehmensbereiche",
    duration: "15 Monate",
    date: "2019-05-01",
    tags: ["ÖPNV", "Integration", "Echtzeit"],
    company: "Regionale Verkehrsbetriebe",
    detailedDescription: "Die Integrationslösung für Verkehrsunternehmen verfügt über eine Vielzahl komplett webbasierter Anwendungen, die speziell auf die Bedürfnisse und Anforderungen von regionalen und überregionalen, privaten sowie kommunalen Verkehrsunternehmen zugeschnitten sind. Die Lösung enthält individuelle bidirektionale Schnittstellen und lässt sich problemlos in eine vorhandene IT-Landschaft integrieren.",
    technologies: ["Webbasierte Anwendungen", "Bidirektionale Schnittstellen", "IBIS-Bus Integration", "Telematik-Systeme"],
    outcomes: ["Echtzeit-Datenverfügung", "Ortsunabhängiger Zugriff", "Nahtlose IT-Integration", "Umfassende Prozessabbildung"]
  },
  {
    id: "sonderbaumaschinen-telematik",
    title: "Telematik für Sonderbaumaschinen",
    industry: "Baumaschinen",
    category: "Smart Mobility",
    icon: Building,
    challenge: "Intelligente Vernetzung von Informationen für bessere Produktivität",
    solution: "All-in-One-Lösung mit 360-Grad-Flottenverwaltung und Echtzeit-Überwachung",
    result: "Signifikante Senkung der Verwaltungsaufwände und gesteigerte Maschinenproduktivität",
    duration: "12 Monate",
    date: "2020-08-01",
    tags: ["Telematik", "Flottenverwaltung", "IoT"],
    company: "Baumaschinenverleih",
    detailedDescription: "Moderne Telematik ist mehr als Fahrzeugortung – sie ist die intelligente Vernetzung von Informationen. Mit der flexiblen All-in-One-Lösung verbindet Batix die GPS-Verfolgung mit einer 360-Grad-Flottenverwaltung. Dazu gehören die Echtzeit-Ansicht des täglichen Maschinenbetriebs, die Erfassung relevanter Betriebsdaten und die sichere Übertragung der Daten.",
    technologies: ["GPS-Verfolgung", "360-Grad-Flottenverwaltung", "Echtzeit-Datenerfassung", "Sichere Datenübertragung"],
    outcomes: ["Reduzierte Verwaltungsaufwände", "Gesteigerte Produktivität", "Verbesserte Maschinenauslastung", "Transparente Einsatzhistorie"]
  },
  {
    id: "swiss-transit-lab",
    title: "Swiss Transit Lab - Open Doors",
    industry: "Öffentlicher Verkehr",
    category: "Smart Mobility",
    icon: Users,
    challenge: "Barrierefreier Zugang zur Mobilität für Menschen mit Beeinträchtigungen",
    solution: "Intelligente Vernetzung von Bussen mit Lift-Systemen über Haltewunschtaster",
    result: "Nahtloser Umstieg ohne Zeitverlust für Rollstuhlfahrer",
    duration: "6 Monate",
    date: "2021-11-01",
    tags: ["Barrierefreiheit", "IoT", "Vernetzung"],
    company: "Verkehrsbetriebe Schaffhausen",
    detailedDescription: "Mit dem Projekt 'Open Doors' verknüpft das Swiss Transit Lab Teile der Mobilitätskette intelligent miteinander. Die Busse der Verkehrsbetriebe Schaffhausen werden dabei mit dem Lift im Regionalbuszentrum vernetzt. Bei Betätigung des Rollstuhl-Haltewunschtasters wird das Signal an eine Software von Batix übermittelt, die den Lift zeitverzögert auf die obere Ebene bestellt.",
    technologies: ["IoT-Vernetzung", "Haltewunschtaster-System", "Lift-Steuerung", "Zeitgesteuerte Automation"],
    outcomes: ["Nahtloser Umstieg ohne Zeitverlust", "Verbesserte Barrierefreiheit", "Intelligente Mobilitätskette", "Erhöhte Selbständigkeit"]
  },
  
  // Smart Data  
  {
    id: "qrs-datenanalyse",
    title: "Qualitätsdatenanalyse QRS",
    industry: "Medizintechnik",
    category: "Smart Data",
    icon: Database,
    challenge: "Lückenlose Dokumentation und Datenintegration in der Röntgenröhrenproduktion",
    solution: "Digitales Qualitätsmanagementsystem mit direkter Datenerfassung",
    result: "Zeitaufwand für Qualitätsprüfung von 10 Min auf 2 Sek reduziert",
    duration: "8 Monate",
    date: "2018-10-01",
    tags: ["Qualitätsmanagement", "Datenintegration", "Effizienz"],
    company: "Petrick GmbH",
    detailedDescription: "Interne Audits, Prüfungen, Sicherheitsrundgänge, Betriebsbegehungen und weitere Vor-Ort-Kontrollen sind ein wichtiger Bestandteil des betrieblichen Qualitätsmanagements. Diese Prüfungen & Checks können besonders effizient mit einem digitalen und transparenten Datenmanagement durchgeführt werden. Das System erzeugt für jede Röntgenröhre ein virtuelles Abbild – einen digitalen Zwilling.",
    technologies: ["Digitales Qualitätsmanagementsystem", "Direkte Datenerfassung", "Digitaler Zwilling", "Automatisierte Prüfungen"],
    outcomes: ["Zeitreduktion von 10 Min auf 2 Sek", "Lückenlose Dokumentation", "Erhöhte Effizienz", "Verbesserte Transparenz"]
  },
  {
    id: "big-data-analyse",
    title: "Big Data Analyse & Optimierung",
    industry: "Diverses",
    category: "Smart Data",
    icon: Database,
    challenge: "Nutzung ungenutzter Datenbestände für Prozessoptimierung",
    solution: "Software zur sicheren Verarbeitung und Analyse großer Datenmengen",
    result: "Aufdeckung ungenutzter Potenziale und Investitionssicherheit",
    duration: "Ongoing",
    date: "2020-01-01",
    tags: ["Big Data", "Analytics", "Optimierung"],
    company: "Diverse Kunden",
    detailedDescription: "Unternehmen sammeln (un)bewusst unzählige Daten und Informationen und 'sitzen' buchstäblich auf einem Schatz. Paradoxerweise nutzen die Wenigsten diesen für die Optimierung von internen Prozessen. Software von Batix hilft Unternehmen große Datenmengen sicher zu verarbeiten und zu analysieren. Das schafft Investitionssicherheit und hebt ungeahnte Potenziale.",
    technologies: ["Big Data Analytics", "Datenvisualisierung", "Predictive Analytics", "Business Intelligence"],
    outcomes: ["Aufdeckung ungenutzter Potenziale", "Investitionssicherheit", "Prozessoptimierung", "Datenbasierte Entscheidungen"]
  }
];

export const getCaseStudyById = (id: string): CaseStudy | undefined => {
  return caseStudies.find(study => study.id === id);
};