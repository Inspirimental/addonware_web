import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://addonware.de';

const staticRoutes = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/services', priority: 0.9, changefreq: 'weekly' },
  { path: '/about', priority: 0.8, changefreq: 'monthly' },
  { path: '/contact', priority: 0.8, changefreq: 'monthly' },
  { path: '/case-studies', priority: 0.7, changefreq: 'weekly' },
  { path: '/pricing', priority: 0.7, changefreq: 'monthly' },
  { path: '/partners', priority: 0.6, changefreq: 'monthly' },
  { path: '/leistungen/fuehrungskultur-strategie', priority: 0.8, changefreq: 'monthly' },
  { path: '/leistungen/digitale-souveraenitaet-compliance', priority: 0.8, changefreq: 'monthly' },
  { path: '/leistungen/fachbereiche-digitalisierung', priority: 0.8, changefreq: 'monthly' },
  { path: '/leistungen/komplexitaet-meistern', priority: 0.8, changefreq: 'monthly' },
  { path: '/umfrage/fuehrung', priority: 0.6, changefreq: 'yearly' },
  { path: '/umfrage/digitale-souveraenitaet', priority: 0.6, changefreq: 'yearly' },
  { path: '/impressum', priority: 0.3, changefreq: 'yearly' },
  { path: '/datenschutz', priority: 0.3, changefreq: 'yearly' },
  { path: '/agb', priority: 0.3, changefreq: 'yearly' },
];

const generateSitemap = () => {
  const currentDate = new Date().toISOString().split('T')[0];

  const urlEntries = staticRoutes.map(route => `
  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${urlEntries}
</urlset>`;

  const publicPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(publicPath, sitemap, 'utf8');
  console.log('Sitemap generated successfully at:', publicPath);
};

generateSitemap();
