import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

def train_and_save_model():
    # 1. Generate Synthetic Churn Data
    np.random.seed(42)
    n_samples = 2000
    
    data = pd.DataFrame({
        'age': np.random.randint(18, 70, n_samples),
        'tenure': np.random.randint(0, 10, n_samples),
        'usage_hrs': np.random.uniform(10, 100, n_samples),
        'support_calls': np.random.randint(0, 5, n_samples),
        'churn': np.random.randint(0, 2, n_samples)
    })
    
    # 2. Train a Random Forest Model
    X = data.drop('churn', axis=1)
    y = data['churn']
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # 3. Save Artifacts
    path = 'app/ml_core/artifacts'
    os.makedirs(path, exist_ok=True)
    
    joblib.dump(model, f'{path}/model.joblib')
    # Save reference data (X + predictions) for drift detection
    reference_df = X.copy()
    reference_df['prediction'] = model.predict(X)
    reference_df.to_csv(f'{path}/reference.csv', index=False)
    
    print(f"✅ Model and Reference Data saved to {path}")

if __name__ == "__main__":
    train_and_save_model()
