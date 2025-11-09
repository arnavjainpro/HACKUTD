'use client';

import { useEffect, useState } from 'react';
import { usePMDashboardStore } from '@/lib/pmStore';
import { getFeedbackByProduct } from '@/lib/feedbackUtils';
import { ArrowLeft, Phone, Loader2, Sparkles, Gift, Wrench, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type { FeedbackItem } from '@/lib/feedbackUtils';

export default function ProductDetailPage({ params }: { params: { product: string } }) {
  const productName = decodeURIComponent(params.product);
  const { theme, isEscalating, isCalling, setIsEscalating, setIsCalling } = usePMDashboardStore();
  
  const [allFeedback, setAllFeedback] = useState<FeedbackItem[]>([]);
  const [escalationResult, setEscalationResult] = useState<string | null>(null);
  const [callResult, setCallResult] = useState<string | null>(null);
  const [promotionResult, setPromotionResult] = useState<string | null>(null);
  const [isGeneratingPromotion, setIsGeneratingPromotion] = useState(false);

  // Mock CHI data over time (last 7 days)
  const chiData = [
    { day: 'Mon', score: 45 },
    { day: 'Tue', score: 42 },
    { day: 'Wed', score: 38 },
    { day: 'Thu', score: 35 },
    { day: 'Fri', score: 30 },
    { day: 'Sat', score: 25 },
    { day: 'Sun', score: productName === 'Business Unlimited' ? 100 : productName === 'Magenta Max' ? 50 : 0 },
  ];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    setAllFeedback(getFeedbackByProduct(productName));
  }, [theme, productName]);

  const handleEscalateTech = async () => {
    setIsEscalating(true);
    setEscalationResult(null);
    
    const technicalIssues = allFeedback.filter(f => f.type === 'Technical');
    
    try {
      const response = await fetch('/api/escalate-tech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: productName,
          issues: technicalIssues.map(t => t.transcript)
        })
      });
      
      const data = await response.json();
      setEscalationResult(data.ticket);
    } catch (error) {
      console.error('Escalation failed:', error);
      setEscalationResult('Error: Failed to generate ticket');
    } finally {
      setIsEscalating(false);
    }
  };

  const handleGeneratePromotion = async () => {
    setIsGeneratingPromotion(true);
    setPromotionResult(null);
    
    const feedbackItems = allFeedback.filter(f => f.type === 'Feedback');
    
    try {
      const response = await fetch('/api/generate-promotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: productName,
          feedback: feedbackItems.map(f => f.transcript)
        })
      });
      
      const data = await response.json();
      setPromotionResult(data.promotion);
    } catch (error) {
      console.error('Promotion generation failed:', error);
      setPromotionResult('Error: Failed to generate promotion');
    } finally {
      setIsGeneratingPromotion(false);
    }
  };

  const handleMassCall = async () => {
    setIsCalling(true);
    setCallResult(null);
    
    const feedbackItems = allFeedback.filter(f => f.type === 'Feedback' && f.phone);
    
    try {
      const response = await fetch('/api/feedback-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: feedbackItems[0]?.id || 0,
          transcript: feedbackItems.map(f => f.transcript).join('\n'),
          phone: feedbackItems.map(f => f.phone).join(', ')
        })
      });
      
      const data = await response.json();
      setCallResult(data.memo);
    } catch (error) {
      console.error('Call failed:', error);
      setCallResult('Error: Failed to complete calls');
    } finally {
      setIsCalling(false);
    }
  };

  const technicalCount = allFeedback.filter(f => f.type === 'Technical').length;
  const feedbackCount = allFeedback.filter(f => f.type === 'Feedback').length;
  const currentCHI = chiData[chiData.length - 1].score;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{productName}</h1>
      </div>

      {/* CHI Graph */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-pink-600" />
              Customer Happiness Index (CHI) Trend
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Last 7 days performance
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {currentCHI}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Current CHI</div>
          </div>
        </div>

        {/* Graph */}
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-between gap-2">
            {chiData.map((data, index) => {
              const height = `${data.score}%`;
              const isLast = index === chiData.length - 1;
              return (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t relative group">
                    <div
                      className={`w-full rounded-t transition-all ${
                        data.score >= 70
                          ? 'bg-green-500'
                          : data.score >= 40
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      } ${isLast ? 'ring-2 ring-pink-600' : ''}`}
                      style={{ height }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.score}%
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {data.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {allFeedback.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Feedback</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {technicalCount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Technical Issues</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {feedbackCount}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Customer Feedback</div>
          </div>
        </div>
      </div>

      {/* All Feedback Items */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          All Feedback & Issues
        </h2>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {allFeedback.map((item) => (
            <div
              key={item.id}
              className={`rounded-lg p-4 border-2 ${
                item.type === 'Technical'
                  ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                  : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        item.type === 'Technical'
                          ? 'bg-red-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-xs text-gray-400">#{item.id}</span>
                  </div>
                  <p className="text-gray-900 dark:text-white text-sm">
                    {item.transcript}
                  </p>
                  {item.location && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      📍 {item.location}
                    </p>
                  )}
                  {item.phone && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      📞 {item.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Button 1: Generate Loyalty Promotions */}
        <button
          onClick={handleGeneratePromotion}
          disabled={isGeneratingPromotion}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
        >
          <div className="flex flex-col items-center gap-2">
            {isGeneratingPromotion ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm">Generating...</span>
              </>
            ) : (
              <>
                <Gift className="w-8 h-8" />
                <span className="text-lg">Generate Loyalty Promotions</span>
                <span className="text-xs opacity-80">Gemini AI-powered offers</span>
              </>
            )}
          </div>
        </button>

        {/* Button 2: Raise Tech Support Ticket */}
        <button
          onClick={handleEscalateTech}
          disabled={isEscalating}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
        >
          <div className="flex flex-col items-center gap-2">
            {isEscalating ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm">Creating Ticket...</span>
              </>
            ) : (
              <>
                <Wrench className="w-8 h-8" />
                <span className="text-lg">Raise Tech Support Ticket</span>
                <span className="text-xs opacity-80">Gemini AI ticket generation</span>
              </>
            )}
          </div>
        </button>

        {/* Button 3: Send Feedback Calls */}
        <button
          onClick={handleMassCall}
          disabled={isCalling}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
        >
          <div className="flex flex-col items-center gap-2">
            {isCalling ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm">Calling...</span>
              </>
            ) : (
              <>
                <Phone className="w-8 h-8" />
                <span className="text-lg">Send Feedback Calls</span>
                <span className="text-xs opacity-80">ElevenLabs automated calls</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Results Section */}
      {(promotionResult || escalationResult || callResult) && (
        <div className="space-y-4">
          {promotionResult && (
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
              <h3 className="font-bold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5" />
                AI-Generated Loyalty Promotions:
              </h3>
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                {promotionResult}
              </pre>
            </div>
          )}

          {escalationResult && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
              <h3 className="font-bold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5" />
                AI-Generated Tech Support Ticket:
              </h3>
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                {escalationResult}
              </pre>
            </div>
          )}

          {callResult && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6">
              <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5" />
                Call Campaign Summary:
              </h3>
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                {callResult}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
