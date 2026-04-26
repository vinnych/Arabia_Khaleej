"use client";

import { useLanguage } from "@/lib/i18n";
import { ShieldCheck, Info, Scale, Globe } from "lucide-react";
import Image from "next/image";
import StructuredData from "@/components/seo/StructuredData";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export default function TransparencyPage() {
  const { t, isRTL } = useLanguage();

  const articleData = {
    "headline": t('transparencyTitle'),
    "description": t('transparencyBody'),
    "author": {
      "@type": "Organization",
      "name": SITE_NAME
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo-premium-gold.png`
      }
    },
    "datePublished": "2024-04-18T00:00:00Z",
    "dateModified": new Date().toISOString()
  };

  const sections = [
    {
      title: t('independence'),
      desc: t('independenceDesc'),
      icon: ShieldCheck
    },
    {
      title: t('transparency'),
      desc: t('transparencyDesc'),
      icon: Info
    },
    {
      title: "Regulatory Compliance",
      desc: "We adhere to all local digital regulations and ensure that our platform serves as a positive contributor to the regional digital ecosystem.",
      icon: Scale
    },
    {
      title: "Global Standards",
      desc: "Our data practices follow international best practices for information accuracy and source attribution.",
      icon: Globe
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <StructuredData type="Service" data={articleData} />
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000 px-4">
        {/* Flag Row for Regional Emphasis */}
        <div className="flex justify-center gap-2 mb-12 opacity-40">
          {['saudi', 'uae', 'qatar', 'kuwait', 'oman', 'bahrain'].map(f => (
            <div key={f} className="w-10 h-6 relative rounded-sm overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110">
              <Image src={`/flags/${f}_new.png`} alt={f} fill className="object-cover" />
            </div>
          ))}
        </div>
        
        <div className="relative inline-block px-12 py-4 mb-8">
          {/* Elegant Corner Borders */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-brand-gold/40" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-brand-gold/40" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-brand-gold/40" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-brand-gold/40" />
          
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-[0.4em] text-accent drop-shadow-sm">
            {t('transparencyTitle')}
          </h1>
        </div>

        <div className="flex items-center gap-8 w-full max-w-2xl mx-auto mb-12">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-brand-gold/40" />
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
        </div>

        <p className="text-xl text-foreground/70 leading-relaxed serif italic max-w-3xl mx-auto">
          "{t('transparencyBody')}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {sections.map((section, idx) => (
          <div 
            key={idx} 
            className="glass p-8 rounded-3xl border-brand-gold/10 hover:border-brand-gold/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-accent mb-6 group-hover:bg-brand-gold group-hover:text-brand-obsidian transition-colors">
              <section.icon size={24} />
            </div>
            <h2 className="text-xl font-bold mb-3 text-accent uppercase tracking-tight">
              {section.title}
            </h2>
            <p className="text-foreground/60 leading-relaxed">
              {section.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="glass p-10 rounded-[2.5rem] border-brand-gold/20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-50" />
        <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-accent">
          Regulatory Inquiry
        </h3>
        <p className="text-foreground/70 mb-8 max-w-2xl mx-auto italic">
          We welcome dialogue with regional regulatory bodies. For official inquiries, please use our primary communication channel.
        </p>
        <a 
          href="/join" 
          className="inline-block px-10 py-4 bg-brand-gold text-brand-obsidian font-bold rounded-full hover:scale-105 active:scale-95 transition-transform shadow-xl hover:shadow-brand-gold/20"
        >
          {t('boutiqueEnquiry')}
        </a>
      </div>
    </div>
  );
}
