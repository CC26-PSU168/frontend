/**
 * Format angka ke format Rupiah Indonesia
 * @example formatIDR(2500000) => "Rp 2.500.000"
 */
export const formatIDR = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format angka ke format singkat (K, M, B)
 * @example formatCompact(2500000) => "Rp 2.5M"
 */
export const formatCompact = (amount: number): string => {
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(0)}k`;
  return `Rp ${amount}`;
};

/**
 * Format tanggal ke locale Indonesia
 * @example formatDate(new Date()) => "24 April 2025"
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Format tanggal pendek
 * @example formatDateShort(new Date()) => "24 Apr"
 */
export const formatDateShort = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
};

/**
 * Format waktu
 * @example formatTime(new Date()) => "12:45"
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

/**
 * Format persentase
 * @example formatPercent(0.284) => "28%"
 */
export const formatPercent = (value: number): string => {
  return `${Math.round(value * 100)}%`;
};
