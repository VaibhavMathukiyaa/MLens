import requests
import time
import random

API_URL = "http://localhost:8000/api/predict"

def send_request(mode="normal"):
    if mode == "normal":
        data = {
            "age": random.randint(18, 70),
            "tenure": random.randint(0, 10),
            "usage_hrs": random.uniform(10, 100),
            "support_calls": random.randint(0, 5)
        }
    else:
        # Intentional Drift: Age is much higher than training data (18-70)
        data = {
            "age": random.randint(85, 110),
            "tenure": random.randint(0, 2),
            "usage_hrs": random.uniform(1, 20),
            "support_calls": random.randint(5, 10)
        }

    try:
        response = requests.post(API_URL, json=data)
        print(f"[{mode.upper()}] Status: {response.status_code} | Pred: {response.json()['prediction']}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("🚀 Starting Traffic Simulation...")
    print("Sending 50 normal requests...")
    for _ in range(50):
        send_request("normal")
        time.sleep(0.1)
    
    print("\n⚠️ Triggering Data Drift (Sending 50 anomalous requests)...")
    for _ in range(50):
        send_request("drift")
        time.sleep(0.1)
