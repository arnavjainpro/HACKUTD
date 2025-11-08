'use client';

import { useMemo } from 'react';
import { useDashboardStore, CustomerRecord } from '@/lib/store';
import { mockCustomerData, getHappinessColor, getHappinessBackground, getStatusColor } from '@/lib/mockData';
import { Clock, TrendingUp } from 'lucide-react';

export default function DashboardTable() {
  const { searchQuery, filterStatus, setSelectedRecord } = useDashboardStore();

  const filteredData = useMemo(() => {
    return mockCustomerData.filter((record) => {
      const matchesSearch =
        searchQuery === '' ||
        record.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.product.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filterStatus === 'All' || record.followUpStatus === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterStatus]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Customer ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Rep ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Happiness Index
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData.map((record) => (
              <tr
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900 dark:text-white">{record.customerId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-gray-400">{record.repId}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">{record.product}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getHappinessBackground(
                        record.happinessIndex
                      )} ${getHappinessColor(record.happinessIndex)}`}
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {record.happinessIndex.toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.followUpStatus)}`}>
                    {record.followUpStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(record.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No records found matching your criteria.
        </div>
      )}
    </div>
  );
}
