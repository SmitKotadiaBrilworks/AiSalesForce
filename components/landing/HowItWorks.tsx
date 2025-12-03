"use client";

import { motion } from "framer-motion";
import { MousePointer, Sparkles, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: MousePointer,
    title: "Visitor Arrives",
    description:
      "A potential customer lands on your website and opens the chat widget.",
    color: "indigo",
  },
  {
    icon: Sparkles,
    title: "AI Engages",
    description:
      "Our AI instantly greets them, asks qualifying questions, and captures their details.",
    color: "purple",
  },
  {
    icon: CheckCircle,
    title: "You Close",
    description:
      "Qualified leads land in your inbox with AI-generated summaries. You take over and close.",
    color: "green",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Three simple steps from visitor to qualified lead.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-green-500 opacity-50" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 flex items-center justify-center mb-6 relative z-10 shadow-lg`}
                  >
                    <Icon className="h-10 w-10 text-white" />
                  </motion.div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/10 rounded-full blur-xl" />

                  <div className="text-sm font-bold text-indigo-300 mb-2">
                    Step {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-indigo-200 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
