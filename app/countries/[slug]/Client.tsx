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
      population: "36.4 Million",
      capital: "Riyadh",
      currency: "Saudi Riyal (SAR)",
      gdp: "$1.1 Trillion (Nominal)",
      vision: "Vision 2030"
    },
    details: [
      {
        titleKey: "econPower",
        content: "As the largest economy in the GCC and a G20 member, Saudi Arabia is the regional anchor for trade and investment. The nation is currently executing 'Vision 2030', a strategic framework to reduce dependence on oil and develop public service sectors such as health, education, infrastructure, recreation, and tourism."
      },
      {
        titleKey: "globalLead",
        content: "Saudi Arabia holds a unique position as the birthplace of Islam and the custodian of the Two Holy Mosques in Makkah and Madinah. This spiritual significance, combined with its energy leadership, makes it a pivotal global actor."
      },
      {
        titleKey: "megaProj",
        content: "The Kingdom is home to some of the world's most ambitious urban developments, including NEOM—a $500 billion futuristic city—The Red Sea Project, and Qiddiya, which are set to redefine global tourism and sustainable living."
      }
    ]
  },
  "united-arab-emirates": {
    nameKey: 'uae',
    introKey: 'uaeIntro',
    color: "from-red-600 to-black",
    flag: "/flags/uae_new.png",
    stats: {
      population: "9.9 Million",
      capital: "Abu Dhabi",
      currency: "UAE Dirham (AED)",
      gdp: "$507 Billion",
      vision: "UAE Centennial 2071"
    },
    details: [
      {
        titleKey: "innovationHub",
        content: "The UAE is a federation of seven emirates that has become a global leader in logistics, aviation, and financial services. Cities like Dubai and Abu Dhabi are synonymous with world-class infrastructure and architectural marvels like the Burj Khalifa."
      },
      {
        titleKey: "spaceTech",
        content: "The UAE has made significant strides in space exploration with the Hope Probe reaching Mars and its successful astronaut missions. It is also a leader in AI, being the first country to appoint a Minister for Artificial Intelligence."
      },
      {
        titleKey: "culturalDiv",
        content: "With over 200 nationalities living and working in harmony, the UAE is a model of tolerance and coexistence. The Louvre Abu Dhabi and Museum of the Future showcase its commitment to cultural and intellectual enrichment."
      }
    ]
  },
  "qatar": {
    nameKey: 'qatar',
    introKey: 'qatarIntro',
    color: "from-red-800 to-stone-900",
    flag: "/flags/qatar_new.png",
    stats: {
      population: "2.9 Million",
      capital: "Doha",
      currency: "Qatari Riyal (QAR)",
      gdp: "$237 Billion",
      vision: "National Vision 2030"
    },
    details: [
      {
        titleKey: "energyGiant",
        content: "Qatar is one of the world's leading exporters of Liquefied Natural Gas (LNG). Its immense energy wealth has been channeled into world-class infrastructure, education, and healthcare systems."
      },
      {
        titleKey: "diplomaticHub",
        content: "Known for its sophisticated diplomacy, Qatar often serves as a mediator in international conflicts. It is also home to Al Jazeera Media Network, which has significantly influenced the global media landscape."
      },
      {
        titleKey: "sportsExcellence",
        content: "After successfully hosting the FIFA World Cup 2022—the first in the Arab world—Qatar has established itself as a premier global destination for major sporting events and high-performance training."
      }
    ]
  },
  "kuwait": {
    nameKey: 'kuwait',
    introKey: 'kuwaitIntro',
    color: "from-blue-600 to-emerald-900",
    flag: "/flags/kuwait_new.png",
    stats: {
      population: "4.3 Million",
      capital: "Kuwait City",
      currency: "Kuwaiti Dinar (KWD)",
      gdp: "$184 Billion",
      vision: "New Kuwait 2035"
    },
    details: [
      {
        titleKey: "finHeritage",
        content: "Kuwait has a long-standing tradition of maritime trade and was a financial pioneer in the region. The Kuwait Investment Authority is one of the world's oldest and largest sovereign wealth funds."
      },
      {
        titleKey: "parlTradition",
        content: "Kuwait is distinguished by its vibrant parliamentary system and active political life, which is unique in the GCC. This tradition fosters a robust public discourse and civic engagement."
      },
      {
        titleKey: "culturalHeart",
        content: "Historically known as a center for arts and literature, Kuwait continues to invest in its cultural landscape through the Sheikh Jaber Al-Ahmad Cultural Centre and other major initiatives."
      }
    ]
  },
  "oman": {
    nameKey: 'oman',
    introKey: 'omanIntro',
    color: "from-red-700 to-emerald-800",
    flag: "/flags/oman_new.png",
    stats: {
      population: "5.2 Million",
      capital: "Muscat",
      currency: "Omani Rial (OMR)",
      gdp: "$104 Billion",
      vision: "Oman 2040"
    },
    details: [
      {
        titleKey: "naturalMajesty",
        content: "Oman is celebrated for its diverse geography, from the rugged Al Hajar Mountains to the lush greenery of Salalah during the Khareef season. It prioritizes environmental conservation and sustainable tourism."
      },
      {
        titleKey: "strategicNeutrality",
        content: "Oman's foreign policy is built on a foundation of 'friend to all, enemy to none'. This strategic neutrality has made it an essential mediator and a beacon of peace in a complex region."
      },
      {
        titleKey: "maritimeLegacy",
        content: "With a coastline stretching over 3,000 kilometers, Oman has a rich maritime history as a dominant seafaring nation. Today, its ports like Salalah and Duqm are critical nodes in global trade routes."
      }
    ]
  },
  "bahrain": {
    nameKey: 'bahrain',
    introKey: 'bahrainIntro',
    color: "from-red-600 to-stone-800",
    flag: "/flags/bahrain_new.png",
    stats: {
      population: "1.5 Million",
      capital: "Manama",
      currency: "Bahraini Dinar (BHD)",
      gdp: "$44 Billion",
      vision: "Economic Vision 2030"
    },
    details: [
      {
        titleKey: "finInnovation",
        content: "Bahrain was the first GCC nation to diversify its economy and is now a global leader in Islamic finance and FinTech. The Bahrain Bay and Financial Harbour are symbols of its economic modernization."
      },
      {
        titleKey: "ancientHistory",
        content: "Home to the ancient Dilmun civilization, Bahrain has a history spanning over 5,000 years. The Bahrain Fort (Qal'at al-Bahrain) is a UNESCO World Heritage site that tells the story of this island's rich past."
      },
      {
        titleKey: "motorsportsHub",
        content: "Bahrain made history in 2004 by hosting the first Formula 1 Grand Prix in the Middle East. The Bahrain International Circuit remains a crown jewel of global motorsports."
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
    { label: t('population'), value: data.stats.population, icon: Users },
    { label: t('capital'), value: data.stats.capital, icon: Landmark },
    { label: t('currency'), value: data.stats.currency, icon: Coins },
    { label: t('vision'), value: data.stats.vision, icon: Rocket },
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
              <Image src={data.flag} alt="Flag Icon" fill sizes="80px" className="object-cover" priority />
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-2xl">
              {t(data.nameKey)}
            </h1>
            <div className="w-24 h-1.5 bg-brand-gold mx-auto rounded-full mb-8 shadow-glow" />
            <p className="max-w-3xl mx-auto text-xl text-white/90 serif italic leading-relaxed drop-shadow-lg">
              "{t(data.introKey)}"
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
                  {section.content}
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
