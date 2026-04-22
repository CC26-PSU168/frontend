import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Background Gears (decorative) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <span className="material-symbols-outlined animate-gear absolute top-20 left-[10%] text-[120px] text-white opacity-[0.06]">
          settings
        </span>
        <span className="material-symbols-outlined animate-gear-reverse absolute top-[40%] right-[5%] text-[200px] text-white opacity-[0.04]">
          settings
        </span>
        <span className="material-symbols-outlined animate-gear absolute bottom-[10%] left-[20%] text-[150px] text-white opacity-[0.05]">
          settings
        </span>
      </div>

      <Sidebar />

      <main className="ml-72 min-h-screen relative z-10">
        <TopBar />
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
