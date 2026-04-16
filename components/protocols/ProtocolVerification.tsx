interface ProtocolVerificationProps {
  sourceName: string;
  sourceUrl: string;
}

export default function ProtocolVerification({ sourceName, sourceUrl }: ProtocolVerificationProps) {
  return (
    <div className="insider-card bg-slate-950 !text-white border-none flex flex-col md:flex-row items-center gap-10">
      <div className="flex-1 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
          Primary Verification Protocol
        </h3>
        <p className="text-sm font-medium text-white/50 leading-relaxed italic">
          Information curated in this guide is sourced from public declarations by the State of Qatar. For binding legal status and current regulatory amendments, cross-verify exclusively at the <b>{sourceName}</b>.
        </p>
      </div>
      <a 
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 px-8 py-4 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-primary transition-all flex items-center gap-2"
      >
        Verified Source <span className="material-symbols-outlined text-sm">open_in_new</span>
      </a>
    </div>
  );
}
