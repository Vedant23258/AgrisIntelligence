import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DataUpload from '../components/DataUpload/DataUpload';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData({
        summary: {
          totalProducts: 12,
          opportunities: 4,
          risks: 2,
          watch: 6
        },
        topSignals: [
          { product: 'Onions', signal: '🟢 Onions', change: 'demand ↑ 18%', type: 'opportunity' },
          { product: 'Tomatoes', signal: '🔴 Tomatoes', change: 'demand ↓ 12%', type: 'risk' },
          { product: 'Potatoes', signal: '🟡 Potatoes', change: 'stable demand', type: 'watch' },
        ],
        kpiCards: [
          { title: 'Active Opportunities', value: 4, change: '+2 from yesterday', color: 'text-green-600' },
          { title: 'Risk Alerts', value: 2, change: '-1 from yesterday', color: 'text-red-600' },
          { title: 'Products Monitored', value: 12, change: 'All systems active', color: 'text-blue-600' },
          { title: 'Data Freshness', value: 'Live', change: 'Updated 5 min ago', color: 'text-purple-600' },
        ],
        signalDistribution: [
          { name: 'Opportunities', value: 4 },
          { name: 'Risks', value: 2 },
          { name: 'Watch', value: 6 },
        ],
        demandChanges: [
          { product: 'Onions', change: 18 },
          { product: 'Tomatoes', change: -12 },
          { product: 'Carrots', change: 8 },
          { product: 'Potatoes', change: 2 },
          { product: 'Cauliflower', change: -15 },
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

  const getSignalColor = (type: string) => {
    switch(type) {
      case 'opportunity': return 'bg-green-100 text-green-800';
      case 'risk': return 'bg-red-100 text-red-800';
      case 'watch': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Overview Dashboard</h1>
        <p className="text-gray-600">Real-time insights for agriculture supply chain intelligence</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardData.kpiCards.map((card: any, index: number) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">{card.title}</p>
            <p className={`text-3xl font-bold mt-2 ${card.color}`}>{card.value}</p>
            <p className="text-gray-500 text-xs mt-1">{card.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Signal Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.signalDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : '0'}%`}
              >
                {dashboardData.signalDistribution.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Demand Changes (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dashboardData.demandChanges}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="change" name="Change (%)" fill="#4F46E5">
                {dashboardData.demandChanges.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.change >= 0 ? '#10B981' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Signal Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Signal Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-green-600 font-medium">Opportunities</span>
                <span>{dashboardData.summary.opportunities}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${(dashboardData.summary.opportunities / dashboardData.summary.totalProducts) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-yellow-600 font-medium">Watch</span>
                <span>{dashboardData.summary.watch}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-yellow-500 h-2.5 rounded-full" 
                  style={{ width: `${(dashboardData.summary.watch / dashboardData.summary.totalProducts) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-red-600 font-medium">Risks</span>
                <span>{dashboardData.summary.risks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-red-500 h-2.5 rounded-full" 
                  style={{ width: `${(dashboardData.summary.risks / dashboardData.summary.totalProducts) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Signals</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signal</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.topSignals.map((signal: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{signal.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{signal.signal}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{signal.change}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSignalColor(signal.type)}`}>
                        {signal.type.charAt(0).toUpperCase() + signal.type.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DataUpload />

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200">
            View Full Reports
          </button>
          <button className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200">
            Export Data
          </button>
          <button className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition duration-200">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;