import React, { useState, useEffect } from 'react';
import DemandChart from '../components/Charts/DemandChart';
import PriceChart from '../components/Charts/PriceChart';

const IntelligencePage = () => {
  const [intelligenceData, setIntelligenceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIntelligenceData({
        demandTrends: [
          { product: 'Onions', currentPeriod: 1250, previousPeriod: 1050, changePercentage: 19.05, trend: 'rising' },
          { product: 'Tomatoes', currentPeriod: 850, previousPeriod: 950, changePercentage: -10.53, trend: 'falling' },
          { product: 'Potatoes', currentPeriod: 2100, previousPeriod: 2080, changePercentage: 0.96, trend: 'stable' },
          { product: 'Carrots', currentPeriod: 650, previousPeriod: 580, changePercentage: 12.07, trend: 'rising' },
          { product: 'Cauliflower', currentPeriod: 420, previousPeriod: 520, changePercentage: -19.23, trend: 'falling' },
        ],
        priceTrends: [
          { product: 'Onions', currentPrice: 28.50, avgPrice: 25.20, trendLabel: 'Price likely to increase', volatility: 'Low volatility' },
          { product: 'Tomatoes', currentPrice: 18.75, avgPrice: 22.30, trendLabel: 'Price likely to fall', volatility: 'Medium volatility' },
          { product: 'Potatoes', currentPrice: 15.20, avgPrice: 15.60, trendLabel: 'Price stable', volatility: 'Low volatility' },
          { product: 'Carrots', currentPrice: 22.40, avgPrice: 20.10, trendLabel: 'Price likely to increase', volatility: 'High volatility' },
          { product: 'Cauliflower', currentPrice: 32.10, avgPrice: 28.90, trendLabel: 'Price likely to increase', volatility: 'Medium volatility' },
        ],
        chartData: [
          { date: '2024-01-01', onions: 1200, tomatoes: 900, potatoes: 2000 },
          { date: '2024-01-02', onions: 1250, tomatoes: 850, potatoes: 2050 },
          { date: '2024-01-03', onions: 1300, tomatoes: 800, potatoes: 2100 },
          { date: '2024-01-04', onions: 1100, tomatoes: 950, potatoes: 1950 },
          { date: '2024-01-05', onions: 1150, tomatoes: 1000, potatoes: 2000 },
          { date: '2024-01-06', onions: 1220, tomatoes: 880, potatoes: 2080 },
          { date: '2024-01-07', onions: 1280, tomatoes: 820, potatoes: 2120 },
        ],
        priceChartData: [
          { date: '2024-01-01', onions: 25.20, tomatoes: 22.50, potatoes: 15.60 },
          { date: '2024-01-02', onions: 26.10, tomatoes: 21.80, potatoes: 15.40 },
          { date: '2024-01-03', onions: 27.50, tomatoes: 21.20, potatoes: 15.20 },
          { date: '2024-01-04', onions: 26.80, tomatoes: 20.90, potatoes: 15.10 },
          { date: '2024-01-05', onions: 27.20, tomatoes: 20.50, potatoes: 15.30 },
          { date: '2024-01-06', onions: 27.80, tomatoes: 19.80, potatoes: 15.50 },
          { date: '2024-01-07', onions: 28.50, tomatoes: 18.75, potatoes: 15.20 },
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getTrendColor = (trend: string) => {
    switch(trend) {
      case 'rising': return 'text-green-600';
      case 'falling': return 'text-red-600';
      case 'stable': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'rising': return '↑';
      case 'falling': return '↓';
      case 'stable': return '→';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Demand & Price Intelligence</h1>
        <p className="text-gray-600">Track demand trends and price movements across agricultural commodities</p>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Demand Trends Over Time</h2>
          <DemandChart data={intelligenceData.chartData} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Price Trends Over Time</h2>
          <PriceChart data={intelligenceData.priceChartData} />
        </div>
      </div>

      {/* Demand Trends Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Demand Trends</h2>
          <div className="text-sm text-gray-500">Last 14 days vs Previous 14 days</div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Period</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Period</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {intelligenceData.demandTrends.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.currentPeriod.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.previousPeriod.toLocaleString()}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getTrendColor(item.trend)}`}>
                      {getTrendIcon(item.trend)} {Math.abs(item.changePercentage)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.trend === 'rising' ? 'bg-green-100 text-green-800' : 
                        item.trend === 'falling' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.trend.charAt(0).toUpperCase() + item.trend.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Price Trends Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Price Trends</h2>
          <div className="text-sm text-gray-500">Current vs Average Prices</div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price (₹)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Price (₹)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volatility</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {intelligenceData.priceTrends.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.currentPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.avgPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={
                        item.trendLabel.includes('increase') ? 'text-green-600' : 
                        item.trendLabel.includes('fall') ? 'text-red-600' : 
                        'text-yellow-600'
                      }>
                        {item.trendLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={
                        item.volatility.includes('High') ? 'text-red-600' : 
                        item.volatility.includes('Medium') ? 'text-yellow-600' : 
                        'text-green-600'
                      }>
                        {item.volatility}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Demand Insights</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span><strong>Onions:</strong> Demand up 19% - Strong consumer interest</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span><strong>Tomatoes:</strong> Demand down 11% - Possible oversupply in market</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span><strong>Carrots:</strong> Demand up 12% - Seasonal increase expected</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span><strong>Potatoes:</strong> Stable demand - Maintain current procurement</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Price Insights</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span><strong>Onions:</strong> Prices rising - Consider holding inventory</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span><strong>Tomatoes:</strong> Prices falling - Sell surplus stock soon</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              <span><strong>Carrots:</strong> High volatility - Monitor closely</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span><strong>Cauliflower:</strong> Rising prices expected - Procure early</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IntelligencePage;