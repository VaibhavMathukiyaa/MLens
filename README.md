# 📊 MLens: Real-time ML Model Monitoring Dashboard

> An MLOps observability platform designed to detect "Silent Failures" in production Machine Learning models through real-time Data Drift detection and performance tracking.

![Python](https://img.shields.io/badge/Python-3.12-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--learn-orange?style=flat-square&logo=scikit-learn)
![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=flat-square&logo=react)
![EvidentlyAI](https://img.shields.io/badge/Monitoring-Evidently_AI-blueviolet?style=flat-square)

---

## 🚀 The Problem: Silent Model Failure
In traditional software, code breaks and throws errors. In Machine Learning, models **fail silently**. The API still returns a prediction, but the accuracy drops because the real-world data distribution has shifted (Data Drift). 

**MLens** acts as a "Smoke Detector" for AI, providing real-time visibility into model health and statistical stability.

---

## 🛠️ Key Features

- **🔍 Data Drift Detection**: Uses **Evidently AI** to perform statistical tests (Kolmogorov-Smirnov) comparing live traffic against training reference data.
- **📈 Real-time Performance Metrics**: Tracks inference latency (ms) and prediction volume via an async **FastAPI** pipeline.
- **🚦 Intelligent Health Status**: A "Healthy vs. Drifted" visual indicator that triggers when more than 50% of features show statistical deviation.
- **📡 Live Traffic Simulation**: Includes a simulator script that generates "Normal" traffic followed by "Anomalous" traffic to demonstrate real-time dashboard reactivity.
- **🗄️ Persistence Layer**: Every prediction and metric is logged asynchronously to **MongoDB** for historical auditing.

---

## 🏗️ Architecture

```text
[Simulator] ──▶ [FastAPI Ingestion] ──▶ [MongoDB]
                       │
                       ▼
                [Evidently AI] ──▶ [Drift Reports]
                       │
                       ▼
                [React Dashboard] ◀── [Charts & Alerts]


🛠️ Tech Stack
Layer	Technology
Model	Scikit-learn (Random Forest Classifier)
Monitoring	Evidently AI (Statistical Drift Detection)
Backend	FastAPI (Python)
Database	MongoDB (Motor Async Driver)
Frontend	React 19, TypeScript, Tailwind CSS v4
Visualization	Recharts

🚀 Getting Started
1. Prerequisites
Python 3.11+
Node.js 20+
MongoDB running on localhost:27017
2. Setup
bash

# Clone the repository
git clone https://github.com/VaibhavMathukiyaa/MLens.git
cd MLens

# Setup Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup Frontend
cd ../frontend
npm install
3. Running the Project
bash
# 1. Train the model & generate reference data
python3 -m app.ml_core.trainer

# 2. Start Backend (Terminal 1)
uvicorn app.main:app --reload --port 8000

# 3. Start Frontend (Terminal 2)
npm run dev

# 4. Run Traffic Simulator (Terminal 3)
python3 simulate_traffic.py

💡 Engineering Skills Demonstrated

MLOps: Building the "Day 2" operations infrastructure for ML models.
Data Engineering: Managing high-frequency data ingestion and async logging.
Statistical Analysis: Implementing drift detection thresholds using p-values and distribution shifts.
Full-Stack Development: Creating a responsive, data-heavy dashboard for technical stakeholders.

👤 Author
Vaibhav Mathukiya

MSc in Computer Science
