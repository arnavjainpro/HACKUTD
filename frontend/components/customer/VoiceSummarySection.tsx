'use client';

import { useState } from 'react';
import { Mic, Sparkles, Volume2 } from 'lucide-react';

interface VoiceSummarySectionProps {
  summary: string;
}

export default function VoiceSummarySection({ summary }: VoiceSummarySectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSummary = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Mic className="w-6 h-6 text-pink-600" />
          Voice Summary
        </h2>
        <span className="flex items-center gap-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full">
          <Sparkles className="w-3 h-3" />
          AI Powered by ElevenLabs
        </span>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 mb-4">
        <div className="flex items-start gap-3 mb-4">
          <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1" />
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {summary}
          </p>
        </div>
      </div>

      <button
        onClick={handleGenerateSummary}
        disabled={isGenerating}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
          isGenerating
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
        }`}
      >
        <Mic className="w-5 h-5" />
        {isGenerating ? 'Generating Voice Summary...' : 'Generate Voice Summary'}
      </button>

      {isGenerating && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-pink-600 border-t-transparent"></div>
          Processing with ElevenLabs AI...
        </div>
      )}
    </div>
  );
}
