"use client";

// Country-specific client component


import { useLanguage } from "@/lib/i18n";
import { notFound, useParams } from "next/navigation";
import { Globe, Users, Landmark, Coins, Rocket, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SITE_URL, SITE_NAME, Breadcrumbs } from "@/lib/seo";


const COUNTRY_DATA: Record<string, any> = {
  "saudi-arabia": {
    nameKey: 'saudiArabia',
    introKey: 'saudiIntro',
    color: "from-emerald-600 to-emerald-900",
    flag: "/flags/saudi_new.png",
    stats: {
      population: 'saudiPop',
      capital: 'riyadh',
      currency: 'saudiCurrencyName',
      gdp: 'saudiGdp',
      vision: 'saudiVision'
    },
    details: [
      {
        titleKey: "econPower",
        contentKey: "saudiEconContent"
      },
      {
        titleKey: "globalLead",
        contentKey: "saudiGlobalContent"
      },
      {
        titleKey: "megaProj",
        contentKey: "saudiMegaContent"
      }
    ]
  },
  "united-arab-emirates": {
    nameKey: 'uae',
    introKey: 'uaeIntro',
    color: "from-red-600 to-black",
    flag: "/flags/uae_new.png",
    stats: {
      population: 'uaePop',
      capital: 'dubai',
      currency: 'uaeCurrencyName',
      gdp: 'uaeGdp',
      vision: 'uaeVision'
    },
    details: [
      {
        titleKey: "innovationHub",
        contentKey: "uaeInnovationContent"
      },
      {
        titleKey: "spaceTech",
        contentKey: "uaeSpaceContent"
      },
      {
        titleKey: "culturalDiv",
        contentKey: "uaeCultureContent"
      }
    ]
  },
  "qatar": {
    nameKey: 'qatar',
    introKey: 'qatarIntro',
    color: "from-red-800 to-stone-900",
    flag: "/flags/qatar_new.png",
    stats: {
      population: 'qatarPop',
      capital: 'doha',
      currency: 'qatarCurrencyName',
      gdp: 'qatarGdp',
      vision: 'qatarVision'
    },
    details: [
      {
        titleKey: "energyGiant",
        contentKey: "qatarEnergyContent"
      },
      {
        titleKey: "diplomaticHub",
        contentKey: "qatarDiplomaticContent"
      },
      {
        titleKey: "sportsExcellence",
        contentKey: "qatarSportsContent"
      }
    ]
  },
  "kuwait": {
    nameKey: 'kuwait',
    introKey: 'kuwaitIntro',
    color: "from-blue-600 to-emerald-900",
    flag: "/flags/kuwait_new.png",
    stats: {
      population: 'kuwaitPop',
      capital: 'kuwaitCity',
      currency: 'kuwaitCurrencyName',
      gdp: 'kuwaitGdp',
      vision: 'kuwaitVision'
    },
    details: [
      {
        titleKey: "finHeritage",
        contentKey: "kuwaitFinContent"
      },
      {
        titleKey: "parlTradition",
        contentKey: "kuwaitParlContent"
      },
      {
        titleKey: "culturalHeart",
        contentKey: "kuwaitCultureContent"
      }
    ]
  },
  "oman": {
    nameKey: 'oman',
    introKey: 'omanIntro',
    color: "from-red-700 to-emerald-800",
    flag: "/flags/oman_new.png",
    stats: {
      population: 'omanPop',
      capital: 'muscat',
      currency: 'omanCurrencyName',
      gdp: 'omanGdp',
      vision: 'omanVision'
    },
    details: [
      {
        titleKey: "naturalMajesty",
        contentKey: "omanNaturalContent"
      },
      {
        titleKey: "strategicNeutrality",
        contentKey: "omanNeutralContent"
      },
      {
        titleKey: "maritimeLegacy",
        contentKey: "omanMaritimeContent"
      }
    ]
  },
  "bahrain": {
    nameKey: 'bahrain',
    introKey: 'bahrainIntro',
    color: "from-red-600 to-stone-800",
    flag: "/flags/bahrain_new.png",
    stats: {
      population: 'bahrainPop',
      capital: 'manama',
      currency: 'bahrainCurrencyName',
      gdp: 'bahrainGdp',
      vision: 'bahrainVision'
    },
    details: [
      {
        titleKey: "finInnovation",
        contentKey: "bahrainFinContent"
      },
      {
        titleKey: "ancientHistory",
        contentKey: "bahrainHistoryContent"
      },
      {
        titleKey: "motorsportsHub",
        contentKey: "bahrainMotorsportsContent"
      }
    ]
  }
};

