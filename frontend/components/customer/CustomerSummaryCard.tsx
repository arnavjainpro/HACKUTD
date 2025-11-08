'use client';

import { Phone, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { getHappinessColor, getHappinessBackground } from '@/lib/mockData';

interface CustomerSummaryCardProps {
  customerName: string;
  product: string;
  callDuration: number;
  happinessIndex: number;
  resolutionStatus: string;
  callDate: string;
}

export default function CustomerSummaryCard({
  customerName,
  product,
  callDuration,
  happinessIndex,
  resolutionStatus,
  callDate,
}: CustomerSummaryCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Latest Interaction Summary</h2>
        <p className="text-pink-100 text-sm">{callDate}</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Product Discussed</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{product}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Call Duration</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{callDuration} minutes</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Status</span>
              </div>
              <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                {resolutionStatus}
              </span>
            </div>
          </div>

          {/* Happiness Index - Large Display */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Your Satisfaction Score</span>
            </div>
            <div
              className={`text-6xl font-bold mb-2 ${getHappinessColor(happinessIndex)}`}
            >
              {happinessIndex.toFixed(1)}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">out of 10</p>
              <p className={`text-lg font-semibold mt-2 ${getHappinessColor(happinessIndex)}`}>
                {happinessIndex >= 7.5 ? '😊 Great Experience!' : happinessIndex >= 5 ? '😐 Good' : '😞 Needs Improvement'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
