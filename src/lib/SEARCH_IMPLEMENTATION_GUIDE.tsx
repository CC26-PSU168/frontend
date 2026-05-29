/**
 * Global Search & Navigation System - Implementation Guide
 *
 * This document provides examples of how to implement search-friendly sections
 * in your pages with proper IDs for smooth scrolling.
 *
 * All sections must use the IDs defined in searchConfig.ts for the search
 * feature to work properly.
 */

// ============= TRANSACTIONS PAGE SECTIONS =============
// File: src/app/transactions/page.tsx
/*
<section id="income-section" className="space-y-4">
  <h2 className="text-2xl font-bold text-[#BCFF4F]">Income Transactions</h2>
  {/* Income transactions list *//*}
</section>

<section id="expense-section" className="space-y-4">
  <h2 className="text-2xl font-bold text-[#BCFF4F]">Expense Transactions</h2>
  {/* Expense transactions list *//*}
</section>
*/

// ============= BUDGETING PAGE SECTIONS =============
// File: src/app/budgeting/page.tsx
/*
<section id="budget-categories" className="space-y-4">
  <h2 className="text-2xl font-bold text-[#BCFF4F]">Budget Categories</h2>
  {/* Budget categories content *//*}
</section>

<section id="budget-report" className="space-y-4">
  <h2 className="text-2xl font-bold text-[#BCFF4F]">Budget Report</h2>
  {/* Budget report content *//*}
</section>
*/

// ============= SAVINGS PAGE SECTIONS =============
// File: src/app/savings/page.tsx
/*
<section id="savings-goals" className="space-y-4">
  <h2 className="text-2xl font-bold text-[#BCFF4F]">Savings Goals</h2>
  {/* Savings goals content *//*}
</section>

<section id="savings-progress" className="space-y-4">
  <h2 className="text-2xl font-bold text-[#BCFF4F]">Savings Progress</h2>
  {/* Savings progress content *//*}
</section>
*/

// ============= SPLIT BILL PAGE SECTIONS =============
// File: src/app/split-bill/page.tsx
/*
<section id="bill-list" className="space-y-4">
  <h2 className="text-2xl font-bold text-[#BCFF4F]">Bill List</h2>
  {/* Bill list content *//*}
</section>

<section id="bill-summary" className="space-y-4">
  <h2 className="text-2xl font-bold text-[#BCFF4F]">Bill Summary</h2>
  {/* Bill summary content *//*}
</section>
*/

// ============= FINANCIAL HEALTH PAGE SECTIONS =============
// File: src/app/financial-health/page.tsx
/*
<section id="health-score" className="space-y-4">
  <h2 className="text-2xl font-bold text-[#BCFF4F]">Health Score</h2>
  {/* Health score content *//*}
</section>

<section id="health-analysis" className="space-y-4">
  <h2 className="text-2xl font-bold text-[#BCFF4F]">Health Analysis</h2>
  {/* Health analysis content *//*}
</section>
*/

// ============= INVESTMENT PAGE SECTIONS =============
// File: src/app/investment/page.tsx
/*
<section id="investment-portfolio" className="space-y-4">
  <h2 className="text-2xl font-bold text-[#BCFF4F]">Investment Portfolio</h2>
  {/* Investment portfolio content *//*}
</section>

<section id="instrument-comparison" className="space-y-4">
  <h2 className="text-2xl font-bold text-[#BCFF4F]">Instrument Comparison</h2>
  {/* Instrument comparison content *//*}
</section>

<section id="investment-history" className="space-y-4">
  <h2 className="text-2xl font-bold text-[#BCFF4F]">Investment History</h2>
  {/* Investment history content *//*}
</section>
*/

// ============= USAGE EXAMPLES =============
/*
Search examples that will work:

1. "dashboard" / "dasbor" / "beranda"
   → Navigate to /dashboard

2. "transaksi" / "transactions"
   → Navigate to /transactions

3. "transaksi income" / "pemasukan"
   → Navigate to /transactions + scroll to #income-section

4. "transaksi expense" / "pengeluaran"
   → Navigate to /transactions + scroll to #expense-section

5. "budgeting" / "anggaran"
   → Navigate to /budgeting

6. "kategori budget" / "kategori anggaran"
   → Navigate to /budgeting + scroll to #budget-categories

7. "tabungan" / "savings"
   → Navigate to /savings

8. "target tabungan" / "goal"
   → Navigate to /savings + scroll to #savings-goals

9. "split bill" / "patungan"
   → Navigate to /split-bill

10. "investasi" / "investment"
    → Navigate to /investment

11. "perbandingan instrumen"
    → Navigate to /investment + scroll to #instrument-comparison

12. "kesehatan keuangan" / "financial health"
    → Navigate to /financial-health
*/

export default function SearchImplementationGuide() {
  return (
    <div className="p-8 space-y-4 text-[#888888] text-sm">
      <h1 className="text-2xl font-bold text-[#BCFF4F]">Search System Implementation</h1>
      <p>See comments above for implementation details</p>
    </div>
  );
}
