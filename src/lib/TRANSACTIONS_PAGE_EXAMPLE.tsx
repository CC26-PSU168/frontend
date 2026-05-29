/**
 * Example Implementation for Transactions Page with Global Search Support
 * This shows how to structure a page with searchable sections
 */

import SearchableSection from '@/components/common/SearchableSection';

export default function TransactionsPageExample() {
  // Example data
  const incomeTransactions = [
    // ... income data
  ];

  const expenseTransactions = [
    // ... expense data
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-[900] text-[#F4F4F0]">
          Catatan Transaksi<span className="text-[#BCFF4F]">.</span>
        </h1>
        <p className="text-[#888888] mt-2 font-bold">
          Kelola dan monitor semua transaksi kamu di sini
        </p>
      </div>

      {/* Income Section - Searchable */}
      <SearchableSection
        id="income-section"
        title="Transaksi Pemasukan"
        subtitle="Lihat semua transaksi pemasukan kamu"
      >
        <div className="space-y-4">
          {/* Income transactions list */}
          {incomeTransactions.length === 0 ? (
            <div className="text-center py-8 text-[#888888]">
              Belum ada transaksi pemasukan
            </div>
          ) : (
            // Render income transactions
            null
          )}
        </div>
      </SearchableSection>

      {/* Expense Section - Searchable */}
      <SearchableSection
        id="expense-section"
        title="Transaksi Pengeluaran"
        subtitle="Lihat semua transaksi pengeluaran kamu"
      >
        <div className="space-y-4">
          {/* Expense transactions list */}
          {expenseTransactions.length === 0 ? (
            <div className="text-center py-8 text-[#888888]">
              Belum ada transaksi pengeluaran
            </div>
          ) : (
            // Render expense transactions
            null
          )}
        </div>
      </SearchableSection>
    </div>
  );
}

/**
 * How to use this in your actual page:
 * 1. Import SearchableSection: import SearchableSection from '@/components/common/SearchableSection'
 * 2. Wrap your sections with SearchableSection component
 * 3. The id prop MUST match the section IDs in searchConfig.ts
 * 4. Users can now search for "transaksi income" or "pemasukan" to navigate here
 */
