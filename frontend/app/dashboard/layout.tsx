import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[1400px] gap-4 px-4 pb-10 md:px-6">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        {children}
      </div>
    </div>
  );
}
