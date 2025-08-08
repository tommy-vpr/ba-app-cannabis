export function formatUSPhoneNumber(phone?: string): string | null {
  if (!phone) return null;

  // Strip all non-numeric characters
  const digits = phone.replace(/\D/g, "");

  // 11-digit numbers starting with 1
  if (digits.length === 11 && digits.startsWith("1")) {
    const areaCode = digits.slice(1, 4);
    const centralOffice = digits.slice(4, 7);
    const lineNumber = digits.slice(7);
    return `+1 (${areaCode}) ${centralOffice}-${lineNumber}`;
  }

  // 10-digit numbers (assumed US)
  if (digits.length === 10) {
    const areaCode = digits.slice(0, 3);
    const centralOffice = digits.slice(3, 6);
    const lineNumber = digits.slice(6);
    return `+1 (${areaCode}) ${centralOffice}-${lineNumber}`;
  }

  return null; // Not a valid US number
}
