interface ProtocolStep {
  title: string;
  detail: string;
}

interface ProtocolFlowProps {
  steps: ProtocolStep[];
}

export default function ProtocolFlow({ steps }: ProtocolFlowProps) {
  return (
    <section className="space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="luxury-text text-5xl">Execution Path</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-4">Required Procedural Sequence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 rounded-[3rem] overflow-hidden border border-slate-200 dark:border-slate-800">
        {steps.map((step, idx) => (
          <div key={step.title} className="bg-white dark:bg-slate-950 p-12 flex flex-col gap-8 group">
            <span className="protocol-number">
              {(idx + 1).toString().padStart(2, '0')}
            </span>
            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {step.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
