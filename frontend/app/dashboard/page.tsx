'use client';

import { useEffect } from 'react';
import { usePMDashboardStore } from '@/lib/pmStore';
import { calculateProductHappiness } from '@/lib/feedbackUtils';
import { TrendingDown, AlertTriangle, CheckCircle2, TrendingUp, Minus } from 'lucide-react';
import Link from 'next/link';

export default function PMDashboardPage() {
  const { theme } = usePMDashboardStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const products = calculateProductHappiness();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Product Happiness Index */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Customer Happiness Index (CHI)
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time product satisfaction scores based on customer feedback
            </p>
          </div>
          <TrendingDown className="w-8 h-8 text-pink-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Link
              key={product.product}
              href={`/dashboard/product/${encodeURIComponent(product.product)}`}
              className="block"
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border-2 border-transparent hover:border-pink-500 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400">
                    {product.product}
                  </h3>
                  {product.happinessScore >= 70 ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : product.happinessScore >= 40 ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                </div>

                {/* Happiness Score */}
                <div className="mb-4">
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {product.happinessScore}%
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      happiness
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        product.happinessScore >= 70
                          ? 'bg-green-500'
                          : product.happinessScore >= 40
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${product.happinessScore}%` }}
                    />
                  </div>
                  
                  {/* Daily Change Indicator */}
                  <div className="flex items-center gap-1 text-xs">
                    {product.dailyChange > 0 ? (
                      <>
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Improved by {product.dailyChange}% since yesterday
                        </span>
                      </>
                    ) : product.dailyChange < 0 ? (
                      <>
                        <TrendingDown className="w-3 h-3 text-red-600" />
                        <span className="text-red-600 dark:text-red-400 font-medium">
                          Declined by {Math.abs(product.dailyChange)}% since yesterday
                        </span>
                      </>
                    ) : (
                      <>
                        <Minus className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          No change since yesterday
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="bg-white dark:bg-gray-900 rounded p-2">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {product.totalFeedback}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded p-2">
                    <div className="font-bold text-red-600">
                      {product.technicalIssues}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Technical</div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded p-2">
                    <div className="font-bold text-blue-600">
                      {product.feedbackItems}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Feedback</div>
                  </div>
                </div>

                <div className="mt-4 text-center text-sm text-pink-600 dark:text-pink-400 font-medium group-hover:underline">
                  View Details & Take Action →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {products.reduce((sum, p) => sum + p.totalFeedback, 0)}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Total Feedback Items</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="text-3xl font-bold text-red-600 mb-1">
            {products.reduce((sum, p) => sum + p.technicalIssues, 0)}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Technical Issues</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {products.filter(p => p.happinessScore >= 70).length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Healthy Products</div>
        </div>
      </div>
    </div>
  );
}
