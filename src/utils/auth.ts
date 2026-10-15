/**
 * Authentication and authorization constants and utility functions.
 * 
 * Strict Admin Policy:
 * Default authorized email is `2302031800069@silveroakuni.ac.in`.
 * Also supports dynamically updated admin email saved by the administrator.
 */

export const AUTHORIZED_ADMIN_EMAIL = '2302031800069@silveroakuni.ac.in';

export const UNAUTHORIZED_ADMIN_MESSAGE = 'You are not authorized to access the Admin Portal.';

export const getAuthorizedAdminEmail = (): string => {
  try {
    const custom = localStorage.getItem('custom_admin_email');
    if (custom && custom.trim()) {
      return custom.trim();
    }
  } catch {
    // ignore
  }
  return AUTHORIZED_ADMIN_EMAIL;
};

/**
 * Checks whether an email address matches the authorized admin email.
 * Comparison is performed case-insensitively after trimming leading and trailing whitespace.
 */
export const isAuthorizedAdminEmail = (email?: string | null): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail === AUTHORIZED_ADMIN_EMAIL.trim().toLowerCase()) {
    return true;
  }
  try {
    const custom = localStorage.getItem('custom_admin_email');
    if (custom && cleanEmail === custom.trim().toLowerCase()) {
      return true;
    }
  } catch {
    // ignore
  }
  return false;
};
