const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export interface RetailData {
  date: string;
  product: string;
  sales_quantity: number;
  sales_value: number;
}

export interface MandiData {
  date: string;
  product: string;
  price: number;
  location: string;
}

export interface DemandSignal {
  product: string;
  signal: string;
  change_percentage: number;
  trend_label: string;
  direction: string;
}

export interface PriceSignal {
  product: string;
  signal: string;
  trend_label: string;
  volatility_label: string;
  volatility_percentage: number;
  current_price: number;
  forecast_prices: number[];
}

export interface GapAnalysis {
  product: string;
  demand_direction: string;
  price_direction: string;
  signal_level: string;
  signal_color: string;
  combined_signal: string;
  demand_signal: string;
  price_signal: string;
  recommendation: string;
}

export interface Alert {
  product: string;
  type: string;
  message: string;
  timestamp: string;
  signal_level: string;
}

export interface Recommendation {
  product: string;
  action: string;
  priority: string;
  confidence: number;
}

// Upload retail data
export const uploadRetailData = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/upload/retail`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Upload mandi data
export const uploadMandiData = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/upload/mandi`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Get demand analysis
export const getDemandAnalysis = async (): Promise<{ signals: DemandSignal[]; count: number }> => {
  const response = await fetch(`${API_BASE_URL}/analysis/demand`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Get price analysis
export const getPriceAnalysis = async (): Promise<{ signals: PriceSignal[]; count: number }> => {
  const response = await fetch(`${API_BASE_URL}/analysis/price`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Get gap analysis
export const getGapAnalysis = async (): Promise<{ gap_analysis: GapAnalysis[]; summary: any; count: number }> => {
  const response = await fetch(`${API_BASE_URL}/analysis/gap`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Get recommendations
export const getRecommendations = async (): Promise<{
  alerts: Alert[];
  recommendations: Recommendation[];
  summary: any;
  actionable_insights: any;
}> => {
  const response = await fetch(`${API_BASE_URL}/analysis/recommendations`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};
