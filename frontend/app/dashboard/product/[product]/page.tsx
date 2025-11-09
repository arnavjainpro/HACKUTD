'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { usePMDashboardStore } from '@/lib/pmStore';
import { getTechnicalIssues, getFeedbackOnly } from '@/lib/feedbackUtils';
import { ArrowLeft, AlertCircle, MessageSquare, Phone, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { FeedbackItem } from '@/lib/feedbackUtils';

export default function ProductDetailPage({ params }: { params: Promise<{ product: string }> }) {
  const resolvedParams = use(params);
  const productName = decodeURIComponent(resolvedParams.product);
  const { theme, isEscalating, isCalling, activeCallId, setIsEscalating, setIsCalling, setActiveCallId } = usePMDashboardStore();
  
  const [technicalIssues, setTechnicalIssues] = useState<FeedbackItem[]>([]);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [escalationResult, setEscalationResult] = useState<string | null>(null);
  const [callResult, setCallResult] = useState<{id: number, memo: string} | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    setTechnicalIssues(getTechnicalIssues(productName));
    setFeedbackItems(getFeedbackOnly(productName));
  }, [theme, productName]);

  const handleEscalateTech = async () => {
    setIsEscalating(true);
    setEscalationResult(null);
    
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

  const handleFeedbackCall = async (item: FeedbackItem) => {
    setIsCalling(true);
    setActiveCallId(item.id);
    setCallResult(null);
    
    try {
      const response = await fetch('/api/feedback-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          transcript: item.transcript,
          phone: item.phone
        })
      });
      
      const data = await response.json();
      setCallResult({ id: item.id, memo: data.memo });
    } catch (error) {
      console.error('Call failed:', error);
      setCallResult({ id: item.id, memo: 'Error: Failed to complete call and generate memo' });
    } finally {
      setIsCalling(false);
      setActiveCallId(null);
    }
  };

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
        
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-2">{productName}</h1>
          <p className="text-pink-100 text-lg">
            Product feedback triage and AI-powered automation
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technical Issues Column */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Technical Issues
              </h2>
            </div>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
              {technicalIssues.length} issues
            </span>
          </div>

          <div className="space-y-3 mb-6">
            {technicalIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white text-sm">
                      {issue.transcript}
                    </p>
                    {issue.location && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        📍 {issue.location}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    #{issue.id}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {technicalIssues.length > 0 && (
            <button
              onClick={handleEscalateTech}
              disabled={isEscalating}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isEscalating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Ticket...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Escalate to Tech Ops (Gemini AI)
                </>
              )}
            </button>
          )}

          {escalationResult && (
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI-Generated JIRA Ticket:
              </h3>
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                {escalationResult}
              </pre>
            </div>
          )}
        </div>

        {/* Feedback Column */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Customer Feedback
              </h2>
            </div>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
              {feedbackItems.length} items
            </span>
          </div>

          <div className="space-y-3">
            {feedbackItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white text-sm mb-2">
                      {item.transcript}
                    </p>
                    {item.phone && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        📞 {item.phone}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    #{item.id}
                  </span>
                </div>

                <button
                  onClick={() => handleFeedbackCall(item)}
                  disabled={isCalling && activeCallId === item.id}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {isCalling && activeCallId === item.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Calling & Analyzing...
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4" />
                      Start Feedback Call (ElevenLabs + Gemini)
                    </>
                  )}
                </button>

                {callResult && callResult.id === item.id && (
                  <div className="mt-3 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-3">
                    <h4 className="font-bold text-green-900 dark:text-green-100 mb-2 text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Product Strategy Memo:
                    </h4>
                    <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {callResult.memo}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
