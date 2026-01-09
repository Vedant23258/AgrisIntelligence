from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import json
from typing import Optional

# Import our modules
from demand_engine import preprocess_retail_data, get_demand_signals
from price_engine import preprocess_mandi_data, get_price_signals
from gap_analyzer import analyze_supply_demand_gap, get_gap_summary
from recommendation_engine import generate_alerts_and_recommendations, get_actionable_insights

app = FastAPI(title="Agris Intelligence Layer API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo purposes
retail_data = None
mandi_data = None
processed_retail_data = None
processed_mandi_data = None

@app.get("/")
def read_root():
    return {"message": "Agris Intelligence Layer API", "status": "running"}

@app.post("/upload/retail")
async def upload_retail_data(file: UploadFile = File(...)):
    global retail_data, processed_retail_data
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        retail_data = df
        processed_retail_data = preprocess_retail_data(df)
        return {"filename": file.filename, "rows": len(df), "columns": list(df.columns), "processed": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

@app.post("/upload/mandi")
async def upload_mandi_data(file: UploadFile = File(...)):
    global mandi_data, processed_mandi_data
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        mandi_data = df
        processed_mandi_data = preprocess_mandi_data(df)
        return {"filename": file.filename, "rows": len(df), "columns": list(df.columns), "processed": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

@app.get("/data/retail")
def get_retail_data():
    global retail_data
    if retail_data is None:
        return {"error": "No retail data uploaded"}
    return retail_data.to_dict(orient='records')

@app.get("/data/mandi")
def get_mandi_data():
    global mandi_data
    if mandi_data is None:
        return {"error": "No mandi data uploaded"}
    return mandi_data.to_dict(orient='records')

@app.get("/analysis/demand")
def get_demand_analysis():
    global processed_retail_data
    if processed_retail_data is None:
        return {"error": "No retail data uploaded and processed"}
    
    signals = get_demand_signals(processed_retail_data)
    return {"signals": signals, "count": len(signals)}

@app.get("/analysis/price")
def get_price_analysis():
    global processed_mandi_data
    if processed_mandi_data is None:
        return {"error": "No mandi data uploaded and processed"}
    
    signals = get_price_signals(processed_mandi_data)
    return {"signals": signals, "count": len(signals)}

@app.get("/analysis/gap")
def get_gap_analysis():
    global processed_retail_data, processed_mandi_data
    if processed_retail_data is None or processed_mandi_data is None:
        return {"error": "Both retail and mandi data must be uploaded and processed"}
    
    demand_signals = get_demand_signals(processed_retail_data)
    price_signals = get_price_signals(processed_mandi_data)
    
    gap_analysis = analyze_supply_demand_gap(demand_signals, price_signals)
    summary = get_gap_summary(gap_analysis)
    
    return {
        "gap_analysis": gap_analysis,
        "summary": summary,
        "count": len(gap_analysis)
    }

@app.get("/analysis/recommendations")
def get_recommendations():
    global processed_retail_data, processed_mandi_data
    if processed_retail_data is None or processed_mandi_data is None:
        return {"error": "Both retail and mandi data must be uploaded and processed"}
    
    demand_signals = get_demand_signals(processed_retail_data)
    price_signals = get_price_signals(processed_mandi_data)
    
    gap_analysis = analyze_supply_demand_gap(demand_signals, price_signals)
    alerts_and_rec = generate_alerts_and_recommendations(gap_analysis, demand_signals, price_signals)
    actionable_insights = get_actionable_insights(gap_analysis, demand_signals, price_signals)
    
    return {
        "alerts": alerts_and_rec['alerts'],
        "recommendations": alerts_and_rec['recommendations'],
        "summary": alerts_and_rec['summary'],
        "actionable_insights": actionable_insights
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)