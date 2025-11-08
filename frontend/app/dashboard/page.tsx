'use client';

import SearchBar from '@/components/SearchBar';
import DashboardTable from '@/components/DashboardTable';
import DetailPanel from '@/components/DetailPanel';
import Analytics from '@/components/Analytics';
import { Sparkles } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to Customer Happiness Hub</h1>
        <p className="text-pink-100">Monitor real-time customer satisfaction and AI-powered insights</p>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 border-2 border-dashed border-purple-300 dark:border-purple-700">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <div>
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
              Coming Soon: ElevenLabs Voice Summary Integration
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              AI-powered voice summaries will provide instant audio insights from customer interactions
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchBar />

      {/* Quick Analytics Overview */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Analytics</h2>
        <Analytics />
      </div>

      {/* Customer Records Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Customer Interactions</h2>
        <DashboardTable />
      </div>

      {/* Detail Panel Modal */}
      <DetailPanel />
    </div>
  );
}
