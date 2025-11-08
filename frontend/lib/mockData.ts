import { CustomerRecord } from './store';

export const mockCustomerData: CustomerRecord[] = [
  {
    id: '1',
    customerId: 'C10001',
    repId: 'REP-2034',
    product: '5G Home Internet',
    happinessIndex: 8.5,
    followUpStatus: 'Resolved',
    timestamp: '2025-11-08T10:30:00Z',
    transcript: 'Customer called regarding slow internet speeds. Issue was resolved by resetting the modem and optimizing router placement. Customer expressed satisfaction with the resolution and appreciated the quick response time.',
    tonality: 0.85,
    duration: 12,
    resolution: 0.95,
    networkData: 0.78,
  },
  {
    id: '2',
    customerId: 'C10002',
    repId: 'REP-1892',
    product: 'Magenta Max Plan',
    happinessIndex: 4.2,
    followUpStatus: 'Escalated',
    timestamp: '2025-11-08T09:15:00Z',
    transcript: 'Customer complained about unexpected charges on their bill. The issue has been escalated to the billing department for further investigation. Customer was frustrated but appreciated the attention to their concern.',
    tonality: 0.42,
    duration: 18,
    resolution: 0.35,
    networkData: 0.88,
  },
  {
    id: '3',
    customerId: 'C10003',
    repId: 'REP-2034',
    product: 'iPhone 15 Pro',
    happinessIndex: 9.2,
    followUpStatus: 'Resolved',
    timestamp: '2025-11-08T08:45:00Z',
    transcript: 'Customer inquired about trade-in value for upgrading to the latest iPhone. Successfully processed the trade-in and completed the upgrade. Customer was very happy with the trade-in value and the new device.',
    tonality: 0.92,
    duration: 8,
    resolution: 1.0,
    networkData: 0.95,
  },
  {
    id: '4',
    customerId: 'C10004',
    repId: 'REP-3421',
    product: 'Business Unlimited',
    happinessIndex: 6.8,
    followUpStatus: 'Pending',
    timestamp: '2025-11-08T11:20:00Z',
    transcript: 'Business customer requested information about adding more lines to their account. Provided pricing and plan details. Customer is considering options and will call back to finalize the decision.',
    tonality: 0.68,
    duration: 15,
    resolution: 0.60,
    networkData: 0.82,
  },
  {
    id: '5',
    customerId: 'C10005',
    repId: 'REP-1892',
    product: 'Galaxy S24 Ultra',
    happinessIndex: 3.5,
    followUpStatus: 'Escalated',
    timestamp: '2025-11-08T07:30:00Z',
    transcript: 'Customer reported persistent network connectivity issues with their new device. Troubleshooting did not resolve the issue. Case has been escalated to technical support for advanced diagnostics.',
    tonality: 0.35,
    duration: 25,
    resolution: 0.25,
    networkData: 0.45,
  },
  {
    id: '6',
    customerId: 'C10006',
    repId: 'REP-2567',
    product: 'Magenta Plan',
    happinessIndex: 7.9,
    followUpStatus: 'Resolved',
    timestamp: '2025-11-08T10:00:00Z',
    transcript: 'Customer wanted to upgrade their plan for better data allowance. Successfully upgraded to Magenta Max with promotional discount. Customer was pleased with the additional benefits and pricing.',
    tonality: 0.79,
    duration: 10,
    resolution: 0.90,
    networkData: 0.85,
  },
  {
    id: '7',
    customerId: 'C10007',
    repId: 'REP-3421',
    product: 'Home Office Internet',
    happinessIndex: 5.5,
    followUpStatus: 'Pending',
    timestamp: '2025-11-08T09:45:00Z',
    transcript: 'Customer inquired about upgrading their internet speed for better work-from-home performance. Provided available options and pricing. Customer requested time to review and compare with competitors.',
    tonality: 0.55,
    duration: 14,
    resolution: 0.50,
    networkData: 0.70,
  },
  {
    id: '8',
    customerId: 'C10008',
    repId: 'REP-2034',
    product: 'Apple Watch Series 9',
    happinessIndex: 8.8,
    followUpStatus: 'Resolved',
    timestamp: '2025-11-08T11:45:00Z',
    transcript: 'Customer had questions about cellular connectivity on their new Apple Watch. Walked through setup process and verified functionality. Customer was very satisfied with the support and device performance.',
    tonality: 0.88,
    duration: 9,
    resolution: 0.95,
    networkData: 0.92,
  },
  {
    id: '9',
    customerId: 'C10009',
    repId: 'REP-2567',
    product: 'T-Mobile ONE',
    happinessIndex: 4.8,
    followUpStatus: 'Pending',
    timestamp: '2025-11-08T08:15:00Z',
    transcript: 'Customer expressed concern about international roaming charges. Explained the international features and provided recommendations for cost-effective options. Follow-up scheduled to finalize international plan add-on.',
    tonality: 0.48,
    duration: 16,
    resolution: 0.55,
    networkData: 0.75,
  },
  {
    id: '10',
    customerId: 'C10010',
    repId: 'REP-1892',
    product: 'Samsung Galaxy Tab',
    happinessIndex: 9.5,
    followUpStatus: 'Resolved',
    timestamp: '2025-11-08T10:50:00Z',
    transcript: 'Customer received their new tablet and needed help with initial setup and data plan activation. Successfully completed setup and activated unlimited data plan. Customer extremely satisfied with the device and service.',
    tonality: 0.95,
    duration: 11,
    resolution: 1.0,
    networkData: 0.98,
  },
];

export const getHappinessColor = (index: number): string => {
  if (index >= 7.5) return 'text-green-600 dark:text-green-400';
  if (index >= 5) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

export const getHappinessBackground = (index: number): string => {
  if (index >= 7.5) return 'bg-green-100 dark:bg-green-900/30';
  if (index >= 5) return 'bg-yellow-100 dark:bg-yellow-900/30';
  return 'bg-red-100 dark:bg-red-900/30';
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Resolved':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'Escalated':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};
