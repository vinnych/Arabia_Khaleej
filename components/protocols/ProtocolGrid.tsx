interface ProtocolDataPoint {
  label: string;
  value: string;
  icon?: string;
}

interface ProtocolGridProps {
  points: ProtocolDataPoint[];
}

export default function ProtocolGrid({ points }: ProtocolGridProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
      {points.map((point) => (
        <div key={point.label} className="insider-card flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              {point.label}
            </h4>
            {point.icon && (
              <span className="material-symbols-outlined text-primary text-xl">
                {point.icon}
              </span>
            )}
          </div>
          <p className="text-3xl font-serif italic font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter">
            {point.value}
          </p>
        </div>
      ))}
    </section>
  );
}
