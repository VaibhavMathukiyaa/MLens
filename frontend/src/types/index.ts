export interface DriftReport {
  status: string;
  drift_share: number;
  is_drift_detected: boolean;
}

export interface PredictionMetric {
  age: number;
  prediction: number;
  latency_ms: number;
  timestamp: string;
}
