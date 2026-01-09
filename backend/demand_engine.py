import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
import warnings
warnings.filterwarnings('ignore')

def preprocess_retail_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Preprocess retail sales data to ensure proper format
    Expected columns: date, product, sales_quantity, sales_value
    """
    # Make a copy to avoid modifying original data
    df = df.copy()
    
    # Convert date column to datetime if it exists
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
    elif 'Date' in df.columns:
        df['date'] = pd.to_datetime(df['Date'])
        
    # Standardize column names
    column_mapping = {
        'product': ['product', 'Product', 'item', 'Item', 'commodity', 'Commodity'],
        'sales_quantity': ['sales_quantity', 'quantity', 'Quantity', 'sales', 'Sales', 'volume', 'Volume'],
        'sales_value': ['sales_value', 'value', 'Value', 'amount', 'Amount', 'price', 'Price']
    }
    
    for standard_col, possible_cols in column_mapping.items():
        for col in possible_cols:
            if col in df.columns and standard_col not in df.columns:
                df.rename(columns={col: standard_col}, inplace=True)
                break
    
    # Group by date and product if multiple entries exist
    if 'date' in df.columns and 'product' in df.columns:
        df = df.groupby(['date', 'product']).agg({
            'sales_quantity': 'sum',
            'sales_value': 'sum'
        }).reset_index()
    
    return df

def calculate_demand_trends(df: pd.DataFrame, period_days: int = 14) -> Dict:
    """
    Calculate demand trends comparing recent period to previous period
    """
    if df.empty:
        return {}
    
    df = df.sort_values('date', ascending=False)
    
    # Get the most recent date
    max_date = df['date'].max()
    min_date = df['date'].min()
    
    # Define periods
    recent_end = max_date
    recent_start = max_date - timedelta(days=period_days)
    previous_end = recent_start
    previous_start = previous_end - timedelta(days=period_days)
    
    # Filter data for each period
    recent_data = df[(df['date'] >= recent_start) & (df['date'] <= recent_end)]
    previous_data = df[(df['date'] >= previous_start) & (df['date'] <= previous_end)]
    
    # Calculate total sales for each product in each period
    recent_totals = recent_data.groupby('product')['sales_quantity'].sum().to_dict()
    previous_totals = previous_data.groupby('product')['sales_quantity'].sum().to_dict()
    
    # Calculate trends
    trends = {}
    for product in set(recent_totals.keys()) | set(previous_totals.keys()):
        recent_val = recent_totals.get(product, 0)
        previous_val = previous_totals.get(product, 0)
        
        if previous_val > 0:
            change_pct = ((recent_val - previous_val) / previous_val) * 100
        elif recent_val > 0:
            change_pct = float('inf')  # New demand
        else:
            change_pct = 0  # No change
        
        # Determine trend direction
        if abs(change_pct) < 5:  # Less than 5% change is stable
            trend_label = "Stable demand"
        elif change_pct > 0:
            trend_label = "Rising demand"
        else:
            trend_label = "Falling demand"
            
        trends[product] = {
            'current_period_total': recent_val,
            'previous_period_total': previous_val,
            'change_percentage': round(change_pct, 2),
            'trend_label': trend_label,
            'direction': 'up' if change_pct > 0 else 'down' if change_pct < 0 else 'stable'
        }
    
    return trends

def get_demand_signals(df: pd.DataFrame) -> List[Dict]:
    """
    Generate demand signals in human-readable format
    """
    trends = calculate_demand_trends(df)
    signals = []
    
    for product, data in trends.items():
        change_pct = data['change_percentage']
        direction = data['direction']
        
        if direction == 'up':
            signal = f"{product} demand ↑ {abs(change_pct)}%"
        elif direction == 'down':
            signal = f"{product} demand ↓ {abs(change_pct)}%"
        else:
            signal = f"{product} demand stable"
            
        signals.append({
            'product': product,
            'signal': signal,
            'change_percentage': change_pct,
            'trend_label': data['trend_label'],
            'direction': direction
        })
    
    return signals