'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatIDR } from '@/lib/formatters';

interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  variant?: 'primary' | 'danger' | 'default';
  icon?: string;
  isLoading?: boolean;
}

export default function MetricCard({ title, value, change, variant = 'default', isLoading }: MetricCardProps) {
  if (isLoading) {
    return (
      <Card className={`p-8 rounded-2xl border-0 ${variant === 'primary' ? 'bg-[#BCFF4F]' : 'bg-[#141414] border border-[#BCFF4F]/10'}`}>
        <Skeleton className="h-3 w-[100px] bg-[#2A2A2A] mb-4" />
        <Skeleton className="h-9 w-[180px] bg-[#2A2A2A] mb-4" />
        <Skeleton className="h-4 w-[120px] bg-[#2A2A2A]" />
      </Card>
    );
  }

  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';

  const valueColor = isPrimary
    ? 'text-[#0A0A0A]'
    : isDanger
      ? 'text-red-400'
      : 'text-[#BCFF4F]';

  return (
    <Card className={`p-8 rounded-2xl border-0 ${
      isPrimary
        ? 'bg-[#BCFF4F]'
        : 'bg-[#141414] border border-[#BCFF4F]/10'
    }`}>
      <p className={`font-bold text-[11px] tracking-widest uppercase ${
        isPrimary ? 'text-[#0A0A0A]/60' : 'text-[#888888]'
      }`}>
        {title}
      </p>
      <h3 className={`text-4xl font-[900] tracking-[-0.04em] mt-2 ${valueColor}`}>
        {formatIDR(value)}
      </h3>
      {change !== undefined && (
        <p className={`text-sm font-bold mt-4 flex items-center gap-1 ${
          isPrimary ? 'text-[#0A0A0A]/60' : 'text-[#888888]'
        }`}>
          <span className="material-symbols-outlined text-sm">
            {change >= 0 ? 'trending_up' : 'trending_down'}
          </span>
          {change >= 0 ? '+' : ''}{change}% vs bulan lalu
        </p>
      )}
    </Card>
  );
}
