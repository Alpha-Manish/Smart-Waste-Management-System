/**
 * Utility functions for citizen complaint formatting and metadata extraction.
 */

export const extractReporterEmail = (description?: string, fallbackEmail?: string): string => {
  if (description) {
    const match = description.match(/^\[Reported By:\s*([^\]]+)\]/i);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return fallbackEmail || 'Registered Citizen';
};

export const cleanDescription = (description?: string): string => {
  if (!description) return '';
  return description.replace(/^\[Reported By:\s*[^\]]+\]\s*\n*/i, '').trim();
};

export const formatDescriptionWithReporter = (description: string, email: string): string => {
  const clean = cleanDescription(description);
  return `[Reported By: ${email.trim()}]\n\n${clean}`;
};
