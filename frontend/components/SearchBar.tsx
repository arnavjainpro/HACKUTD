'use client';

import { useDashboardStore } from '@/lib/store';
import { Search, Filter } from 'lucide-react';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, filterStatus, setFilterStatus } = useDashboardStore();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Customer ID or Product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-colors"
        />
      </div>

      <div className="relative sm:w-64">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-600 transition-colors appearance-none cursor-pointer"
        >
          <option value="All">All Status</option>
          <option value="Resolved">Resolved</option>
          <option value="Pending">Pending</option>
          <option value="Escalated">Escalated</option>
        </select>
      </div>
    </div>
  );
}
