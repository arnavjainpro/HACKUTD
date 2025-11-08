'use client';

import { useState } from 'react';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setFeedback('');
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-6 h-6 text-pink-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Share Your Feedback</h2>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Help us improve! Let us know about your experience with our support team.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us what went well or what we could improve..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600 transition-colors resize-none"
        />

        <button
          type="submit"
          disabled={!feedback.trim() || submitted}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            submitted
              ? 'bg-green-600 text-white'
              : !feedback.trim()
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {submitted ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Thank you for your feedback!
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Feedback
            </>
          )}
        </button>
      </form>

      {submitted && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-300 text-center">
            ✓ Your feedback has been received. We appreciate your time!
          </p>
        </div>
      )}
    </div>
  );
}
