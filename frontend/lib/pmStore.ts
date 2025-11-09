import { create } from 'zustand';

interface QuarterlyData {
  quarter: string;
  score: number;
}

interface PMDashboardState {
  selectedProduct: string | null;
  theme: 'light' | 'dark';
  isEscalating: boolean;
  isCalling: boolean;
  activeCallId: number | null;
  sidebarCollapsed: boolean;
  // CHI data cache
  quarterlyDataCache: Record<number, QuarterlyData[]>;
  chiDataCache: Record<number, { happiness_percentage: number; total_transcripts: number }>;
  setSelectedProduct: (product: string | null) => void;
  toggleTheme: () => void;
  setIsEscalating: (value: boolean) => void;
  setIsCalling: (value: boolean) => void;
  setActiveCallId: (id: number | null) => void;
  toggleSidebar: () => void;
  setQuarterlyData: (productId: number, data: QuarterlyData[]) => void;
  setCHIData: (productId: number, data: { happiness_percentage: number; total_transcripts: number }) => void;
}

export const usePMDashboardStore = create<PMDashboardState>((set) => ({
  selectedProduct: null,
  theme: 'light',
  isEscalating: false,
  isCalling: false,
  activeCallId: null,
  sidebarCollapsed: false,
  quarterlyDataCache: {},
  chiDataCache: {},
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setIsEscalating: (value) => set({ isEscalating: value }),
  setIsCalling: (value) => set({ isCalling: value }),
  setActiveCallId: (id) => set({ activeCallId: id }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setQuarterlyData: (productId, data) => 
    set((state) => ({ 
      quarterlyDataCache: { ...state.quarterlyDataCache, [productId]: data } 
    })),
  setCHIData: (productId, data) =>
    set((state) => ({
      chiDataCache: { ...state.chiDataCache, [productId]: data }
    })),
}));
