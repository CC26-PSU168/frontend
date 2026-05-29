'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import SearchableSection from '@/components/common/SearchableSection';
import {
  useSplitBills,
  useCreateSplitBill,
  useMarkPaid,
  useSettleBill,
  useDeleteSplitBill,
} from '@/hooks/useSplitBills';
import { formatIDR, formatDateShort } from '@/lib/formatters';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// ── Types ────────────────────────────────────────────────────────────────────

interface BillItem {
  name: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getClientDate(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SplitBillPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'settled'>('pending');
  const { data: bills, isLoading } = useSplitBills(
    activeTab === 'pending' ? 'pending' : 'settled'
  );

  const createMutation = useCreateSplitBill();
  const markPaidMutation = useMarkPaid();
  const settleMutation = useSettleBill();
  const deleteMutation = useDeleteSplitBill();

  const [showCreateModal, setShowCreateModal] = useState(false);

  // ── Create form state ──────────────────────────────────────────────────────

  const [title, setTitle] = useState('');
  const [date, setDate] = useState<string>(getClientDate);

  // Items
  const [items, setItems] = useState<BillItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState('');

  // Participants
  const [participants, setParticipants] = useState<{ name: string }[]>([]);
  const [newParticipantName, setNewParticipantName] = useState('');

  // Appointments: itemIndex → participantIndex → qty
  const [assignments, setAssignments] = useState<Record<number, Record<number, number>>>({});

  // Split mode
  const [splitMethod, setSplitMethod] = useState<'equal' | 'item'>('equal');

  // ── Derived totals ────────────────────────────────────────────────────────

  const totalBill = items.reduce((sum, item) => sum + item.subtotal, 0);

  // Preview share per participant (hanya untuk UI — BE yang hitung final)
  function calcLocalShare(pIndex: number): number {
    if (splitMethod === 'equal') {
      if (participants.length === 0) return 0;
      return Math.round(totalBill / participants.length);
    }
    let share = 0;
    items.forEach((item, iIndex) => {
      const assignedQty = assignments[iIndex]?.[pIndex] ?? 0;
      if (assignedQty > 0) {
        share += item.unitPrice * assignedQty;
      }
    });
    return Math.round(share);
  }

  // ── Assignment helpers ────────────────────────────────────────────────────

  function updateAssignmentQty(itemIndex: number, pIndex: number, delta: number) {
    setAssignments((prev) => {
      const currentMap = prev[itemIndex] || {};
      const currentQty = currentMap[pIndex] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      const nextMap = { ...currentMap, [pIndex]: newQty };
      // Hapus key kalau qty 0 supaya bersih
      if (newQty === 0) {
        delete nextMap[pIndex];
      }

      return {
        ...prev,
        [itemIndex]: nextMap,
      };
    });
  }

  function assignAll(itemIndex: number) {
    // assignAll di mode qty mungkin tidak terlalu relevan, tapi kita bisa bagi rata sisa qty
    const item = items[itemIndex];
    if (!item) return;
    
    setAssignments((prev) => {
      const currentMap = prev[itemIndex] || {};
      const assignedTotal = Object.values(currentMap).reduce((a, b) => a + b, 0);
      let remaining = item.qty - assignedTotal;
      
      if (remaining <= 0) return prev; // sudah habis
      
      const nextMap = { ...currentMap };
      // Bagi sisa satu per satu
      let pIdx = 0;
      while (remaining > 0 && participants.length > 0) {
        nextMap[pIdx] = (nextMap[pIdx] || 0) + 1;
        remaining--;
        pIdx = (pIdx + 1) % participants.length;
      }
      
      return { ...prev, [itemIndex]: nextMap };
    });
  }

  // ── Item CRUD ─────────────────────────────────────────────────────────────

  function addItem() {
    const name = newItemName.trim();
    const price = parseFloat(newItemPrice);
    if (!name || isNaN(price) || price <= 0 || newItemQty < 1) return;
    setItems((prev) => [
      ...prev,
      { name, qty: newItemQty, unitPrice: price, subtotal: newItemQty * price },
    ]);
    setNewItemName('');
    setNewItemQty(1);
    setNewItemPrice('');
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setAssignments((prev) => {
      const next: Record<number, Record<number, number>> = {};
      Object.entries(prev).forEach(([key, val]) => {
        const k = parseInt(key);
        if (k !== index) next[k > index ? k - 1 : k] = val;
      });
      return next;
    });
  }

  // ── Participant CRUD ──────────────────────────────────────────────────────

  function addParticipant() {
    if (!newParticipantName.trim()) return;
    setParticipants((prev) => [...prev, { name: newParticipantName.trim() }]);
    setNewParticipantName('');
  }

  function removeParticipant(index: number) {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
    setAssignments((prev) => {
      const next: Record<number, Record<number, number>> = {};
      Object.entries(prev).forEach(([key, val]) => {
        const nextMap: Record<number, number> = {};
        Object.entries(val).forEach(([pIdxStr, qty]) => {
          const pIdx = parseInt(pIdxStr);
          if (pIdx === index) return; // participant dihapus
          const newIdx = pIdx > index ? pIdx - 1 : pIdx;
          nextMap[newIdx] = qty;
        });
        next[parseInt(key)] = nextMap;
      });
      return next;
    });
  }

  // ── Reset form ────────────────────────────────────────────────────────────

  function resetForm() {
    setTitle('');
    setDate(getClientDate());
    setItems([]);
    setParticipants([]);
    setAssignments({});
    setSplitMethod('equal');
    setNewItemName('');
    setNewItemQty(1);
    setNewItemPrice('');
    setNewParticipantName('');
  }

  // ── Validation ────────────────────────────────────────────────────────────

  const isFormValid =
    title.trim() !== '' &&
    items.length > 0 &&
    participants.length > 0 &&
    (splitMethod === 'equal' ||
      items.every((item, i) => {
        const assignedTotal = Object.values(assignments[i] || {}).reduce((a, b) => a + b, 0);
        return assignedTotal === item.qty; // Harus habis terbagi
      }));

  // ── Submit ────────────────────────────────────────────────────────────────

  async function handleCreate() {
    if (!isFormValid) return;

    const assignmentsPayload =
      splitMethod === 'item'
        ? Object.entries(assignments).map(([itemIndex, participantMap]) => ({
            itemIndex: parseInt(itemIndex),
            assignees: Object.entries(participantMap).map(([pIdx, qty]) => ({
              participantIndex: parseInt(pIdx),
              qty,
            })),
          }))
        : undefined;

    const payload = {
      title,
      date,
      splitMethod,
      items: items.map((item) => ({
        name: item.name,
        qty: item.qty,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
      participants: participants.map((p) => ({ name: p.name })),
      assignments: assignmentsPayload,
    };

    try {
      await createMutation.mutateAsync(payload);
      toast.success('Split bill berhasil dibuat!');
      setShowCreateModal(false);
      resetForm();
    } catch (err: unknown) {
      console.error('Create split bill error:', err);
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = error?.response?.data?.message || error?.message || 'Gagal membuat split bill';
      toast.error(`Gagal: ${msg}`);
    }
  }

  // ── Mark paid / settle / delete ───────────────────────────────────────────

  async function handleMarkPaid(splitBillId: string, participantId: string) {
    try {
      await markPaidMutation.mutateAsync({ splitBillId, participantId });
      toast.success('Status pembayaran diperbarui');
    } catch {
      toast.error('Gagal memperbarui status');
    }
  }

  async function handleSettle(id: string) {
    try {
      await settleMutation.mutateAsync(id);
      toast.success('Split bill diselesaikan!');
    } catch {
      toast.error('Gagal menyelesaikan');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Split bill dihapus');
    } catch {
      toast.error('Gagal menghapus');
    }
  }

  // ── Summary stats ─────────────────────────────────────────────────────────

  const pendingBills = bills?.filter((b) => !b.isSettled) ?? [];
  const totalPiutang = pendingBills.reduce((sum, b) => {
    const unpaid = b.participants
      .filter((p) => !p.isPaid)
      .reduce((s, p) => s + p.shareAmount, 0);
    return sum + unpaid;
  }, 0);
  const totalFriends = new Set(
    bills?.flatMap((b) => b.participants.map((p) => p.name)) ?? []
  ).size;

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <AppLayout>
        <div className="mb-12">
          <Skeleton className="h-14 w-64 bg-[#2A2A2A] mb-4" />
        </div>
        <div className="flex gap-4 mb-12 overflow-x-auto pb-2">
          <Skeleton className="h-16 w-64 bg-[#1C1B1B] rounded-full shrink-0" />
          <Skeleton className="h-16 w-48 bg-[#1C1B1B] rounded-full shrink-0" />
          <Skeleton className="h-16 w-48 bg-[#1C1B1B] rounded-full shrink-0" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 w-full bg-[#1C1B1B] rounded-[2.5rem]" />
          <Skeleton className="h-48 w-full bg-[#1C1B1B] rounded-[2.5rem]" />
        </div>
      </AppLayout>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-12">
        <h2 className="text-4xl md:text-6xl font-[900] tracking-[-0.04em] uppercase leading-none text-white">
          Split Bill.
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
          <div className="flex bg-[#141414] p-1 rounded-full w-full sm:w-auto shrink-0">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 sm:flex-none px-6 md:px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap text-sm md:text-base ${
                activeTab === 'pending'
                  ? 'bg-[#2a2a2a] text-[#BCFF4F]'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Belum Lunas
            </button>
            <button
              onClick={() => setActiveTab('settled')}
              className={`flex-1 sm:flex-none px-6 md:px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap text-sm md:text-base ${
                activeTab === 'settled'
                  ? 'bg-[#2a2a2a] text-[#BCFF4F]'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Riwayat
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#BCFF4F] text-[#0A0A0A] px-8 py-3 md:py-4 h-auto whitespace-nowrap rounded-full font-[900] tracking-[-0.04em] flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_0_30px_rgba(188,255,79,0.2)] w-full sm:w-auto"
          >
            Buat Split Bill{' '}
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="flex gap-3 mb-12 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { label: 'Total Piutang', value: formatIDR(totalPiutang) },
          { label: 'Aktif', value: `${pendingBills.length} Tagihan` },
          { label: 'Teman Terlibat', value: `${totalFriends} Orang` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-[#1C1B1B] px-5 md:px-8 py-4 rounded-full flex items-center gap-3 whitespace-nowrap border border-[#BCFF4F]/10 shrink-0"
          >
            <span className="w-3 h-3 bg-[#BCFF4F] rounded-full shadow-[0_0_10px_#BCFF4F] shrink-0" />
            <span className="text-[#888888] font-bold text-sm">{label}:</span>
            <span className="text-white font-black text-base md:text-xl">{value}</span>
          </div>
        ))}
      </div>

      {/* Bill Cards */}
      <SearchableSection
        id="bill-list"
        title={activeTab === 'pending' ? 'Tagihan Aktif' : 'Riwayat Tagihan'}
        subtitle={activeTab === 'pending' ? 'Daftar semua tagihan yang belum diselesaikan' : 'Daftar tagihan yang sudah diselesaikan'}
      >
        {bills && bills.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 max-w-5xl">
          {bills.map((bill, index) => {
            const isFirst = index === 0 && activeTab === 'pending';
            return (
              <div
                key={bill.id}
                className={`${
                  isFirst
                    ? 'bg-[#BCFF4F] text-[#0A0A0A]'
                    : 'bg-[#141414] text-white border border-[#BCFF4F]/5 hover:border-[#BCFF4F]/20'
                } p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex flex-col md:flex-row gap-6 md:gap-8 items-start relative overflow-hidden group transition-colors`}
              >
                {isFirst && (
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
                )}

                {/* Left */}
                <div className="flex-1 z-10 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span
                      className={`${
                        isFirst
                          ? 'bg-black/10 text-black'
                          : 'bg-[#BCFF4F]/10 text-[#BCFF4F]'
                      } px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest truncate max-w-[180px]`}
                    >
                      {bill.title}
                    </span>
                    <span
                      className={`font-bold text-xs uppercase tracking-widest ${
                        isFirst ? 'text-black/50' : 'text-[#888888]'
                      }`}
                    >
                      {formatDateShort(bill.date)}
                    </span>
                  </div>
                  <h3
                    className={`text-2xl md:text-4xl font-[900] tracking-[-0.04em] mb-2 leading-tight truncate ${
                      isFirst ? 'text-black' : 'text-white'
                    }`}
                  >
                    {bill.title}
                  </h3>
                  <p
                    className={`font-bold text-base md:text-lg mb-6 md:mb-8 ${
                      isFirst ? 'text-black/60' : 'text-[#888888]'
                    }`}
                  >
                    Total: {formatIDR(bill.totalAmount)}
                  </p>
                  <div className="flex -space-x-3">
                    {bill.participants.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-sm border-4 ${
                          isFirst
                            ? 'border-[#BCFF4F] bg-black text-[#BCFF4F]'
                            : 'border-[#141414] bg-[#BCFF4F] text-black'
                        }`}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {bill.participants.length > 3 && (
                      <div
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-sm border-4 ${
                          isFirst
                            ? 'border-[#BCFF4F] bg-black text-[#BCFF4F]'
                            : 'border-[#141414] bg-[#2a2a2a] text-white'
                        }`}
                      >
                        +{bill.participants.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right — payment status */}
                <div
                  className={`w-full md:w-80 rounded-3xl p-5 md:p-6 z-10 border shrink-0 ${
                    isFirst
                      ? 'bg-black/10 backdrop-blur-md border-black/5'
                      : 'bg-[#2a2a2a] border-white/5'
                  }`}
                >
                  <h4
                    className={`font-black uppercase text-sm mb-4 tracking-tighter ${
                      isFirst ? 'text-black' : 'text-[#BCFF4F]'
                    }`}
                  >
                    Status Pembayaran
                  </h4>
                  <div className="space-y-3 mb-6">
                    {bill.participants.map((p) => (
                      <div key={p.id} className="flex justify-between items-center gap-2">
                        <div className="min-w-0">
                          <span
                            className={`font-bold truncate block text-sm ${
                              isFirst ? 'text-black' : 'text-white'
                            }`}
                          >
                            {p.name}
                          </span>
                          <span
                            className={`text-xs font-bold ${
                              isFirst ? 'text-black/50' : 'text-[#888888]'
                            }`}
                          >
                            {formatIDR(p.shareAmount)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleMarkPaid(bill.id, p.id)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all shrink-0 ${
                            p.isPaid
                              ? isFirst
                                ? 'bg-black text-[#BCFF4F]'
                                : 'bg-[#BCFF4F] text-[#0A0A0A]'
                              : isFirst
                              ? 'bg-black/20 text-black hover:bg-black/40'
                              : 'bg-white/5 text-[#888888] border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {p.isPaid ? 'Lunas' : 'Belum'}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSettle(bill.id)}
                      className={`flex-1 py-3 rounded-2xl font-black uppercase text-sm tracking-widest transition-all active:scale-95 ${
                        isFirst
                          ? 'bg-black text-white hover:bg-black/80'
                          : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Selesaikan
                    </button>
                    <button
                      onClick={() => handleDelete(bill.id)}
                      className={`px-4 py-3 rounded-2xl transition-all active:scale-95 ${
                        isFirst
                          ? 'bg-black/20 text-black hover:bg-red-500 hover:text-white'
                          : 'bg-white/5 text-[#888888] border border-white/10 hover:bg-red-500/20 hover:text-red-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#141414] rounded-[2.5rem] p-10 md:p-16 flex flex-col items-center justify-center text-center border border-[#BCFF4F]/15">
          <span className="material-symbols-outlined text-[#888888] text-6xl mb-4">
            call_split
          </span>
          <h4 className="text-xl md:text-2xl font-[900] text-white mb-2">
            {activeTab === 'pending' ? 'Tidak Ada Tagihan Aktif' : 'Belum Ada Riwayat'}
          </h4>
          <p className="text-[#888888] mb-8 text-sm md:text-base">
            {activeTab === 'pending'
              ? 'Buat split bill pertamamu!'
              : 'Split bill yang sudah selesai akan muncul di sini.'}
          </p>
          {activeTab === 'pending' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#BCFF4F] text-[#0A0A0A] px-8 py-4 rounded-full font-black"
            >
              Buat Split Bill
            </button>
          )}
        </div>
      )}
      </SearchableSection>

      {/* ── Create Modal ───────────────────────────────────────────────────── */}

      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-[#141414] w-full sm:max-w-2xl rounded-t-[2rem] sm:rounded-[2rem] p-6 md:p-10 border border-[#BCFF4F]/15 max-h-[92dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl md:text-4xl font-[900] tracking-[-0.04em] uppercase text-white">
                Buat Split Bill
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#888888] hover:text-white transition-colors p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-8">
              {/* Nama tagihan */}
              <div>
                <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">
                  Nama Tagihan
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Makan Siang Hokben"
                  className="w-full bg-transparent border-b-2 border-[#353534] focus:border-[#BCFF4F] focus:outline-none text-xl md:text-2xl font-bold py-4 transition-colors text-white placeholder:text-[#444]"
                />
              </div>

              {/* Tanggal + metode split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-[#353534] focus:border-[#BCFF4F] focus:outline-none text-lg md:text-xl font-bold py-4 transition-colors text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">
                    Metode Split
                  </label>
                  <select
                    value={splitMethod}
                    onChange={(e) => setSplitMethod(e.target.value as 'equal' | 'item')}
                    className="w-full bg-transparent border-b-2 border-[#353534] focus:border-[#BCFF4F] focus:outline-none text-xl md:text-2xl font-bold py-4 transition-colors text-white appearance-none cursor-pointer"
                  >
                    <option value="equal" className="bg-[#141414]">
                      Sama Rata
                    </option>
                    <option value="item" className="bg-[#141414]">
                      Per Item
                    </option>
                  </select>
                </div>
              </div>

              {/* ── Items ─────────────────────────────────────────────────── */}
              <div>
                <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-3">
                  Item / Menu
                </label>

                {/* Add item row */}
                <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_80px_120px_auto] gap-2 mb-4 items-end">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    placeholder="Nama item..."
                    className="col-span-3 sm:col-span-1 bg-[#0A0A0A] border border-[#BCFF4F]/15 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-[#BCFF4F] focus:outline-none text-sm"
                  />
                  <input
                    type="number"
                    min={1}
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(parseInt(e.target.value) || 1)}
                    placeholder="Qty"
                    className="bg-[#0A0A0A] border border-[#BCFF4F]/15 rounded-xl py-3 px-3 text-white focus:ring-1 focus:ring-[#BCFF4F] focus:outline-none text-sm w-full"
                  />
                  <input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    placeholder="Harga"
                    className="bg-[#0A0A0A] border border-[#BCFF4F]/15 rounded-xl py-3 px-3 text-white focus:ring-1 focus:ring-[#BCFF4F] focus:outline-none text-sm w-full"
                  />
                  <button
                    onClick={addItem}
                    className="text-[#BCFF4F] border-2 border-[#BCFF4F] border-dashed rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#BCFF4F]/10 shrink-0"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>

                {/* Item list */}
                {items.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {items.map((item, iIndex) => (
                      <div
                        key={iIndex}
                        className="bg-[#1C1B1B] border border-[#BCFF4F]/20 rounded-xl px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-white font-bold text-sm truncate">
                              {item.name}
                            </p>
                            <p className="text-[#888888] text-xs">
                              {item.qty} × {formatIDR(item.unitPrice)} ={' '}
                              <span className="text-[#BCFF4F] font-bold">
                                {formatIDR(item.subtotal)}
                              </span>
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(iIndex)}
                            className="text-[#888888] hover:text-red-500 transition-colors shrink-0"
                          >
                            <span className="material-symbols-outlined text-sm">
                              close
                            </span>
                          </button>
                        </div>

                        {/* Assignment per item — hanya tampil di mode Per Item DAN ada participant */}
                        {splitMethod === 'item' && participants.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/5">
                            {(() => {
                              const assignedMap = assignments[iIndex] || {};
                              const assignedTotal = Object.values(assignedMap).reduce((a, b) => a + b, 0);
                              const remaining = item.qty - assignedTotal;
                              return (
                                <>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[#888888] text-[10px] uppercase tracking-widest font-black">
                                      Atur Pembagian Qty
                                    </span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${remaining === 0 ? 'bg-[#BCFF4F]/20 text-[#BCFF4F]' : remaining < 0 ? 'bg-red-500/20 text-red-500' : 'bg-[#BCFF4F] text-black'}`}>
                                      Sisa Qty: {remaining}
                                    </span>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    {participants.map((p, pIndex) => {
                                      const assignedQty = assignedMap[pIndex] || 0;
                                      return (
                                        <div key={pIndex} className={`flex justify-between items-center rounded-lg px-3 py-2 border transition-colors ${assignedQty > 0 ? 'bg-[#BCFF4F]/10 border-[#BCFF4F]/20' : 'bg-black/20 border-white/5 hover:border-white/10'}`}>
                                          <div className="flex flex-col">
                                            <span className={`text-xs font-bold ${assignedQty > 0 ? 'text-white' : 'text-[#888888]'}`}>{p.name}</span>
                                            {assignedQty > 0 && (
                                              <span className="text-[#BCFF4F] text-[10px] font-black uppercase tracking-wider">
                                                {assignedQty} x {formatIDR(item.unitPrice)} = {formatIDR(assignedQty * item.unitPrice)}
                                              </span>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <button
                                              onClick={() => updateAssignmentQty(iIndex, pIndex, -1)}
                                              disabled={assignedQty === 0}
                                              className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 text-white disabled:opacity-30 hover:bg-white/20 transition-all font-black"
                                            >
                                              -
                                            </button>
                                            <span className="text-sm font-black w-4 text-center text-white">{assignedQty}</span>
                                            <button
                                              onClick={() => updateAssignmentQty(iIndex, pIndex, 1)}
                                              disabled={remaining <= 0}
                                              className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 text-white disabled:opacity-30 hover:bg-[#BCFF4F] hover:text-black transition-all font-black"
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                    {remaining > 0 && (
                                      <button
                                        onClick={() => assignAll(iIndex)}
                                        className="mt-1 w-full px-2 py-2 rounded-lg text-[10px] font-black uppercase bg-white/5 text-[#888888] border border-white/10 hover:bg-white/10 transition-all"
                                      >
                                        Bagi Sisa Secara Rata
                                      </button>
                                    )}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        )}

                        {/* Warning kalau item belum terbagi habis */}
                        {splitMethod === 'item' &&
                          participants.length > 0 &&
                          Object.values(assignments[iIndex] || {}).reduce((a, b) => a + b, 0) !== item.qty && (
                            <p className="text-yellow-500 text-[10px] font-bold mt-2">
                              ⚠ Qty belum habis atau berlebih
                            </p>
                          )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Total */}
                {items.length > 0 && (
                  <div className="flex justify-between items-center mt-4 px-4 py-3 bg-[#BCFF4F]/5 border border-[#BCFF4F]/20 rounded-xl">
                    <span className="text-[#888888] font-bold text-sm">
                      Total Tagihan
                    </span>
                    <span className="text-[#BCFF4F] font-black text-lg">
                      {formatIDR(totalBill)}
                    </span>
                  </div>
                )}
              </div>

              {/* ── Participants ───────────────────────────────────────────── */}
              <div>
                <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-3">
                  Tambah Orang
                </label>
                <div className="flex gap-2 items-center mb-4">
                  <input
                    type="text"
                    value={newParticipantName}
                    onChange={(e) => setNewParticipantName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
                    placeholder="Nama peserta..."
                    className="flex-1 bg-[#0A0A0A] border border-[#BCFF4F]/15 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-[#BCFF4F] focus:outline-none text-sm"
                  />
                  <button
                    onClick={addParticipant}
                    className="text-[#BCFF4F] border-2 border-[#BCFF4F] border-dashed rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#BCFF4F]/10 shrink-0"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>

                {participants.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {participants.map((p, i) => (
                      <div
                        key={i}
                        className="bg-[#1C1B1B] border border-[#BCFF4F]/20 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-[#BCFF4F] text-black flex items-center justify-center font-black text-xs shrink-0">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate text-sm">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {items.length > 0 && (
                            <span className="text-[#BCFF4F] text-sm font-black">
                              {formatIDR(calcLocalShare(i))}
                            </span>
                          )}
                          <button
                            onClick={() => removeParticipant(i)}
                            className="text-[#888888] hover:text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">
                              close
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={handleCreate}
                disabled={createMutation.isPending || !isFormValid}
                className="w-full bg-[#BCFF4F] text-[#0A0A0A] py-5 md:py-6 rounded-full font-[900] tracking-[-0.04em] text-base md:text-xl uppercase tracking-widest mt-4 transition-transform active:scale-95 shadow-[0_20px_40px_rgba(188,255,79,0.2)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {createMutation.isPending
                  ? 'Membuat...'
                  : !isFormValid && items.length === 0
                  ? 'Tambahkan item dulu'
                  : !isFormValid && participants.length === 0
                  ? 'Tambahkan peserta dulu'
                  : !isFormValid && splitMethod === 'item'
                  ? 'Assign semua item dulu'
                  : 'Konfirmasi & Kirim'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}