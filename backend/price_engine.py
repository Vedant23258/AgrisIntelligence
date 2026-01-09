import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline
import warnings
warnings.filterwarnings('ignore')

def preprocess_mandi_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Preprocess mandi price data to ensure proper format
    Expected columns: date, product, price, location
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
        'price': ['price', 'Price', 'rate', 'Rate', 'value', 'Value', 'cost', 'Cost'],
        'location': ['location', 'Location', 'mandi', 'Mandi', 'market', 'Market']
    }
    
    for standard_col, possible_cols in column_mapping.items():
        for col in possible_cols:
            if col in df.columns and standard_col not in df.columns:
                df.rename(columns={col: standard_col}, inplace=True)
                break
    
    # Group by date and product if multiple entries exist
    if 'date' in df.columns and 'product' in df.columns:
        df = df.groupby(['date', 'product']).agg({
            'price': 'mean'  # Average price for the day
        }).reset_index()
    
    return df

def calculate_price_trends(df: pd.DataFrame, forecast_days: int = 7) -> Dict:
    """
    Calculate price trends and simple forecasts using linear regression
    """
    if df.empty:
        return {}
    
    df = df.sort_values('date', ascending=True)
    
    # Get unique products
    products = df['product'].unique()
    
    results = {}
    
    for product in products:
        product_data = df[df['product'] == product].copy()
        product_data = product_data.sort_values('date')
        
        if len(product_data) < 3:  # Need at least 3 data points for trend
            continue
            
        # Prepare data for modeling
        product_data['date_numeric'] = (product_data['date'] - product_data['date'].min()).dt.days
        X = product_data['date_numeric'].values.reshape(-1, 1)
        y = product_data['price'].values
        
        # Fit linear regression model
        model = LinearRegression()
        model.fit(X, y)
        
        # Calculate trend direction
        slope = model.coef_[0]
        
        # Calculate R-squared for model quality
        r_squared = model.score(X, y)
        
        # Forecast future prices
        last_date = product_data['date'].max()
        future_dates = []
        future_prices = []
        
        for i in range(1, forecast_days + 1):
            future_date = last_date + timedelta(days=i)
            future_dates.append(future_date)
            
            future_X = np.array([[product_data['date_numeric'].max() + i]])
            future_price = model.predict(future_X)[0]
            future_prices.append(max(0, future_price))  # Ensure non-negative prices
        
        # Determine trend direction
        if slope > 0.1:  # Rising trend (threshold can be adjusted)
            trend_label = "Price likely to increase"
            direction = "up"
        elif slope < -0.1:  # Falling trend
            trend_label = "Price likely to fall"
            direction = "down"
        else:
            trend_label = "Price stable"
            direction = "stable"
        
        # Calculate volatility (standard deviation of prices)
        volatility = np.std(y)
        avg_price = np.mean(y)
        volatility_pct = (volatility / avg_price * 100) if avg_price > 0 else 0
        
        # Determine volatility level
        if volatility_pct > 15:  # High volatility threshold
            volatility_label = "High volatility zone"
        elif volatility_pct > 8:  # Medium volatility threshold
            volatility_label = "Medium volatility"
        else:
            volatility_label = "Low volatility"
        
        results[product] = {
            'trend_direction': direction,
            'trend_label': trend_label,
            'slope': slope,
            'r_squared': r_squared,
            'volatility': volatility,
            'volatility_percentage': round(volatility_pct, 2),
            'volatility_label': volatility_label,
            'forecast_dates': [date.strftime('%Y-%m-%d') for date in future_dates],
            'forecast_prices': [round(price, 2) for price in future_prices],
            'current_price': round(y[-1], 2),
            'avg_price': round(avg_price, 2)
        }
    
    return results

def get_price_signals(df: pd.DataFrame) -> List[Dict]:
    """
    Generate price signals in human-readable format
    """
    trends = calculate_price_trends(df)
    signals = []
    
    for product, data in trends.items():
        trend_label = data['trend_label']
        volatility_label = data['volatility_label']
        
        # Create signal based on trend and volatility
        if data['trend_direction'] == 'up':
            signal = f"{product} prices likely to increase"
        elif data['trend_direction'] == 'down':
            signal = f"{product} prices likely to fall"
        else:
            signal = f"{product} prices stable"
        
        # Add volatility information
        if data['volatility_percentage'] > 15:
            signal += f" (High volatility: {data['volatility_percentage']}%)"
        elif data['volatility_percentage'] > 8:
            signal += f" (Medium volatility: {data['volatility_percentage']}%)"
        
        signals.append({
            'product': product,
            'signal': signal,
            'trend_label': trend_label,
            'volatility_label': volatility_label,
            'volatility_percentage': data['volatility_percentage'],
            'current_price': data['current_price'],
            'forecast_prices': data['forecast_prices'][:3]  # Show first 3 forecasted prices
        })
    
    return signals