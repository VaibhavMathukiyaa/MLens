import pandas as pd
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset
from app.core.config import settings

def calculate_drift(current_df: pd.DataFrame):
    """
    Compares current_df (from MongoDB) against reference.csv (from training).
    """
    reference_df = pd.read_csv(settings.REFERENCE_DATA_PATH)
    
    # We only compare the features, not the timestamps/ids
    features = ['age', 'tenure', 'usage_hrs', 'support_calls']
    
    drift_report = Report(metrics=[DataDriftPreset()])
    drift_report.run(reference_data=reference_df[features], 
                     current_data=current_df[features])
    
    return drift_report.as_dict()
