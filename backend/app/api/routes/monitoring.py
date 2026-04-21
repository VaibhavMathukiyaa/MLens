from fastapi import APIRouter, HTTPException
import pandas as pd
from app.core.database import get_db
from app.services.monitoring import calculate_drift

router = APIRouter()

@router.get("/drift")
async def get_drift_report():
    db = get_db()
    # Pull last 100 predictions to check for drift
    cursor = db.prediction_logs.find().sort("timestamp", -1).limit(100)
    logs = await cursor.to_list(length=100)
    
    if len(logs) < 10:
        return {"status": "insufficient_data", "count": len(logs)}
    
    current_df = pd.DataFrame(logs)
    
    try:
        report = calculate_drift(current_df)
        # Extract drift share from Evidently dict
        drift_share = report['metrics'][0]['result']['drift_share']
        
        return {
            "status": "success",
            "drift_share": drift_share,
            "is_drift_detected": drift_share > 0.5
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
