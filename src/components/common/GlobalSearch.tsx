'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { findSearchMatch, smoothScrollToSection } from '@/lib/searchConfig';

interface GlobalSearchProps {
  className?: string;
  showLabel?: boolean;
}

export default function GlobalSearch({ className = '', showLabel = false }: GlobalSearchProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) return;

    setIsSearching(true);

    try {
      const match = findSearchMatch(trimmedQuery);

      if (match) {
        // Navigate to the matched route
        router.push(match.route);

        // If there's a specific section, scroll to it after navigation
        if (match.section) {
          smoothScrollToSection(match.section);
        }

        setSearchQuery('');
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={className}>
      {showLabel && (
        <label className="block text-xs font-bold uppercase tracking-widest text-[#888888] mb-2">
          Global Search
        </label>
      )}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-3 bg-[#141414] px-6 py-2.5 rounded-full border border-white/5 focus-within:border-[#BCFF4F]/50 hover:border-white/10 transition-all duration-300"
      >
        <button
          type="submit"
          disabled={isSearching}
          className="material-symbols-outlined text-[#888888] hover:text-[#BCFF4F] transition-colors text-base disabled:opacity-50"
        >
          search
        </button>
        <input
          className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-medium text-[#F4F4F0] w-full placeholder:text-[#666666]"
          placeholder="Cari menu, fitur, atau topik..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
          disabled={isSearching}
        />
      </form>
    </div>
  );
}
