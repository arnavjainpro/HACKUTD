import { create } from 'zustand';

interface PMDashboardState {
  selectedProduct: string | null;
  theme: 'light' | 'dark';
  isEscalating: boolean;
  isCalling: boolean;
  activeCallId: number | null;
  sidebarCollapsed: boolean;
  setSelectedProduct: (product: string | null) => void;
  toggleTheme: () => void;
  setIsEscalating: (value: boolean) => void;
  setIsCalling: (value: boolean) => void;
  setActiveCallId: (id: number | null) => void;
  toggleSidebar: () => void;
}

export const usePMDashboardStore = create<PMDashboardState>((set) => ({
  selectedProduct: null,
  theme: 'light',
  isEscalating: false,
  isCalling: false,
  activeCallId: null,
  sidebarCollapsed: false,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setIsEscalating: (value) => set({ isEscalating: value }),
  setIsCalling: (value) => set({ isCalling: value }),
  setActiveCallId: (id) => set({ activeCallId: id }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
