import { z } from 'zod';

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name muss mindestens 2 Zeichen lang sein')
    .max(100, 'Name darf nicht länger als 100 Zeichen sein')
    .regex(/^[a-zA-ZäöüÄÖÜß\s.'-]+$/, 'Name enthält ungültige Zeichen. Erlaubt sind: Buchstaben, Leerzeichen, Punkt, Bindestrich, Apostroph'),
  email: z.string()
    .email('Ungültige E-Mail-Adresse')
    .max(254, 'E-Mail-Adresse ist zu lang'),
  organization: z.string()
    .max(200, 'Organisation darf nicht länger als 200 Zeichen sein')
    .optional(),
  message: z.string()
    .min(10, 'Nachricht muss mindestens 10 Zeichen lang sein')
    .max(2000, 'Nachricht darf nicht länger als 2000 Zeichen sein'),
  privacy: z.boolean().refine(val => val === true, {
    message: 'Datenschutz-Zustimmung ist erforderlich'
  }),
  botTrap: z.string().max(0, 'Bot-Erkennung ausgelöst').optional()
});

// Questionnaire validation schema
export const questionnaireSchema = z.object({
  email: z.string()
    .email('Ungültige E-Mail-Adresse')
    .max(254, 'E-Mail-Adresse ist zu lang'),
  answers: z.record(z.string(), z.string().min(1, 'Antwort ist erforderlich'))
    .refine(answers => Object.keys(answers).length >= 5, {
      message: 'Alle Fragen müssen beantwortet werden'
    })
});

// Employee validation schema
export const employeeSchema = z.object({
  name: z.string()
    .min(2, 'Name muss mindestens 2 Zeichen lang sein')
    .max(100, 'Name darf nicht länger als 100 Zeichen sein'),
  email: z.string()
    .email('Ungültige E-Mail-Adresse')
    .max(254, 'E-Mail-Adresse ist zu lang'),
  title: z.string()
    .min(2, 'Titel muss mindestens 2 Zeichen lang sein')
    .max(150, 'Titel darf nicht länger als 150 Zeichen sein'),
  description: z.string()
    .max(1000, 'Beschreibung darf nicht länger als 1000 Zeichen sein')
    .optional(),
  phone: z.string()
    .regex(/^[\+]?[0-9\s\-\(\)]{0,20}$/, 'Ungültige Telefonnummer')
    .optional(),
  linkedin: z.string()
    .url('Ungültige LinkedIn-URL')
    .optional()
    .or(z.literal('')),
  xing: z.string()
    .url('Ungültige Xing-URL')
    .optional()
    .or(z.literal('')),
  image_url: z.string()
    .url('Ungültige Bild-URL')
    .optional()
    .or(z.literal(''))
});

// Rate limiting helper
export const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export const checkRateLimit = (identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record) {
    rateLimitMap.set(identifier, { count: 1, timestamp: now });
    return true;
  }
  
  if (now - record.timestamp > windowMs) {
    rateLimitMap.set(identifier, { count: 1, timestamp: now });
    return true;
  }
  
  if (record.count >= maxAttempts) {
    return false;
  }
  
  record.count++;
  return true;
};

// Input sanitization
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// Origin validation
export const validateOrigin = (origin: string): boolean => {
  const allowedOrigins = [
    'https://dswoqywpdyzjofngyisc.supabase.co',
    'http://localhost:5173',
    'http://localhost:3000',
    window.location.origin
  ];
  
  return allowedOrigins.includes(origin);
};