import clsx from 'clsx';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  status?: 'success' | 'warning' | 'danger';
}

export function MetricCard({ title, value, subtitle, status }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{title}</p>
      <h3 className={clsx(
        "text-3xl font-bold mt-2",
        status === 'danger' ? "text-red-500" : status === 'warning' ? "text-yellow-500" : "text-white"
      )}>
        {value}
      </h3>
      {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}
