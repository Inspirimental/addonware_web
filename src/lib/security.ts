import DOMPurify from 'dompurify';

// XSS Protection utilities
export const sanitizeHTML = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
    ALLOWED_ATTR: []
  });
};

// Basic input sanitization for form inputs
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Safe DOM manipulation without innerHTML
export const safeSetTextContent = (element: HTMLElement, content: string): void => {
  // Clear existing content
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  
  // Create and append text node
  const textNode = document.createTextNode(content);
  element.appendChild(textNode);
};

// Safe element creation
export const createSafeElement = (tagName: string, textContent: string, className?: string): HTMLElement => {
  const element = document.createElement(tagName);
  element.textContent = textContent; // Safe way to set text
  if (className) {
    element.className = className;
  }
  return element;
};

// Content Security Policy violation reporter
export const reportCSPViolation = (violationEvent: SecurityPolicyViolationEvent): void => {
  console.warn('CSP Violation detected:', {
    blockedURI: violationEvent.blockedURI,
    violatedDirective: violationEvent.violatedDirective,
    originalPolicy: violationEvent.originalPolicy,
    timestamp: new Date().toISOString()
  });
  
  // In production, you would send this to your monitoring service
};

// Setup CSP violation listener
export const setupCSPListener = (): void => {
  document.addEventListener('securitypolicyviolation', reportCSPViolation);
};

// Audit logging function
export const auditLog = (action: string, userId?: string, details?: Record<string, any>): void => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId: userId || 'anonymous',
    userAgent: navigator.userAgent,
    url: window.location.href,
    details
  };
  
  console.info('AUDIT LOG:', logEntry);
  
  // In production, send to secure logging service
  // Example: sendToAuditService(logEntry);
};

// Credential validation
export const validateCredentials = (): boolean => {
  // Check if EmailJS credentials are properly configured
  const requiredVars = ['EMAILJS_SERVICE_ID', 'EMAILJS_PUBLIC_KEY'];
  
  for (const variable of requiredVars) {
    if (!process.env[variable] || process.env[variable] === 'your_service_id' || process.env[variable] === 'your_public_key') {
      console.error(`Security Error: ${variable} not properly configured`);
      return false;
    }
  }
  
  return true;
};