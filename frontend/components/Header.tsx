'use client';

import { useDashboardStore } from '@/lib/store';
import { Moon, Sun } from 'lucide-react';

export default function Header() {
  const { theme, toggleTheme } = useDashboardStore();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Customer Happiness Hub
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">T-Mobile Customer Service Dashboard</p>
        </div>
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>
    </header>
  );
}
