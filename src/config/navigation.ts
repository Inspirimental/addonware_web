export interface SubMenuItem {
  label: string;
  href: string;
  divider?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  submenu?: SubMenuItem[];
}

export const navItems: NavItem[] = [
  {
    label: "Leistungen",
    href: "/services",
    submenu: [
      { label: "Führungskultur & Strategie", href: "/leistungen/fuehrungskultur-strategie" },
      { label: "Struktur & Compliance", href: "/leistungen/struktur-compliance" },
      { label: "Fachbereiche & Digitalisierung", href: "/leistungen/fachbereiche-digitalisierung" },
      { label: "Komplexität meistern", href: "/leistungen/komplexitaet-meistern" }
    ]
  },
  {
    label: "Best Practice",
    href: "/case-studies",
    submenu: [
      { label: "Beratungspakete", href: "/pricing" },
      { label: "Erfolgsgeschichten", href: "/case-studies" },
      { label: "Netzwerkpartner", href: "/partners" },
      { label: "Wo stehen Sie", href: "/questionnaire" }
    ]
  },
  {
    label: "Über uns",
    href: "/about"
  },
  { label: "Kontakt", href: "/contact" }
];

export const footerLinks = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AGB", href: "/agb" },
];
