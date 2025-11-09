const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export const chiApi = {
  getHappiness: async () => {
    const response = await fetch(`${BACKEND_URL}/api/chi/happiness`);
    if (!response.ok) throw new Error('Failed to fetch happiness data');
    return response.json();
  },

  getQuarterlyData: async (productId: number) => {
    const response = await fetch(`${BACKEND_URL}/api/chi/quarterly/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch quarterly data');
    return response.json();
  },

  getProductData: async (productId: number) => {
    const response = await fetch(`${BACKEND_URL}/api/chi/product/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch product data');
    return response.json();
  },

  getRecommendation: async (productId: number) => {
    const response = await fetch(`${BACKEND_URL}/api/chi/recommendation/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch recommendation');
    return response.json();
  }
};
