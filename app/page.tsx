import { ChatWidget } from "@/components/chat-widget/ChatWidget";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="h-16 border-b flex items-center justify-between px-8">
        <div className="font-bold text-xl text-indigo-600">AI SalesFlow</div>
        <nav className="flex gap-4">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl">
          Capture Every Lead. <br />
          <span className="text-indigo-600">Instantly.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl">
          AI SalesFlow engages your website visitors 24/7, qualifies leads, and
          schedules meetings automatically. Stop losing potential customers to
          slow response times.
        </p>
        <div className="flex gap-4">
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8"
          >
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8">
            View Demo
          </Button>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-500 text-sm">
        © 2024 AI SalesFlow. All rights reserved.
      </footer>

      <ChatWidget />
    </div>
  );
}
