import jsPDF from 'jspdf';
import { resolveTeamImage } from '@/lib/teamImageResolver';

interface Employee {
  id: string;
  name: string;
  title: string;
  description: string;
  email: string;
  phone?: string;
  linkedin?: string;
  xing?: string;
  image_url?: string;
  cv_data?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
const LOGO_URL = '/lovable-uploads/4066824a-c7dc-49cb-88fc-3778a5013cf7.png';

export const generateEmployeeCV = async (employee: Employee): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const lineHeight = 7;
  let yPosition = margin;

  // Add logo in top-left (preserve aspect ratio)
  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  try {
    const img = await loadImage(LOGO_URL);
    const maxLogoWidth = 40;
    const scale = Math.min(1, maxLogoWidth / img.naturalWidth);
    const logoWidth = img.naturalWidth * scale;
    const logoHeight = img.naturalHeight * scale;
    doc.addImage(img, 'PNG', margin, yPosition, logoWidth, logoHeight);
    yPosition += logoHeight + 20;
  } catch (error) {
    console.log('Could not load logo, continuing without it');
  }

  // Helper function to add text with automatic line wrapping
  const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    doc.setFontSize(fontSize);
    
    const splitText = doc.splitTextToSize(text, pageWidth - 2 * margin);
    doc.text(splitText, margin, yPosition);
    yPosition += splitText.length * lineHeight + 5;
  };

  const addSection = (title: string) => {
    yPosition += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title, margin, yPosition);
    doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
    yPosition += 15;
  };

  // Header
  // Try to place employee photo top-right
  try {
    const rawPhotoUrl = (employee as any)?.image_url as string | undefined;
    const photoUrl = resolveTeamImage(rawPhotoUrl);
    if (photoUrl) {
      const photo = await loadImage(photoUrl);
      const maxSide = 42;
      const scale = Math.min(maxSide / photo.naturalWidth, maxSide / photo.naturalHeight);
      const photoW = photo.naturalWidth * scale;
      const photoH = photo.naturalHeight * scale;
      const xRight = pageWidth - margin - photoW;
      const yTop = margin;
      const fmt = photoUrl.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (doc as any).addImage(photo, fmt, xRight, yTop, photoW, photoH);
    }
  } catch (e) {
    console.log('Could not load employee photo');
  }

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(employee.name, margin, yPosition);
  yPosition += 15;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(employee.title, margin, yPosition);
  yPosition += 10;

  // Contact Information
  addSection('Kontaktdaten');
  addText(`E-Mail: ${employee.email}`);
  if (employee.phone) {
    addText(`Telefon: ${employee.phone}`);
  }
  if (employee.linkedin) {
    addText(`LinkedIn: ${employee.linkedin}`);
  }
  if (employee.xing) {
    addText(`Xing: ${employee.xing}`);
  }

  // Description
  if (employee.description) {
    addSection('Profil');
    addText(employee.description);
  }

  const cvData = employee.cv_data || {};

  // Experience
  if (cvData.experience && cvData.experience.length > 0) {
    addSection('Berufserfahrung');
    cvData.experience.forEach((exp: any) => {
      addText(`${exp.position} - ${exp.company}`, 12, true);
      addText(`${exp.period}`);
      if (exp.description) {
        addText(exp.description);
      }
      yPosition += 5;
    });
  }

  // Education
  if (cvData.education && cvData.education.length > 0) {
    addSection('Ausbildung');
    cvData.education.forEach((edu: any) => {
      addText(`${edu.degree} - ${edu.institution}`, 12, true);
      addText(`${edu.period}`);
      if (edu.description) {
        addText(edu.description);
      }
      yPosition += 5;
    });
  }

  // Skills
  if (cvData.skills && cvData.skills.length > 0) {
    addSection('Kompetenzen');
    addText(cvData.skills.join(', '));
  }

  // Languages
  if (cvData.languages && cvData.languages.length > 0) {
    addSection('Sprachen');
    cvData.languages.forEach((lang: any) => {
      addText(`${lang.language}: ${lang.level}`);
    });
  }

  // Certifications
  if (cvData.certifications && cvData.certifications.length > 0) {
    addSection('Zertifikate');
    cvData.certifications.forEach((cert: any) => {
      addText(`${cert.name} - ${cert.issuer} (${cert.year})`, 11, true);
    });
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Erstellt von addonware.de', margin, pageHeight - 10);

  // Save the PDF
  doc.save(`${employee.name.replace(/\s+/g, '_')}_CV.pdf`);
};