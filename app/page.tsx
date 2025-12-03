import { ChatWidget } from "@/components/chat-widget/ChatWidget";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="absolute top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          AI SalesFlow
        </div>
        <nav className="flex gap-4 items-center">
          <Link href="#features">
            <Button variant="ghost">Features</Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="ghost">How It Works</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              Sign In
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <HeroSection />
        <div id="features">
          <FeatureGrid />
        </div>
        <div id="how-it-works">
          <HowItWorks />
        </div>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Sales?
            </h2>
            <p className="text-xl mb-8 text-indigo-100">
              Join hundreds of companies already using AI SalesFlow to capture
              and convert more leads.
            </p>
            <Link href="/login">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-slate-100 px-8 py-6 text-lg shadow-xl"
              >
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-slate-900 text-slate-400 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            AI SalesFlow
          </div>
          <p className="text-sm">
            © 2024 AI SalesFlow. All rights reserved. Built with ❤️ by
            Brilworks.
          </p>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}
