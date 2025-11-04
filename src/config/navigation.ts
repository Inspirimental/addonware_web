export interface SubMenuItem {
  label: string;
  href: string;
  divider?: boolean;
  icon?: string;
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
      { label: "Führungskultur & Strategie", href: "/leistungen/fuehrungskultur-strategie", icon: "Compass" },
      { label: "Digitale Souveränität & Compliance", href: "/leistungen/digitale-souveraenitaet-compliance", icon: "Shield" },
      { label: "Fachbereiche & Smarte Projekte", href: "/leistungen/fachbereiche-smarte-projekte", icon: "Lightbulb" },
      { label: "Komplexität meistern", href: "/leistungen/komplexitaet-meistern", icon: "Network" }
    ]
  },
  {
    label: "Best Practice",
    href: "/case-studies",
    submenu: [
      { label: "Beratungspakete", href: "/pricing", icon: "Package" },
      { label: "Erfolgsgeschichten", href: "/case-studies", icon: "Trophy" },
      { label: "Netzwerkpartner", href: "/partners", icon: "Users" },
      { label: "Wo stehen Sie", href: "/questionnaire", icon: "ClipboardCheck" }
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
