from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "mlens"
    MODEL_PATH: str = "app/ml_core/artifacts/model.joblib"
    REFERENCE_DATA_PATH: str = "app/ml_core/artifacts/reference.csv"
    
    model_config = {"env_file": ".env"}

settings = Settings()
