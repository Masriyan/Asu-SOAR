'use client';

import { motion } from 'framer-motion';
import { Activity, GitBranch, Cpu, Database } from 'lucide-react';

export default function Home() {
  const stats = [
    { label: 'Active Incidents', value: '14', icon: Activity, color: 'text-soc-danger' },
    { label: 'Playbooks Running', value: '1,024', icon: GitBranch, color: 'text-soc-accent' },
    { label: 'Integrations', value: '984', icon: Database, color: 'text-soc-warning' },
    { label: 'ASUBot Accuracy', value: '98.2%', icon: Cpu, color: 'text-soc-success' },
  ];

  return (
    <div className="p-8 pb-20 w-full min-h-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-10">
          <h1 className="text-3xl font-semibold mb-2 shadow-soc-accent">Security Operations Platform</h1>
          <p className="text-gray-400">Welcome back. Here is the latest SOC activity.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-soc-card border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-soc-accent/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gray-400 font-medium text-sm">{stat.label}</span>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  );
}
