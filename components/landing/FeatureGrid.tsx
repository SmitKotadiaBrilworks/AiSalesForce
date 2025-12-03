"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Brain,
  MessageSquare,
  BarChart3,
  Clock,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Capture",
    description:
      "Every lead is captured the moment they reach out—no forms, no delays.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Brain,
    title: "AI Qualification",
    description:
      "AI analyzes intent, budget, and timeline to prioritize your hottest leads.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: MessageSquare,
    title: "Auto Replies",
    description:
      "Send personalized responses instantly, matching your brand voice perfectly.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Unified Dashboard",
    description:
      "See all leads, conversations, and insights in one beautiful interface.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Your AI never sleeps. Capture leads even when your team is offline.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level encryption and compliance. Your data is always safe.",
    gradient: "from-violet-500 to-purple-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function FeatureGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Built for Scale, Designed for Speed
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything your sales team needs to capture, qualify, and convert
            leads faster than ever.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="group relative p-8 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-xl transition-all cursor-pointer"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
