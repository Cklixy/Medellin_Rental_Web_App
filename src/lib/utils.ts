import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Parse an ISO date string (YYYY-MM-DD) as local time, avoiding UTC off-by-one. */
export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Format an ISO date string (YYYY-MM-DD) as a local date string. */
export function fmtDate(iso: string, locale = 'es-CO'): string {
  if (!iso) return '';
  return parseLocalDate(iso).toLocaleDateString(locale);
}
