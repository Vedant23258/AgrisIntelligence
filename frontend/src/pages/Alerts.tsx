import React, { useState, useEffect } from 'react';

const AlertsPage = () => {
  const [alertsData, setAlertsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAlertsData({
        alerts: [
          { id: 1, product: 'Onions', type: 'success', message: '✅ Opportunity identified for Onions. HOLD / PROCURE - High demand with rising prices', timestamp: '2024-01-07 14:30', signalLevel: 'opportunity' },
          { id: 2, product: 'Tomatoes', type: 'warning', message: '⚠️ Risk alert for Tomatoes. SELL FAST - Falling demand and prices', timestamp: '2024-01-07 12:15', signalLevel: 'risk' },
          { id: 3, product: 'Carrots', type: 'info', message: 'ℹ️ Monitoring Carrots. MONITOR - Mixed signals, proceed with caution', timestamp: '2024-01-07 10:45', signalLevel: 'watch' },
          { id: 4, product: 'Onions', type: 'success', message: '✅ Onions demand sharply rising (19%). Consider procuring more.', timestamp: '2024-01-07 09:20', signalLevel: 'opportunity' },
          { id: 5, product: 'Cauliflower', type: 'warning', message: '📉 Cauliflower prices expected to fall. Consider selling before drop.', timestamp: '2024-01-07 08:30', signalLevel: 'risk' },
        ],
        recommendations: [
          { product: 'Onions', action: 'HOLD / PROCURE - High demand with rising prices', priority: 'opportunity', confidence: 0.9 },
          { product: 'Tomatoes', action: 'SELL FAST - Falling demand and prices', priority: 'risk', confidence: 0.85 },
          { product: 'Carrots', action: 'MONITOR - Mixed signals, proceed with caution', priority: 'watch', confidence: 0.75 },
        ],
        actionableInsights: {
          topOpportunities: [
            { product: 'Onions', signal: 'High demand + Rising prices' },
            { product: 'Carrots', signal: 'High demand + Falling prices (Buy opportunity)' },
          ],
          topRisks: [
            { product: 'Tomatoes', signal: 'Falling demand + Falling prices' },
            { product: 'Cauliflower', signal: 'Falling demand + Rising prices' },
          ],
          immediateActions: [
            'PROCURE: Increase procurement of Onions based on rising demand signals',
            'REDUCE: Reduce inventory of Tomatoes based on falling demand signals'
          ]
        },
        mockSMS: [
          'AgrisAlert: Onions - Buy opportunity! Prices may rise soon.',
          'AgrisAlert: Tomatoes - Risk! Demand falling, consider selling.',
          'AgrisAlert: Monitor Carrots - Market changing.'
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getAlertColor = (type: string) => {
    switch(type) {
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Action & Alerts Panel</h1>
        <p className="text-gray-600">Real-time alerts and actionable recommendations for your agricultural business</p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Total Alerts</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">{alertsData.alerts.length}</p>
          <p className="text-gray-500 text-xs mt-1">Latest activity</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Opportunity Alerts</p>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {alertsData.alerts.filter((a: any) => a.signalLevel === 'opportunity').length}
          </p>
          <p className="text-gray-500 text-xs mt-1">Potential gains</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Risk Alerts</p>
          <p className="text-3xl font-bold mt-2 text-red-600">
            {alertsData.alerts.filter((a: any) => a.signalLevel === 'risk').length}
          </p>
          <p className="text-gray-500 text-xs mt-1">Immediate attention needed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Alerts</h3>
            <div className="space-y-4">
              {alertsData.alerts.map((alert: any) => (
                <div 
                  key={alert.id} 
                  className={`border-l-4 p-4 rounded-r ${getAlertColor(alert.type)}`}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-900">{alert.product}</h4>
                    <span className="text-xs text-gray-500">{alert.timestamp}</span>
                  </div>
                  <p className="mt-1 text-gray-700">{alert.message}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(alert.signalLevel)}`}>
                      {alert.signalLevel.charAt(0).toUpperCase() + alert.signalLevel.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations and Actions */}
        <div className="space-y-6">
          {/* Priority Recommendations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Priority Recommendations</h3>
            <div className="space-y-4">
              {alertsData.recommendations.map((rec: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">{rec.product}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(rec.priority)}`}>
                      {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{rec.action}</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-indigo-600 h-1.5 rounded-full" 
                        style={{ width: `${rec.confidence * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Confidence: {(rec.confidence * 100).toFixed(0)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Immediate Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Immediate Actions</h3>
            <ul className="space-y-3">
              {alertsData.actionableInsights.immediateActions.map((action: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className={`mr-2 mt-1 ${
                    action.startsWith('PROCURE') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {action.startsWith('PROCURE') ? '▲' : '▼'}
                  </span>
                  <span className="text-sm text-gray-700">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mock SMS Alerts */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">SMS Alerts Simulation</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-3">
            {alertsData.mockSMS.map((sms: string, index: number) => (
              <div key={index} className="flex items-start p-3 bg-white rounded border">
                <span className="mr-3 text-indigo-600">📱</span>
                <span className="text-gray-700">{sms}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Opportunities and Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Opportunities</h3>
          <div className="space-y-3">
            {alertsData.actionableInsights.topOpportunities.map((opp: any, index: number) => (
              <div key={index} className="flex items-start p-3 bg-green-50 rounded border border-green-200">
                <span className="mr-2 text-green-600">🟢</span>
                <div>
                  <h4 className="font-medium text-green-800">{opp.product}</h4>
                  <p className="text-sm text-green-700">{opp.signal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Risks</h3>
          <div className="space-y-3">
            {alertsData.actionableInsights.topRisks.map((risk: any, index: number) => (
              <div key={index} className="flex items-start p-3 bg-red-50 rounded border border-red-200">
                <span className="mr-2 text-red-600">🔴</span>
                <div>
                  <h4 className="font-medium text-red-800">{risk.product}</h4>
                  <p className="text-sm text-red-700">{risk.signal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;