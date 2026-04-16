import BreadcrumbNav from "@/components/BreadcrumbNav";

interface ProtocolHeroProps {
  titleEn: string;
  titleAr: string;
  category: string;
  description: string;
  crumbs: { label: string; href?: string }[];
}

export default function ProtocolHero({ titleEn, titleAr, category, description, crumbs }: ProtocolHeroProps) {
  return (
    <div className="space-y-12">
      <BreadcrumbNav crumbs={crumbs} />
      
      <section className="relative min-h-[480px] flex items-center overflow-hidden rounded-[3rem] bg-slate-950 text-white">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 w-full px-8 md:px-16 py-16">
          <div className="flex flex-col gap-8 md:gap-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-6">
                Protocol: {category}
              </p>
              <h1 className="luxury-text text-5xl sm:text-7xl md:text-8xl lg:text-9xl">
                <span className="lang-en block">{titleEn}</span>
                <span className="lang-ar block">{titleAr}</span>
              </h1>
            </div>
            
            <div className="max-w-xl border-l border-white/10 pl-8">
              <p className="text-sm md:text-base font-medium text-white/50 leading-relaxed italic">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="absolute bottom-10 right-10 hidden lg:flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Registry Status: Operational</span>
        </div>
      </section>
    </div>
  );
}
