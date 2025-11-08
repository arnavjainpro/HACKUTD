'use client';

import { useMemo } from 'react';
import { mockCustomerData } from '@/lib/mockData';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, CheckCircle, AlertCircle } from 'lucide-react';

export default function Analytics() {
  const stats = useMemo(() => {
    const total = mockCustomerData.length;
    const avgHappiness = mockCustomerData.reduce((sum, r) => sum + r.happinessIndex, 0) / total;
    const resolved = mockCustomerData.filter((r) => r.followUpStatus === 'Resolved').length;
    const pending = mockCustomerData.filter((r) => r.followUpStatus === 'Pending').length;
    const escalated = mockCustomerData.filter((r) => r.followUpStatus === 'Escalated').length;

    return { total, avgHappiness, resolved, pending, escalated };
  }, []);

  const statusData = [
    { name: 'Resolved', value: stats.resolved, color: '#10b981' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Escalated', value: stats.escalated, color: '#ef4444' },
  ];

  const happinessTrend = useMemo(() => {
    return mockCustomerData.slice(0, 7).map((record, index) => ({
      time: `Call ${index + 1}`,
      happiness: record.happinessIndex,
    }));
  }, []);

  const productPerformance = useMemo(() => {
    const products = mockCustomerData.reduce((acc, record) => {
      if (!acc[record.product]) {
        acc[record.product] = { total: 0, happiness: 0 };
      }
      acc[record.product].total++;
      acc[record.product].happiness += record.happinessIndex;
      return acc;
    }, {} as Record<string, { total: number; happiness: number }>);

    return Object.entries(products).map(([product, data]) => ({
      product: product.length > 20 ? product.substring(0, 20) + '...' : product,
      avgHappiness: data.happiness / data.total,
    }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">Total Interactions</p>
          <p className="text-3xl font-bold mt-1">{stats.total}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-sm opacity-90">Avg Happiness</p>
          <p className="text-3xl font-bold mt-1">{stats.avgHappiness.toFixed(1)}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-sm opacity-90">Resolved</p>
          <p className="text-3xl font-bold mt-1">{stats.resolved}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-sm opacity-90">Escalated</p>
          <p className="text-3xl font-bold mt-1">{stats.escalated}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Happiness Trend */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Happiness Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={happinessTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line type="monotone" dataKey="happiness" stroke="#e20074" strokeWidth={3} dot={{ fill: '#e20074', r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Product Performance */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="product" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#9ca3af" domain={[0, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="avgHappiness" fill="#e20074" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
