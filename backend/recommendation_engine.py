from typing import Dict, List
from datetime import datetime, timedelta

def generate_alerts_and_recommendations(gap_analysis: List[Dict], demand_signals: List[Dict], price_signals: List[Dict]) -> Dict:
    """
    Generate alerts and recommendations based on gap analysis and signals
    """
    alerts = []
    recommendations = []
    
    # Process each product's gap analysis
    for item in gap_analysis:
        product = item['product']
        signal_level = item['signal_level']
        recommendation = item['recommendation']
        
        # Create alert based on signal level
        if signal_level == 'opportunity':
            alert_type = 'success'
            alert_message = f"✅ Opportunity identified for {product}. {recommendation}"
        elif signal_level == 'risk':
            alert_type = 'warning'
            alert_message = f"⚠️ Risk alert for {product}. {recommendation}"
        else:  # watch
            alert_type = 'info'
            alert_message = f"ℹ️ Monitoring {product}. {recommendation}"
        
        alerts.append({
            'product': product,
            'type': alert_type,
            'message': alert_message,
            'timestamp': datetime.now().isoformat(),
            'signal_level': signal_level
        })
        
        # Add to recommendations
        recommendations.append({
            'product': product,
            'action': recommendation,
            'priority': signal_level,
            'confidence': calculate_confidence_score(item)
        })
    
    # Add additional alerts based on demand and price signals
    for demand_signal in demand_signals:
        product = demand_signal['product']
        change_pct = demand_signal['change_percentage']
        
        if abs(change_pct) > 15:  # Significant change threshold
            if change_pct > 0:
                alerts.append({
                    'product': product,
                    'type': 'success',
                    'message': f"✅ {product} demand sharply rising ({change_pct}%). Consider procuring more.",
                    'timestamp': datetime.now().isoformat(),
                    'signal_level': 'opportunity'
                })
            else:
                alerts.append({
                    'product': product,
                    'type': 'warning',
                    'message': f"⚠️ {product} demand sharply falling ({change_pct}%). Consider selling excess inventory.",
                    'timestamp': datetime.now().isoformat(),
                    'signal_level': 'risk'
                })
    
    for price_signal in price_signals:
        product = price_signal['product']
        trend_label = price_signal['trend_label']
        
        if 'likely to increase' in trend_label.lower():
            alerts.append({
                'product': product,
                'type': 'info',
                'message': f"📈 {product} prices expected to rise. Consider holding stock.",
                'timestamp': datetime.now().isoformat(),
                'signal_level': 'watch'
            })
        elif 'likely to fall' in trend_label.lower():
            alerts.append({
                'product': product,
                'type': 'warning',
                'message': f"📉 {product} prices expected to fall. Consider selling before drop.",
                'timestamp': datetime.now().isoformat(),
                'signal_level': 'risk'
            })
    
    # Sort alerts by priority (risk first, then opportunity, then watch)
    priority_order = {'risk': 0, 'opportunity': 1, 'watch': 2}
    alerts.sort(key=lambda x: priority_order.get(x['signal_level'], 3))
    
    return {
        'alerts': alerts,
        'recommendations': recommendations,
        'summary': {
            'total_alerts': len(alerts),
            'opportunity_alerts': len([a for a in alerts if a['signal_level'] == 'opportunity']),
            'risk_alerts': len([a for a in alerts if a['signal_level'] == 'risk']),
            'watch_alerts': len([a for a in alerts if a['signal_level'] == 'watch'])
        }
    }

def calculate_confidence_score(item: Dict) -> float:
    """
    Calculate confidence score based on various factors
    """
    # Base confidence is 0.7 (70%)
    confidence = 0.7
    
    # Adjust based on data availability
    if item.get('demand_signal', 'No demand data') != 'No demand data':
        confidence += 0.1
    if item.get('price_signal', 'No price data') != 'No price data':
        confidence += 0.1
    
    # Cap at 1.0 (100%)
    return min(confidence, 1.0)

def generate_mock_sms_alerts(alerts: List[Dict], max_count: int = 5) -> List[str]:
    """
    Generate mock SMS-style alerts for demonstration
    """
    sms_alerts = []
    
    # Take top alerts by priority
    for alert in alerts[:max_count]:
        product = alert['product']
        message = alert['message']
        
        # Create a simplified SMS message
        if alert['signal_level'] == 'opportunity':
            sms_msg = f"AgrisAlert: {product} - Buy opportunity! Prices may rise soon."
        elif alert['signal_level'] == 'risk':
            sms_msg = f"AgrisAlert: {product} - Risk! Demand falling, consider selling."
        else:
            sms_msg = f"AgrisAlert: Monitor {product} - Market changing."
        
        sms_alerts.append(sms_msg)
    
    return sms_alerts

def get_actionable_insights(gap_analysis: List[Dict], demand_signals: List[Dict], price_signals: List[Dict]) -> Dict:
    """
    Get the most actionable insights from the analysis
    """
    # Find top opportunities
    opportunities = [item for item in gap_analysis if item['signal_level'] == 'opportunity']
    opportunities.sort(key=lambda x: abs(x.get('demand_signal_obj', {}).get('change_percentage', 0)), reverse=True)
    
    # Find highest risks
    risks = [item for item in gap_analysis if item['signal_level'] == 'risk']
    risks.sort(key=lambda x: abs(x.get('demand_signal_obj', {}).get('change_percentage', 0)), reverse=True)
    
    # Find fastest changing demands
    demand_changes = [(ds['product'], ds['change_percentage']) for ds in demand_signals]
    demand_changes.sort(key=lambda x: abs(x[1]), reverse=True)
    
    return {
        'top_opportunities': opportunities[:3],
        'top_risks': risks[:3],
        'fastest_changing_demands': demand_changes[:3],
        'immediate_actions': generate_immediate_actions(opportunities[:3], risks[:3])
    }

def generate_immediate_actions(opportunities: List[Dict], risks: List[Dict]) -> List[str]:
    """
    Generate immediate action items based on top opportunities and risks
    """
    actions = []
    
    for opp in opportunities[:2]:  # Top 2 opportunities
        actions.append(f"PROCURE: Increase procurement of {opp['product']} based on rising demand signals")
    
    for risk in risks[:2]:  # Top 2 risks
        actions.append(f"REDUCE: Reduce inventory of {risk['product']} based on falling demand signals")
    
    return actions