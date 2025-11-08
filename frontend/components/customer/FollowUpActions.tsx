'use client';

import { CheckCircle, ArrowRight, Phone, Package, Info } from 'lucide-react';

interface Action {
  id: string;
  type: 'resolved' | 'followup' | 'recommendation' | 'info';
  title: string;
  description: string;
}

interface FollowUpActionsProps {
  actions: Action[];
}

const getActionIcon = (type: string) => {
  switch (type) {
    case 'resolved':
      return CheckCircle;
    case 'followup':
      return Phone;
    case 'recommendation':
      return Package;
    default:
      return Info;
  }
};

const getActionColor = (type: string) => {
  switch (type) {
    case 'resolved':
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    case 'followup':
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    case 'recommendation':
      return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
    default:
      return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
  }
};

const getIconColor = (type: string) => {
  switch (type) {
    case 'resolved':
      return 'text-green-600 dark:text-green-400';
    case 'followup':
      return 'text-blue-600 dark:text-blue-400';
    case 'recommendation':
      return 'text-purple-600 dark:text-purple-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

export default function FollowUpActions({ actions }: FollowUpActionsProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Follow-Up Actions</h2>

      <div className="space-y-4">
        {actions.map((action) => {
          const Icon = getActionIcon(action.type);
          return (
            <div
              key={action.id}
              className={`rounded-lg p-4 border-2 transition-all hover:shadow-md ${getActionColor(action.type)}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${getIconColor(action.type)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
