from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import os
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", module="evidently")
import pandas as pd
from datetime import datetime
from app.core.config import settings
from app.core.database import connect_db, close_db, get_db
from app.api.routes import monitoring

app = FastAPI(title="MLens Monitoring API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model
MODEL = None
if os.path.exists(settings.MODEL_PATH):
    MODEL = joblib.load(settings.MODEL_PATH)
else:
    print(f"⚠️ Warning: Model not found at {settings.MODEL_PATH}. Run trainer first.")

@app.on_event("startup")
async def startup():
    await connect_db()

@app.on_event("shutdown")
async def shutdown():
    await close_db()

@app.post("/api/predict")
async def predict(data: dict):
    if MODEL is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # 1. Convert to DataFrame
        df = pd.DataFrame([data])
        
        # 2. Predict & Time Latency
        start_time = datetime.now()
        prediction = int(MODEL.predict(df)[0])
        latency = (datetime.now() - start_time).total_seconds() * 1000
        
        # 3. Log to MongoDB
        db = get_db()
        log_entry = {
            **data,
            "prediction": prediction,
            "latency_ms": latency,
            "timestamp": datetime.utcnow()
        }
        await db.prediction_logs.insert_one(log_entry)
        
        return {"prediction": prediction, "latency_ms": latency}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

app.include_router(monitoring.router, prefix="/api/monitoring", tags=["Monitoring"])

@app.get("/api/health")
async def health():
    return {"status": "ok", "model_loaded": MODEL is not None}


@app.get("/api/predict/history")
async def get_history():
    db = get_db()
    cursor = db.prediction_logs.find().sort("timestamp", -1).limit(100)
    logs = await cursor.to_list(length=100)
    for log in logs:
        log["_id"] = str(log["_id"])
        log["timestamp"] = log["timestamp"].isoformat()
    return logs
