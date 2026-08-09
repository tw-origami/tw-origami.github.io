// Pure answer-grading. No DOM, no imports — so tools/check-grading.mjs can
// test it in node exactly as the browser runs it.

/**
 * Numeric answers get partial credit for being close, which is what makes
 * estimating feel worth doing. Exception: small whole numbers (times tables and
 * the like) must be exact — "3 x 4 = 13" is wrong, not nearly right.
 * Returns 1 (exact), 0.6 (within 5%), 0.3 (within 15%) or 0.
 */
export function gradeNumeric(given, correct) {
  if (given === null || given === undefined || Number.isNaN(given)) return 0;
  const exactOnly = Number.isInteger(correct) && Math.abs(correct) <= 20;
  const rel = Math.abs(given - correct) / Math.max(1, Math.abs(correct));
  if (rel < 0.001) return 1;
  if (exactOnly) return 0;
  if (rel <= 0.05) return 0.6;
  if (rel <= 0.15) return 0.3;
  return 0;
}

/** Accepts "3,5" (comma decimal), "12 km", "3/4". Returns null if unparseable. */
export function parseNumber(raw) {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim().replace(/\s+/g, '').replace(',', '.').replace(/[^0-9.\-+/]/g, '');
  if (!s || s === '-' || s === '+' || s === '.') return null;
  if (s.includes('/')) {
    const [a, b] = s.split('/').map(Number);
    if (Number.isFinite(a) && Number.isFinite(b) && b !== 0) return a / b;
    return null;
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
