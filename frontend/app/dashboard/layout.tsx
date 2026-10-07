import Navbar from "../components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* Aurora orbs — gerak pelan */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="animate-aurora absolute -top-32 left-[18%] h-[420px] w-[720px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="animate-aurora-slow absolute -left-40 top-1/3 h-[380px] w-[380px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="animate-aurora absolute -right-32 top-2/3 h-[300px] w-[300px] rounded-full bg-sky-500/[0.07] blur-[120px]" />
      </div>

      <Navbar />

      <main className="mx-auto w-[min(1160px,92vw)] pb-24 pt-36">
        {children}
      </main>
    </div>
  );
}