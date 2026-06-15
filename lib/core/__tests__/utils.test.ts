import { toSlug, parseDate, isValidHttpUrl, isSafeExternalUrl } from '../utils';

describe('toSlug', () => {
  it('converts title to lowercase slug with hash', () => {
    const result = toSlug('Qatar Raises Fuel Prices');
    expect(result).toMatch(/^qatar-raises-fuel-prices-[a-z0-9]{6}$/);
  });

  it('handles Arabic characters', () => {
    const result = toSlug('السعودية ترفع الأسعار');
    expect(result).toMatch(/^السعودية-ترفع-الأسعار-[a-z0-9]{6}$/);
  });

  it('returns insight-slug for empty title', () => {
    const result = toSlug('!!!');
    expect(result).toMatch(/^insight-[a-z0-9]{6}$/);
  });

  it('is deterministic with seed', () => {
    const result1 = toSlug('Test Title', 'same-seed');
    const result2 = toSlug('Test Title', 'same-seed');
    expect(result1).toBe(result2);
  });
});

describe('parseDate', () => {
  it('parses ISO date strings', () => {
    const result = parseDate('2026-01-15T10:30:00Z');
    expect(result).toEqual({
      day: '15',
      mon: 'JAN',
      year: '2026',
      display: '15 JAN 2026'
    });
  });

  it('returns null for invalid dates', () => {
    expect(parseDate('not-a-date')).toBeNull();
    expect(parseDate(null)).toBeNull();
    expect(parseDate(undefined)).toBeNull();
  });
});

describe('isValidHttpUrl', () => {
  it('validates http URLs', () => {
    expect(isValidHttpUrl('http://example.com')).toBe(true);
    expect(isValidHttpUrl('https://example.com/path')).toBe(true);
  });

  it('rejects invalid URLs', () => {
    expect(isValidHttpUrl('not-a-url')).toBe(false);
    expect(isValidHttpUrl('ftp://example.com')).toBe(false);
    expect(isValidHttpUrl('')).toBe(false);
  });
});

describe('isSafeExternalUrl', () => {
  it('accepts valid public URLs', () => {
    expect(isSafeExternalUrl('https://example.com')).toBe(true);
    expect(isSafeExternalUrl('https://api.example.com/data')).toBe(true);
  });

  it('rejects private IPs', () => {
    expect(isSafeExternalUrl('http://127.0.0.1')).toBe(false);
    expect(isSafeExternalUrl('http://192.168.1.1')).toBe(false);
    expect(isSafeExternalUrl('http://10.0.0.1')).toBe(false);
    expect(isSafeExternalUrl('http://localhost')).toBe(false);
  });

  it('rejects non-http protocols', () => {
    expect(isSafeExternalUrl('ftp://example.com')).toBe(false);
  });
});