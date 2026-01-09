from typing import Dict, List
from enum import Enum

class SignalLevel(Enum):
    OPPORTUNITY = "opportunity"  # Green: High demand + rising price
    WATCH = "watch"             # Yellow: Mixed signals
    RISK = "risk"               # Red: Falling demand + falling price

def analyze_supply_demand_gap(demand_signals: List[Dict], price_signals: List[Dict]) -> List[Dict]:
    """
    Analyze the gap between supply and demand by combining demand and price signals
    """
    # Create a mapping of products to their signals
    demand_map = {signal['product']: signal for signal in demand_signals}
    price_map = {signal['product']: signal for signal in price_signals}
    
    # Get all unique products
    all_products = set(demand_map.keys()) | set(price_map.keys())
    
    gap_analysis = []
    
    for product in all_products:
        demand_signal = demand_map.get(product)
        price_signal = price_map.get(product)
        
        # Determine demand trend
        demand_direction = "stable"
        if demand_signal:
            demand_direction = demand_signal.get('direction', 'stable')
        
        # Determine price trend
        price_direction = "stable"
        if price_signal:
            # Extract trend direction from price signal
            if 'up' in price_signal.get('trend_label', '').lower():
                price_direction = "up"
            elif 'down' in price_signal.get('trend_label', '').lower():
                price_direction = "down"
        
        # Determine signal level based on combination of demand and price trends
        signal_level = SignalLevel.WATCH  # Default to watch
        signal_color = "🟡"
        
        # Define rules for signal levels
        if demand_direction == "up" and price_direction == "up":
            # High demand + rising price = Opportunity
            signal_level = SignalLevel.OPPORTUNITY
            signal_color = "🟢"
        elif demand_direction == "down" and price_direction == "down":
            # Falling demand + falling price = Risk
            signal_level = SignalLevel.RISK
            signal_color = "🔴"
        elif demand_direction == "up" and price_direction == "down":
            # Rising demand + falling price = Opportunity (buy low, demand high)
            signal_level = SignalLevel.OPPORTUNITY
            signal_color = "🟢"
        elif demand_direction == "down" and price_direction == "up":
            # Falling demand + rising price = Risk (high price, low demand)
            signal_level = SignalLevel.RISK
            signal_color = "🔴"
        
        # Create a combined signal
        gap_signal = {
            'product': product,
            'demand_direction': demand_direction,
            'price_direction': price_direction,
            'signal_level': signal_level.value,
            'signal_color': signal_color,
            'combined_signal': f"{signal_color} {product}",
            'demand_signal': demand_signal['signal'] if demand_signal else "No demand data",
            'price_signal': price_signal['signal'] if price_signal else "No price data",
            'recommendation': get_recommendation_for_signal(signal_level, demand_direction, price_direction)
        }
        
        gap_analysis.append(gap_signal)
    
    return gap_analysis

def get_recommendation_for_signal(signal_level: SignalLevel, demand_direction: str, price_direction: str) -> str:
    """
    Generate a recommendation based on the signal level and directions
    """
    if signal_level == SignalLevel.OPPORTUNITY:
        if demand_direction == "up" and price_direction == "up":
            return "HOLD / PROCURE - High demand with rising prices"
        elif demand_direction == "up" and price_direction == "down":
            return "BUY & STORE - High demand but prices still falling"
    elif signal_level == SignalLevel.RISK:
        if demand_direction == "down" and price_direction == "down":
            return "SELL FAST - Falling demand and prices"
        elif demand_direction == "down" and price_direction == "up":
            return "AVOID BUYING - Low demand but high prices"
    else:  # WATCH
        return "MONITOR - Mixed signals, proceed with caution"
    
    return "No clear recommendation"

def get_gap_summary(gap_analysis: List[Dict]) -> Dict:
    """
    Get a summary of the gap analysis
    """
    total_products = len(gap_analysis)
    
    opportunities = [item for item in gap_analysis if item['signal_level'] == 'opportunity']
    watches = [item for item in gap_analysis if item['signal_level'] == 'watch']
    risks = [item for item in gap_analysis if item['signal_level'] == 'risk']
    
    summary = {
        'total_products': total_products,
        'opportunities': len(opportunities),
        'watches': len(watches),
        'risks': len(risks),
        'opportunity_percentage': round(len(opportunities) / total_products * 100, 2) if total_products > 0 else 0,
        'watch_percentage': round(len(watches) / total_products * 100, 2) if total_products > 0 else 0,
        'risk_percentage': round(len(risks) / total_products * 100, 2) if total_products > 0 else 0
    }
    
    return summary