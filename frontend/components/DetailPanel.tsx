'use client';

import { useDashboardStore } from '@/lib/store';
import { getHappinessColor, getStatusColor } from '@/lib/mockData';
import { X, User, Phone, Package, TrendingUp, Clock, CheckCircle, Mic, Brain, Sparkles } from 'lucide-react';

export default function DetailPanel() {
  const { selectedRecord, setSelectedRecord } = useDashboardStore();

  if (!selectedRecord) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Customer Interaction Details</h2>
          <button
            onClick={() => setSelectedRecord(null)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Customer Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                <User className="w-4 h-4" />
                <span className="text-sm">Customer ID</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedRecord.customerId}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                <Phone className="w-4 h-4" />
                <span className="text-sm">Rep ID</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedRecord.repId}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                <Package className="w-4 h-4" />
                <span className="text-sm">Product</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedRecord.product}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Status</span>
              </div>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedRecord.followUpStatus)}`}>
                {selectedRecord.followUpStatus}
              </span>
            </div>
          </div>

          {/* Happiness Breakdown */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-600" />
              Happiness Index Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Overall Score</p>
                <p className={`text-3xl font-bold ${getHappinessColor(selectedRecord.happinessIndex)}`}>
                  {selectedRecord.happinessIndex.toFixed(1)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tonality</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{(selectedRecord.tonality * 100).toFixed(0)}%</p>
                  <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-pink-600 rounded-full" style={{ width: `${selectedRecord.tonality * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Resolution</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{(selectedRecord.resolution * 100).toFixed(0)}%</p>
                  <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: `${selectedRecord.resolution * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedRecord.duration}m</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call Transcript */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Mic className="w-5 h-5 text-pink-600" />
              Call Transcript
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedRecord.transcript}</p>
            </div>
          </div>

          {/* ElevenLabs Summary (Placeholder) */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-600" />
              AI Voice Summary
              <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full">
                Coming Soon
              </span>
            </h3>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border-2 border-dashed border-purple-200 dark:border-purple-800">
              <p className="text-center text-gray-600 dark:text-gray-400">
                🎙️ ElevenLabs voice summary integration will provide AI-generated audio summaries of customer interactions
              </p>
            </div>
          </div>

          {/* AI Actions (Routing Agent - Placeholder) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-pink-600" />
              AI Suggested Actions
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                NVIDIA Challenge
              </span>
            </h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border-2 border-dashed border-blue-200 dark:border-blue-800">
              <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                🤖 Gemini AI Routing Agent will suggest:
              </p>
              <ul className="text-left text-gray-700 dark:text-gray-300 space-y-2 max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-pink-600">•</span>
                  Follow-up recommendations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600">•</span>
                  Product upgrade opportunities
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600">•</span>
                  Escalation priorities
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-600">•</span>
                  Personalized resolution strategies
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
