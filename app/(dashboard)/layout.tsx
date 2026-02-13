import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <Topbar />

          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
