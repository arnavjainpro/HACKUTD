'use client';

import { useEffect } from 'react';
import { useDashboardStore } from '@/lib/store';
import { Smile } from 'lucide-react';
import CustomerSummaryCard from '@/components/customer/CustomerSummaryCard';
import VoiceSummarySection from '@/components/customer/VoiceSummarySection';
import FollowUpActions from '@/components/customer/FollowUpActions';
import FeedbackForm from '@/components/customer/FeedbackForm';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

// Mock customer data
const mockCustomerData = {
  customerName: 'Sarah Johnson',
  customerId: 'C10001',
  product: '5G Home Internet',
  callDuration: 12,
  happinessIndex: 8.5,
  resolutionStatus: 'Resolved',
  callDate: new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  voiceSummary:
    "Thank you for contacting T-Mobile support! We successfully resolved your internet speed concerns by optimizing your router placement and resetting your modem. Your connection should now be running at optimal speeds. If you experience any further issues, don't hesitate to reach out to us again!",
  followUpActions: [
    {
      id: '1',
      type: 'resolved' as const,
      title: 'Issue Resolved',
      description:
        'Your internet speed issue has been successfully resolved. Your connection is now optimized for best performance.',
    },
    {
      id: '2',
      type: 'recommendation' as const,
      title: 'Upgrade Opportunity',
      description:
        'Based on your usage, you might benefit from our 5G Ultra plan with faster speeds and priority data. Save 20% when you upgrade this month!',
    },
    {
      id: '3',
      type: 'followup' as const,
      title: 'Follow-Up Call Scheduled',
      description:
        'Our team will check in with you in 3 days to ensure everything is working smoothly. No action needed from you.',
    },
    {
      id: '4',
      type: 'info' as const,
      title: 'Helpful Resources',
      description:
        'Check out our self-service portal for tips on optimizing your home network and troubleshooting common issues.',
    },
  ],
};

export default function CustomerPage() {
  const { theme } = useDashboardStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <Smile className="w-8 h-8" />
                <h1 className="text-4xl font-bold">Welcome back, {mockCustomerData.customerName}!</h1>
              </div>
              <p className="text-pink-100 text-lg">
                Here's a summary of your recent interactions and support updates.
              </p>
            </div>

            {/* Latest Interaction Summary */}
            <CustomerSummaryCard
              customerName={mockCustomerData.customerName}
              product={mockCustomerData.product}
              callDuration={mockCustomerData.callDuration}
              happinessIndex={mockCustomerData.happinessIndex}
              resolutionStatus={mockCustomerData.resolutionStatus}
              callDate={mockCustomerData.callDate}
            />

            {/* Two Column Layout for Voice Summary and Follow-Up Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Voice Summary Section */}
              <VoiceSummarySection summary={mockCustomerData.voiceSummary} />

              {/* Follow-Up Actions */}
              <FollowUpActions actions={mockCustomerData.followUpActions} />
            </div>

            {/* Feedback Form */}
            <FeedbackForm />

            {/* Additional Info Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-dashed border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Need More Help?
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                  Our support team is available 24/7 to assist you with any questions or concerns.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:shadow-lg transition-all border border-blue-200 dark:border-blue-700">
                    Call Support
                  </button>
                  <button className="px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:shadow-lg transition-all border border-blue-200 dark:border-blue-700">
                    Live Chat
                  </button>
                  <button className="px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:shadow-lg transition-all border border-blue-200 dark:border-blue-700">
                    Visit FAQ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
