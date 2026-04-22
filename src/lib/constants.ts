// ===== Kategori Transaksi =====
export const TRANSACTION_CATEGORIES = [
  { value: 'Makanan & Minuman', label: 'Makanan & Minuman', icon: 'restaurant' },
  { value: 'Transportasi', label: 'Transportasi', icon: 'commute' },
  { value: 'Pendidikan', label: 'Pendidikan', icon: 'school' },
  { value: 'Hiburan & Lifestyle', label: 'Hiburan & Lifestyle', icon: 'celebration' },
  { value: 'Belanja', label: 'Belanja', icon: 'shopping_bag' },
  { value: 'Kesehatan', label: 'Kesehatan', icon: 'health_and_safety' },
  { value: 'Langganan', label: 'Langganan', icon: 'subscriptions' },
  { value: 'Tempat Tinggal', label: 'Tempat Tinggal', icon: 'home' },
  { value: 'Uang Saku', label: 'Uang Saku', icon: 'account_balance_wallet' },
  { value: 'Freelance', label: 'Freelance', icon: 'work' },
  { value: 'Lainnya', label: 'Lainnya', icon: 'more_horiz' },
] as const;

// ===== Metode Pembayaran =====
export const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'BANK', label: 'Bank Transfer' },
  { value: 'E-WALLET', label: 'E-Wallet' },
  { value: 'QRIS', label: 'QRIS' },
] as const;

// ===== Status Warna =====
export const STATUS_COLORS = {
  AMAN: { bg: 'bg-lime', text: 'text-surface' },
  WASPADA: { bg: 'bg-yellow-500', text: 'text-black' },
  BAHAYA: { bg: 'bg-danger', text: 'text-white' },
} as const;

// ===== Navigation Items =====
export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'grid_view' },
  { href: '/transactions', label: 'Transactions', icon: 'swap_horiz' },
  { href: '/budgeting', label: 'Budgeting', icon: 'account_balance_wallet' },
  { href: '/savings', label: 'Savings', icon: 'savings' },
  { href: '/split-bill', label: 'Split Bill', icon: 'call_split' },
  { href: '/financial-health', label: 'Financial Health', icon: 'health_and_safety' },
  { href: '/chatbot', label: 'Cuan AI', icon: 'psychology' },
  { href: '/investment', label: 'Investasi', icon: 'trending_up' },
] as const;

// ===== Health Score Labels =====
export const HEALTH_SCORE_LABELS = {
  EXCELLENT: { min: 80, max: 100, label: 'Excellent', color: '#BCFF4F' },
  GOOD: { min: 60, max: 79, label: 'Good', color: '#99D929' },
  FAIR: { min: 40, max: 59, label: 'Fair', color: '#FFD700' },
  POOR: { min: 20, max: 39, label: 'Poor', color: '#FF8C00' },
  CRITICAL: { min: 0, max: 19, label: 'Critical', color: '#FF4F4F' },
} as const;

// ===== App Info =====
export const APP_NAME = 'KAMPUSCUAN';
export const APP_TAGLINE = 'Fintech for Students';
export const APP_VERSION = 'v1.0.0';
