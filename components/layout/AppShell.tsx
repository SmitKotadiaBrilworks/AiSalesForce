import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { AppLogo, AppName } from "../ui/appLogo";
import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 h-full">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-14 border-b bg-white flex items-center px-4 justify-between">
          <Link href="/" className="flex items-center gap-2">
            <AppLogo logoClassName="h-7" />
            <AppName className="text-lg" />
          </Link>
          <MobileNav />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
