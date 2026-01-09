# Agris Intelligence Layer - MVP

An intelligence layer for agriculture supply chains that connects demand and price signals to convert them into simple, actionable decisions for every participant.

## Project Structure

```
AgrisIntelligence/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── demand_engine.py     # Demand signal processing
│   ├── price_engine.py      # Price trend analysis
│   ├── gap_analyzer.py      # Supply-demand gap analysis
│   ├── recommendation_engine.py # Rule-based recommendations
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Main pages (Dashboard, Intelligence, Alerts)
│   │   ├── services/        # API service functions
│   │   └── App.tsx          # Main application router
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
├── data/
│   ├── retail_sales.csv     # Sample retail sales data
│   └── mandi_prices.csv     # Sample mandi price data
└── README.md
```

## Features

### 1. Demand Signal Engine
- Compares last 7-14 days vs previous period
- Calculates % change in demand
- Labels: Rising demand, Falling demand, Stable demand

### 2. Price Trend Intelligence
- Simple regression-based forecasting
- Short-term forecast (7-14 days)
- Volatility analysis

### 3. Supply-Demand Gap Indicator
- Combines demand trend + price trend
- Visual signals: 🟢 Opportunity, 🟡 Watch, 🔴 Risk

### 4. Actionable Recommendations
- Rule-based engine with simple IF-ELSE logic
- Examples: "IF demand ↑ AND price ↑ → HOLD / PROCURE"

### 5. Alert System
- Converts analytics into actionable messages
- Mock SMS alerts

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Recharts
- **Backend**: Python, FastAPI, Pandas, Scikit-learn
- **Data**: CSV files for demo

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the backend server:
```bash
python main.py
```
The server will start on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

## API Endpoints

- `GET /` - Health check
- `POST /upload/retail` - Upload retail sales data
- `POST /upload/mandi` - Upload mandi price data
- `GET /analysis/demand` - Get demand analysis
- `GET /analysis/price` - Get price analysis
- `GET /analysis/gap` - Get supply-demand gap analysis
- `GET /analysis/recommendations` - Get recommendations and alerts

## How to Use

1. Start the backend server
2. Start the frontend development server
3. Access the application at `http://localhost:5173`
4. Upload retail sales data (CSV format)
5. Upload mandi price data (CSV format)
6. View dashboard, intelligence, and alerts

## Sample Data Format

### Retail Sales Data
Required columns: `date`, `product`, `sales_quantity`, `sales_value`

### Mandi Price Data
Required columns: `date`, `product`, `price`, `location`

Sample data files are provided in the `/data` directory.

## Key Benefits

- Connects retail demand data with mandi price data
- Provides clear, visual signals for decision-making
- Simple, explainable logic instead of complex ML
- Real-time insights for farmers, aggregators, and retailers
- Easy-to-understand recommendations

## Demo Flow

1. Upload the sample CSV files from the `/data` directory
2. View the Overview Dashboard showing KPIs and signal distribution
3. Navigate to Demand & Price Intelligence to see trends and charts
4. Check the Action & Alerts Panel for recommendations and alerts
5. Use the recommendations to make informed decisions

## Architecture

The application follows a microservice-like architecture:
- Frontend: React SPA with responsive design
- Backend: FastAPI server with data processing modules
- Data: CSV files for demo (can be replaced with databases)

All processing happens in the backend, with the frontend consuming API endpoints to display information.