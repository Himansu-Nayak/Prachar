/**
 * Indian Mobile Number Formatting & Validation Utilities (+91)
 */

/**
 * Strips non-digits, leading zeros, and prefixes, returning a clean 10-digit number.
 */
export function extractTenDigits(input: string): string {
  const digitsOnly = input.replace(/\D/g, "");
  if (digitsOnly.startsWith("91") && digitsOnly.length === 12) {
    return digitsOnly.slice(2);
  }
  if (digitsOnly.startsWith("0") && digitsOnly.length === 11) {
    return digitsOnly.slice(1);
  }
  return digitsOnly.slice(-10);
}

/**
 * Normalizes an Indian phone number to E.164 international format: +91XXXXXXXXXX
 */
export function normalizeIndianPhoneNumber(input: string): string {
  const tenDigits = extractTenDigits(input);
  return `+91${tenDigits}`;
}

/**
 * Validates whether the given string represents a valid 10-digit Indian mobile number.
 * Valid Indian mobile numbers begin with digits 6, 7, 8, or 9.
 */
export function isValidIndianPhoneNumber(input: string): boolean {
  const tenDigits = extractTenDigits(input);
  return /^[6-9]\d{9}$/.test(tenDigits);
}

/**
 * Formats a phone number for user-friendly display: +91 XXXXX XXXXX
 */
export function formatPhoneNumberForDisplay(input: string): string {
  const tenDigits = extractTenDigits(input);
  if (tenDigits.length !== 10) return input;
  return `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`;
}
