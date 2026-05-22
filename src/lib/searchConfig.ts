// Search configuration mapping keywords to pages and sections
export interface SearchMapItem {
  keywords: string[];
  route: string;
  section?: string;
  label: string;
}

export const SEARCH_MAP: SearchMapItem[] = [
  // Dashboard
  {
    keywords: ['dashboard', 'dasbor', 'beranda', 'overview', 'ringkasan'],
    route: '/dashboard',
    label: 'Dashboard',
  },

  // Transactions
  {
    keywords: ['transaksi', 'transactions', 'catatan', 'history', 'riwayat', 'daftar transaksi'],
    route: '/transactions',
    label: 'Transactions',
  },
  {
    keywords: ['transaksi income', 'pemasukan', 'pendapatan', 'gaji'],
    route: '/transactions',
    section: 'income-section',
    label: 'Income Transactions',
  },
  {
    keywords: ['transaksi expense', 'pengeluaran', 'biaya', 'belanja'],
    route: '/transactions',
    section: 'expense-section',
    label: 'Expense Transactions',
  },

  // Budgeting
  {
    keywords: ['budgeting', 'budget', 'anggaran', 'alokasi', 'perencanaan'],
    route: '/budgeting',
    label: 'Budgeting',
  },
  {
    keywords: ['kategori budget', 'kategori anggaran', 'budget kategori'],
    route: '/budgeting',
    section: 'budget-categories',
    label: 'Budget Categories',
  },
  {
    keywords: ['budget report', 'laporan anggaran', 'ringkasan budget'],
    route: '/budgeting',
    section: 'budget-report',
    label: 'Budget Report',
  },

  // Savings
  {
    keywords: ['tabungan', 'savings', 'target tabungan', 'menabung', 'akumulasi'],
    route: '/savings',
    label: 'Savings',
  },
  {
    keywords: ['target tabungan', 'goal', 'tujuan menabung'],
    route: '/savings',
    section: 'savings-goals',
    label: 'Savings Goals',
  },
  {
    keywords: ['progress tabungan', 'progres menabung', 'pencapaian'],
    route: '/savings',
    section: 'savings-progress',
    label: 'Savings Progress',
  },

  // Split Bill
  {
    keywords: ['split bill', 'patungan', 'berbagi biaya', 'hutang piutang'],
    route: '/split-bill',
    label: 'Split Bill',
  },
  {
    keywords: ['daftar hutang', 'hutang', 'piutang', 'tagihan'],
    route: '/split-bill',
    section: 'bill-list',
    label: 'Bill List',
  },
  {
    keywords: ['ringkasan hutang', 'summary', 'total hutang'],
    route: '/split-bill',
    section: 'bill-summary',
    label: 'Bill Summary',
  },

  // Financial Health
  {
    keywords: ['kesehatan keuangan', 'financial health', 'skor kesehatan', 'health score'],
    route: '/financial-health',
    label: 'Financial Health',
  },
  {
    keywords: ['skor kesehatan', 'health score', 'rating'],
    route: '/financial-health',
    section: 'health-score',
    label: 'Health Score',
  },
  {
    keywords: ['analisis kesehatan', 'financial analysis', 'insight'],
    route: '/financial-health',
    section: 'health-analysis',
    label: 'Health Analysis',
  },

  // Investment
  {
    keywords: ['investasi', 'investment', 'saham', 'aset', 'portofolio'],
    route: '/investment',
    label: 'Investment',
  },
  {
    keywords: ['portofolio investasi', 'portfolio', 'daftar investasi'],
    route: '/investment',
    section: 'investment-portfolio',
    label: 'Investment Portfolio',
  },
  {
    keywords: ['perbandingan instrumen', 'instrument', 'instrumen investasi', 'comparison'],
    route: '/investment',
    section: 'instrument-comparison',
    label: 'Instrument Comparison',
  },
  {
    keywords: ['riwayat investasi', 'history', 'transaksi investasi'],
    route: '/investment',
    section: 'investment-history',
    label: 'Investment History',
  },

  // Generic common searches
  {
    keywords: ['pengaturan', 'settings', 'profil', 'akun'],
    route: '/profile',
    label: 'Settings & Profile',
  },
];

/**
 * Find the best matching search result based on user input
 * @param query - User's search query
 * @returns Matching SearchMapItem or null
 */
export function findSearchMatch(query: string): SearchMapItem | null {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) return null;

  // Exact match has highest priority
  for (const item of SEARCH_MAP) {
    if (item.keywords.some((kw) => kw.toLowerCase() === normalizedQuery)) {
      return item;
    }
  }

  // Partial match - check if any keyword starts with or includes the query
  for (const item of SEARCH_MAP) {
    if (
      item.keywords.some(
        (kw) =>
          kw.toLowerCase().startsWith(normalizedQuery) ||
          normalizedQuery.split(' ').every((word) => kw.toLowerCase().includes(word))
      )
    ) {
      return item;
    }
  }

  return null;
}

/**
 * Perform smooth scroll to a section (client-side safe)
 * @param sectionId - The ID of the section to scroll to
 */
export function smoothScrollToSection(sectionId: string): void {
  // Ensure we're on the client-side and DOM is ready
  if (typeof window === 'undefined') return;

  // Use multiple checks to ensure DOM is ready
  const scrollAttempt = (attempt = 0) => {
    const maxAttempts = 10;
    
    const element = document.getElementById(sectionId);
    if (element) {
      try {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Optional: Add visual highlight
        element.classList.add('animate-pulse');
        setTimeout(() => {
          element.classList.remove('animate-pulse');
        }, 2000);
      } catch (error) {
        // Fallback to non-smooth scroll if smooth scroll fails
        element.scrollIntoView();
      }
    } else if (attempt < maxAttempts) {
      // Retry if element not found yet
      setTimeout(() => scrollAttempt(attempt + 1), 100);
    }
  };

  // Start scroll attempt with delay
  setTimeout(scrollAttempt, 100);
}
