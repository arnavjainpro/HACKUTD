'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { usePMDashboardStore } from '@/lib/pmStore';

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = usePMDashboardStore();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 h-screen sticky top-0 flex flex-col`}>
      <div className="p-6 flex-1">
        <div className={`flex flex-col gap-2 mb-8 items-center`}>
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg blur-md opacity-60"></div>
            <Image 
              src="/aura-logo.png" 
              alt="A.U.R.A." 
              width={56} 
              height={56} 
              className="rounded-lg flex-shrink-0 relative z-10 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]"
            />
          </div>
          {!sidebarCollapsed && (
            <div className="text-center">
              <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                A.U.R.A.
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Automated Unified Response Agent
              </p>
            </div>
          )}
        </div>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? link.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="font-medium">{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section with Toggle and Logout */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-800">
        <div className="space-y-2">
          <button
            onClick={toggleSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full ${sidebarCollapsed ? 'justify-center' : ''}`}
            title={sidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 flex-shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">Collapse</span>
              </>
            )}
          </button>
          
          <a
            href="/api/auth/logout"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            title={sidebarCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Logout</span>}
          </a>
        </div>
      </div>
    </aside>
  );
}
