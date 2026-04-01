'use client';

import { Shield, Activity, GitBranch, Command } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: Command },
    { name: 'Incidents', href: '/incidents', icon: Activity },
    { name: 'Playbooks', href: '/playbooks', icon: GitBranch },
  ];

  return (
    <aside className="w-64 border-r border-soc-card bg-[#0a0d14] flex flex-col items-center py-6">
      <Link href="/">
        <div className="flex items-center gap-2 mb-10 w-full px-6 text-soc-accent font-bold text-2xl tracking-wider cursor-pointer hover:text-white transition-colors duration-200">
          <Shield className="w-8 h-8" />
          ASUSOAR
        </div>
      </Link>
      
      <nav className="flex flex-col w-full px-4 gap-2 text-sm text-gray-400">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`py-3 px-4 rounded-lg flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'bg-soc-card text-soc-accent font-medium shadow-sm border border-soc-accent/10'
                    : 'hover:bg-soc-card hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" /> {item.name}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
