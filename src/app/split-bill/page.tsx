'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useSplitBills, useCreateSplitBill, useMarkPaid, useSettleBill, useDeleteSplitBill } from '@/hooks/useSplitBills';
import { formatIDR, formatDateShort } from '@/lib/formatters';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function SplitBillPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'settled'>('pending');
  const { data: bills, isLoading } = useSplitBills(activeTab === 'pending' ? 'pending' : 'settled');

  const createMutation = useCreateSplitBill();
  const markPaidMutation = useMarkPaid();
  const settleMutation = useSettleBill();
  const deleteMutation = useDeleteSplitBill();

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create form state
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState<{ name: string; shareAmount: number }[]>([]);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [splitMethod, setSplitMethod] = useState<'equal' | 'custom'>('equal');

  const pendingBills = bills?.filter((b) => !b.isSettled) || [];
  const totalPiutang = pendingBills.reduce((sum, b) => {
    const unpaid = b.participants.filter((p) => !p.isPaid).reduce((s, p) => s + p.shareAmount, 0);
    return sum + unpaid;
  }, 0);
  const totalFriends = new Set(bills?.flatMap((b) => b.participants.map((p) => p.name)) || []).size;

  const addParticipant = () => {
    if (!newParticipantName.trim()) return;
    const total = parseFloat(totalAmount) || 0;
    const count = participants.length + 1;
    const share = splitMethod === 'equal' ? Math.round(total / count) : 0;

    const updatedParticipants = splitMethod === 'equal'
      ? [...participants.map((p) => ({ ...p, shareAmount: share })), { name: newParticipantName.trim(), shareAmount: share }]
      : [...participants, { name: newParticipantName.trim(), shareAmount: 0 }];

    setParticipants(updatedParticipants);
    setNewParticipantName('');
  };

  const removeParticipant = (index: number) => {
    const updated = participants.filter((_, i) => i !== index);
    if (splitMethod === 'equal' && updated.length > 0) {
      const total = parseFloat(totalAmount) || 0;
      const share = Math.round(total / updated.length);
      setParticipants(updated.map((p) => ({ ...p, shareAmount: share })));
    } else {
      setParticipants(updated);
    }
  };

  const handleCreate = async () => {
    if (!title || !totalAmount || participants.length === 0) return;
    try {
      await createMutation.mutateAsync({
        title,
        totalAmount: parseFloat(totalAmount),
        date,
        participants,
      });
      toast.success('Split bill berhasil dibuat!');
      setShowCreateModal(false);
      setTitle('');
      setTotalAmount('');
      setParticipants([]);
    } catch {
      toast.error('Gagal membuat split bill');
    }
  };

  const handleMarkPaid = async (splitBillId: string, participantId: string) => {
    try {
      await markPaidMutation.mutateAsync({ splitBillId, participantId });
      toast.success('Status pembayaran diperbarui');
    } catch {
      toast.error('Gagal memperbarui status');
    }
  };

  const handleSettle = async (id: string) => {
    try {
      await settleMutation.mutateAsync(id);
      toast.success('Split bill diselesaikan!');
    } catch {
      toast.error('Gagal menyelesaikan');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Split bill dihapus');
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="mb-12">
          <Skeleton className="h-14 w-64 bg-[#2A2A2A] mb-4" />
        </div>
        <div className="flex gap-4 mb-12">
          <Skeleton className="h-16 w-64 bg-[#1C1B1B] rounded-full" />
          <Skeleton className="h-16 w-48 bg-[#1C1B1B] rounded-full" />
          <Skeleton className="h-16 w-48 bg-[#1C1B1B] rounded-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 w-full bg-[#1C1B1B] rounded-[2.5rem]" />
          <Skeleton className="h-48 w-full bg-[#1C1B1B] rounded-[2.5rem]" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-12">
        <h2 className="text-4xl md:text-6xl font-[900] tracking-[-0.04em] uppercase leading-none text-white">Split Bill.</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
          <div className="flex bg-[#141414] p-1 rounded-full overflow-x-auto w-full sm:w-auto shrink-0">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 sm:flex-none px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${
                activeTab === 'pending' ? 'bg-[#2a2a2a] text-[#BCFF4F]' : 'text-[#888888] hover:text-white'
              }`}
            >
              Belum Lunas
            </button>
            <button
              onClick={() => setActiveTab('settled')}
              className={`flex-1 sm:flex-none px-8 py-3 rounded-full font-bold transition-all whitespace-nowrap ${
                activeTab === 'settled' ? 'bg-[#2a2a2a] text-[#BCFF4F]' : 'text-[#888888] hover:text-white'
              }`}
            >
              Riwayat
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#BCFF4F] text-[#0A0A0A] px-8 py-3 md:py-4 h-auto whitespace-nowrap rounded-full font-[900] tracking-[-0.04em] flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_0_30px_rgba(188,255,79,0.2)] w-full sm:w-auto"
          >
            Buat Split Bill <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
        <div className="bg-[#1C1B1B] px-8 py-4 rounded-full flex items-center gap-3 whitespace-nowrap border border-[#BCFF4F]/10">
          <span className="w-3 h-3 bg-[#BCFF4F] rounded-full shadow-[0_0_10px_#BCFF4F]" />
          <span className="text-[#888888] font-bold">Total Piutang:</span>
          <span className="text-white font-black text-xl">{formatIDR(totalPiutang)}</span>
        </div>
        <div className="bg-[#1C1B1B] px-8 py-4 rounded-full flex items-center gap-3 whitespace-nowrap border border-[#BCFF4F]/10">
          <span className="w-3 h-3 bg-[#BCFF4F] rounded-full shadow-[0_0_10px_#BCFF4F]" />
          <span className="text-[#888888] font-bold">Aktif:</span>
          <span className="text-white font-black text-xl">{pendingBills.length} Tagihan</span>
        </div>
        <div className="bg-[#1C1B1B] px-8 py-4 rounded-full flex items-center gap-3 whitespace-nowrap border border-[#BCFF4F]/10">
          <span className="w-3 h-3 bg-[#BCFF4F] rounded-full shadow-[0_0_10px_#BCFF4F]" />
          <span className="text-[#888888] font-bold">Teman Terlibat:</span>
          <span className="text-white font-black text-xl">{totalFriends} Orang</span>
        </div>
      </div>

      {/* Cards */}
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
                } p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-start relative overflow-hidden group transition-colors`}
              >
                {isFirst && <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />}

                {/* Left section */}
                <div className="flex-1 z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`${isFirst ? 'bg-black/10 text-black' : 'bg-[#BCFF4F]/10 text-[#BCFF4F]'} px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest`}>
                      {bill.title}
                    </span>
                    <span className={`font-bold text-xs uppercase tracking-widest ${isFirst ? 'text-black/50' : 'text-[#888888]'}`}>
                      {formatDateShort(bill.date)}
                    </span>
                  </div>
                  <h3 className={`text-4xl font-[900] tracking-[-0.04em] mb-2 leading-tight ${isFirst ? 'text-black' : 'text-white'}`}>
                    {bill.title}
                  </h3>
                  <p className={`font-bold text-lg mb-8 ${isFirst ? 'text-black/60' : 'text-[#888888]'}`}>
                    Total: {formatIDR(bill.totalAmount)}
                  </p>
                  {/* Participant initials */}
                  <div className="flex -space-x-3">
                    {bill.participants.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-4 ${
                          isFirst
                            ? 'border-[#BCFF4F] bg-black text-[#BCFF4F]'
                            : 'border-[#141414] bg-[#BCFF4F] text-black'
                        }`}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {bill.participants.length > 3 && (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-4 ${
                        isFirst ? 'border-[#BCFF4F] bg-black text-[#BCFF4F]' : 'border-[#141414] bg-[#2a2a2a] text-white'
                      }`}>
                        +{bill.participants.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right section — payment status */}
                <div className={`w-full md:w-80 rounded-3xl p-6 z-10 border ${
                  isFirst
                    ? 'bg-black/10 backdrop-blur-md border-black/5'
                    : 'bg-[#2a2a2a] border-white/5'
                }`}>
                  <h4 className={`font-black uppercase text-sm mb-4 tracking-tighter ${isFirst ? 'text-black' : 'text-[#BCFF4F]'}`}>
                    Status Pembayaran
                  </h4>
                  <div className="space-y-3 mb-6">
                    {bill.participants.map((p) => (
                      <div key={p.id} className="flex justify-between items-center">
                        <span className={`font-bold ${isFirst ? 'text-black' : 'text-white'}`}>{p.name}</span>
                        <button
                          onClick={() => handleMarkPaid(bill.id, p.id)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
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
        <div className="bg-[#141414] rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center border border-[#BCFF4F]/15">
          <span className="material-symbols-outlined text-[#888888] text-6xl mb-4">call_split</span>
          <h4 className="text-2xl font-[900] text-white mb-2">
            {activeTab === 'pending' ? 'Tidak Ada Tagihan Aktif' : 'Belum Ada Riwayat'}
          </h4>
          <p className="text-[#888888] mb-8">
            {activeTab === 'pending' ? 'Buat split bill pertamamu!' : 'Split bill yang sudah selesai akan muncul di sini.'}
          </p>
          {activeTab === 'pending' && (
            <button onClick={() => setShowCreateModal(true)} className="bg-[#BCFF4F] text-[#0A0A0A] px-8 py-4 rounded-full font-black">
              Buat Split Bill
            </button>
          )}
        </div>
      )}

      {/* Create Split Bill Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center" onClick={() => setShowCreateModal(false)}>
          <div className="bg-[#141414] w-full max-w-2xl rounded-[2rem] p-10 border border-[#BCFF4F]/15 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-4xl font-[900] tracking-[-0.04em] uppercase text-white mb-8">Buat Split Bill</h3>
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">Nama Tagihan</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Makan Siang Hokben"
                  className="w-full bg-transparent border-b-2 border-[#353534] focus:border-[#BCFF4F] focus:ring-0 text-2xl font-bold py-4 transition-colors text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">Total Tagihan</label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => {
                      setTotalAmount(e.target.value);
                      if (splitMethod === 'equal' && participants.length > 0) {
                        const share = Math.round(parseFloat(e.target.value) / participants.length);
                        setParticipants(participants.map((p) => ({ ...p, shareAmount: share })));
                      }
                    }}
                    placeholder="Rp 0"
                    className="w-full bg-transparent border-b-2 border-[#353534] focus:border-[#BCFF4F] focus:ring-0 text-2xl font-bold py-4 transition-colors text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">Metode Split</label>
                  <select
                    value={splitMethod}
                    onChange={(e) => setSplitMethod(e.target.value as 'equal' | 'custom')}
                    className="w-full bg-transparent border-b-2 border-[#353534] focus:border-[#BCFF4F] focus:ring-0 text-2xl font-bold py-4 transition-colors text-white appearance-none cursor-pointer"
                  >
                    <option value="equal">Sama Rata</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">Tanggal</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#353534] focus:border-[#BCFF4F] focus:ring-0 text-xl font-bold py-4 transition-colors text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-[#BCFF4F] uppercase tracking-widest block mb-2">Tambah Orang</label>
                <div className="flex gap-2 items-center mb-4">
                  <input
                    type="text"
                    value={newParticipantName}
                    onChange={(e) => setNewParticipantName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
                    placeholder="Nama peserta..."
                    className="flex-1 bg-[#0A0A0A] border border-[#BCFF4F]/15 rounded-xl py-3 px-4 text-white focus:ring-1 focus:ring-[#BCFF4F]"
                  />
                  <button
                    onClick={addParticipant}
                    className="text-[#BCFF4F] border-2 border-[#BCFF4F] border-dashed rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#BCFF4F]/10"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  {participants.map((p, i) => (
                    <div key={i} className="bg-[#1C1B1B] border border-[#BCFF4F]/20 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#BCFF4F] text-black flex items-center justify-center font-black text-xs">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{p.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {splitMethod === 'equal' ? (
                          <span className="text-[#BCFF4F]">{formatIDR(p.shareAmount)}</span>
                        ) : (
                          <input
                            type="number"
                            value={p.shareAmount || ''}
                            onChange={(e) => {
                              const newParticipants = [...participants];
                              newParticipants[i] = { 
                                ...newParticipants[i], 
                                shareAmount: e.target.value ? parseFloat(e.target.value) : 0 
                              };
                              setParticipants(newParticipants);
                            }}
                            placeholder="Rp 0"
                            className="bg-[#0A0A0A] border border-[#BCFF4F]/20 rounded-lg py-1 px-3 text-right text-[#BCFF4F] focus:ring-1 focus:ring-[#BCFF4F] w-32"
                          />
                        )}
                        <button onClick={() => removeParticipant(i)} className="text-[#888888] hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleCreate}
                disabled={
                  createMutation.isPending || 
                  !title || 
                  !totalAmount || 
                  participants.length === 0 ||
                  (splitMethod === 'custom' && participants.reduce((sum, p) => sum + (p.shareAmount || 0), 0) !== parseFloat(totalAmount))
                }
                className="w-full bg-[#BCFF4F] text-[#0A0A0A] py-6 rounded-full font-[900] tracking-[-0.04em] text-xl uppercase tracking-widest mt-4 transition-transform active:scale-95 shadow-[0_20px_40px_rgba(188,255,79,0.2)] disabled:opacity-50"
              >
                {createMutation.isPending ? 'Membuat...' : 
                  (splitMethod === 'custom' && participants.length > 0 && participants.reduce((sum, p) => sum + (p.shareAmount || 0), 0) !== parseFloat(totalAmount)) 
                    ? `Total Tidak Sesuai (${formatIDR(participants.reduce((sum, p) => sum + (p.shareAmount || 0), 0))} / ${formatIDR(parseFloat(totalAmount) || 0)})`
                    : 'Konfirmasi & Kirim'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
