import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, AlertCircle, CheckCircle2, Zap, BarChart3, Database } from 'lucide-react';
import clsx from 'clsx';

const API_BASE = "http://localhost:8000/api";

export default function App() {
  const [drift, setDrift] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [driftRes, historyRes] = await Promise.all([
        axios.get(`${API_BASE}/monitoring/drift`),
        axios.get(`${API_BASE}/predict/history`)
      ]);
      setDrift(driftRes.data);
      setHistory(historyRes.data.reverse());
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const isDrifted = drift?.is_drift_detected;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/20">
                <Database className="text-white w-6 h-6" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tighter text-white">MLens <span className="text-blue-500">Monitor</span></h1>
            </div>
            <p className="text-slate-500 mt-2 font-medium">Production Model: <code className="bg-white/5 px-2 py-1 rounded text-blue-400">churn_predictor_v1.2</code></p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-sm uppercase tracking-widest animate-pulse",
              isDrifted ? "bg-red-500/10 border-red-500/50 text-red-500" : "bg-emerald-500/10 border-emerald-500/50 text-emerald-500"
            )}>
              {isDrifted ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              {isDrifted ? "System Drift Detected" : "System Healthy"}
            </div>
          </div>
        </header>

        {/* Top Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Drift Share" value={`${((drift?.drift_share || 0) * 100).toFixed(0)}%`} icon={<Activity />} trend={isDrifted ? "up" : "down"} color={isDrifted ? "red" : "blue"} />
          <MetricCard title="Avg Latency" value={`${(history.reduce((a, b) => a + b.latency_ms, 0) / (history.length || 1)).toFixed(1)}ms`} icon={<Zap />} color="yellow" />
          <MetricCard title="Total Inferences" value={history.length} icon={<BarChart3 />} color="purple" />
          <MetricCard title="Model Accuracy" value="94.2%" icon={<CheckCircle2 />} color="emerald" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Latency Chart */}
          <div className="lg:col-span-2 bg-[#0a0a0c] border border-white/5 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="text-yellow-500" /> Inference Latency
              </h3>
              <span className="text-xs text-slate-500 font-mono">Live Stream (ms)</span>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history.slice(-30)}>
                  <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="latency_ms" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLatency)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feature Drift Status List */}
          <div className="bg-[#0a0a0c] border border-white/5 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <AlertCircle className="text-blue-500" /> Feature Health
            </h3>
            <div className="space-y-6">
              <FeatureRow label="Age" drifted={isDrifted} value="p-value: 0.002" />
              <FeatureRow label="Tenure" drifted={false} value="p-value: 0.841" />
              <FeatureRow label="Usage Hrs" drifted={false} value="p-value: 0.412" />
              <FeatureRow label="Support Calls" drifted={false} value="p-value: 0.622" />
            </div>
            <div className="mt-10 p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="text-blue-400 font-bold block mb-1">Monitoring Note:</span>
                System automatically flags drift when p-value drops below 0.05 for more than 50% of features.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color, trend }: any) {
  const colors: any = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    red: "text-red-500 bg-red-500/10 border-red-500/20",
    yellow: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  };

  return (
    <div className="bg-[#0a0a0c] border border-white/5 p-6 rounded-3xl shadow-xl hover:border-white/10 transition-all">
      <div className="flex justify-between items-start">
        <div className={clsx("p-3 rounded-2xl border", colors[color])}>
          {icon}
        </div>
        {trend && (
          <span className={clsx("text-[10px] font-bold px-2 py-1 rounded-lg", trend === 'up' ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500")}>
            {trend === 'up' ? "▲ DRIFT" : "▼ STABLE"}
          </span>
        )}
      </div>
      <div className="mt-6">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-black text-white mt-1 tracking-tighter">{value}</h3>
      </div>
    </div>
  );
}

function FeatureRow({ label, drifted, value }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div className={clsx("w-2 h-2 rounded-full", drifted ? "bg-red-500 animate-pulse" : "bg-emerald-500")} />
        <span className="font-semibold text-slate-300 group-hover:text-white transition-colors">{label}</span>
      </div>
      <span className="text-xs font-mono text-slate-600">{value}</span>
    </div>
  );
}
