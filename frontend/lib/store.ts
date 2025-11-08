import { create } from 'zustand';

interface CustomerRecord {
  id: string;
  customerId: string;
  repId: string;
  product: string;
  happinessIndex: number;
  followUpStatus: 'Resolved' | 'Pending' | 'Escalated';
  timestamp: string;
  transcript: string;
  tonality: number;
  duration: number;
  resolution: number;
  networkData: number;
}

interface DashboardStore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  selectedRecord: CustomerRecord | null;
  setSelectedRecord: (record: CustomerRecord | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  selectedRecord: null,
  setSelectedRecord: (record) => set({ selectedRecord: record }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  filterStatus: 'All',
  setFilterStatus: (status) => set({ filterStatus: status }),
}));

export type { CustomerRecord };
