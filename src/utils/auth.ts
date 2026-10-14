/**
 * Authentication and authorization constants and utility functions.
 * 
 * Strict Admin Policy:
 * Only the exact email address `2302031800069@silveroakuni.ac.in`
 * is authorized to access the Admin Portal or execute administrative operations.
 */

export const AUTHORIZED_ADMIN_EMAIL = '2302031800069@silveroakuni.ac.in';

export const UNAUTHORIZED_ADMIN_MESSAGE = 'You are not authorized to access the Admin Portal.';

/**
 * Checks whether an email address matches the authorized admin email.
 * Comparison is performed case-insensitively after trimming leading and trailing whitespace.
 */
export const isAuthorizedAdminEmail = (email?: string | null): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL.trim().toLowerCase();
};