export default function CountryClient() {
  const { slug } = useParams();
  const { t, isRTL } = useLanguage();

  const data = COUNTRY_DATA[slug as string];

  if (!data) {
    notFound();
  }

  const stats = [
    { label: t('population'), value: t(data.stats.population), icon: Users },
    { label: t('capital'), value: t(data.stats.capital), icon: Landmark },
    { label: t('currency'), value: t(data.stats.currency), icon: Coins },
    { label: t('vision'), value: t(data.stats.vision), icon: Rocket },
  ];

  const breadcrumbItems = [
    { name: t('home'), href: "/" },
    { name: t('countries'), href: "/#countries" },
    { name: t(data.nameKey), href: `/countries/${slug}` }
  ];

  return (
    <div className={`min-h-screen ${isRTL ? 'font-serif-ar' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 pt-24">
        <Breadcrumbs items={breadcrumbItems} isRTL={isRTL} />
      </div>


      {/* Hero Section */}
      <div className={`relative h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br ${data.color}`}>
        {/* Flag Image Background */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={data.flag} 
            alt={t(data.nameKey)}
            fill
            sizes="100vw"
            className="object-cover opacity-30 mix-blend-overlay"
            priority
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-obsidian/40 to-brand-obsidian z-10" />
        
        <div className="relative z-20 text-center px-6 animate-in fade-in zoom-in duration-1000">
          <div className="flex flex-col items-center">
            <div className="w-20 h-12 relative mb-6 rounded shadow-2xl overflow-hidden border border-white/10">
              <Image src={data.flag} alt={t('flagOf').replace('%s', t(data.nameKey))} fill sizes="80px" className="object-cover" priority />
            </div>

            <h1 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-2xl">
              {t(data.nameKey)}
            </h1>
            <div className="w-24 h-1.5 bg-brand-gold mx-auto rounded-full mb-8 shadow-glow" />
            <p className="max-w-3xl mx-auto text-xl text-white/90 serif italic leading-relaxed drop-shadow-lg">
              &quot;{t(data.introKey)}&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto -mt-16 relative z-30 px-6 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="glass p-8 rounded-3xl border-white/10 shadow-2xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 flex items-center justify-center text-brand-gold mb-4">
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold mb-1">{stat.label}</span>
              <span className="text-lg font-black text-accent">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 gap-12">
          {data.details.map((section: any, idx: number) => (
            <div key={idx} className="group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1 h-8 bg-brand-gold rounded-full" />
                <h2 className="text-3xl font-black uppercase tracking-tight text-accent group-hover:pl-2 transition-all duration-300">
                  {t(section.titleKey)}
                </h2>
              </div>
              <div className="glass p-10 rounded-[2.5rem] border-brand-gold/5 hover:border-brand-gold/20 transition-all duration-500">
                <p className="text-xl text-foreground/70 leading-relaxed serif">
                  {t(section.contentKey)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Anti-Ban / Transparency CTA */}
        <div className="mt-24 glass p-12 rounded-[3rem] border-brand-gold/20 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck size={120} />
          </div>

          <div className="relative inline-block px-10 py-3 mb-6">
            {/* Elegant Corner Borders */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-gold/30" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-gold/30" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-gold/30" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-gold/30" />
            
            <h3 className="text-xl font-black uppercase tracking-[0.3em] text-accent">
              {t('transparencyNotice')}
            </h3>
          </div>

          <div className="flex items-center gap-4 w-full max-w-xs mx-auto mb-8">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/30" />
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
          </div>

          <p className="text-foreground/60 max-w-2xl mx-auto mb-10 italic serif leading-relaxed">
            {t('transparencyBody')}
          </p>
          
          <Link 
            href="/transparency"
            className="group inline-flex items-center gap-3 px-8 py-3 rounded-full border border-brand-gold/20 hover:border-brand-gold/50 transition-all text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:bg-brand-gold/5"
          >
            {t('viewDetails')} <Globe size={14} className="group-hover:rotate-12 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
