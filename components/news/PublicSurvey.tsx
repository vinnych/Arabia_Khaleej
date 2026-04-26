"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Users, TrendingUp, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

interface Survey {
  id: string;
  question: string;
  options: { id: string; label: string; votes: number; percentage: number }[];
  totalVotes: number;
}

const MOCK_SURVEYS: Record<string, Survey[]> = {
  en: [
    {
      id: "survey-2026-inv",
      question: "What is your primary focus for investment in the GCC for 2026?",
      options: [
        { id: "opt-1", label: "Real Estate", votes: 1240, percentage: 42 },
        { id: "opt-2", label: "Technology & AI", votes: 890, percentage: 30 },
        { id: "opt-3", label: "Sustainable Energy", votes: 530, percentage: 18 },
        { id: "opt-4", label: "Tourism & Hospitality", votes: 300, percentage: 10 },
      ],
      totalVotes: 2960,
    },
    {
      id: "survey-2026-lifestyle",
      question: "Which lifestyle trend are you most excited about in the region?",
      options: [
        { id: "opt-1", label: "Sustainable Luxury Travel", votes: 1500, percentage: 35 },
        { id: "opt-2", label: "Digital Nomad Hubs", votes: 1200, percentage: 28 },
        { id: "opt-3", label: "Cultural Heritage Tourism", votes: 900, percentage: 21 },
        { id: "opt-4", label: "Wellness & Holistic Living", votes: 700, percentage: 16 },
      ],
      totalVotes: 4300,
    },
    {
      id: "survey-2026-women",
      question: "Which area of women's empowerment in the GCC do you find most impactful?",
      options: [
        { id: "opt-1", label: "Leadership in Business", votes: 2100, percentage: 40 },
        { id: "opt-2", label: "Innovation & Tech", votes: 1575, percentage: 30 },
        { id: "opt-3", label: "Arts & Culture", votes: 1050, percentage: 20 },
        { id: "opt-4", label: "Sports & Athletics", votes: 525, percentage: 10 },
      ],
      totalVotes: 5250,
    }
  ],
  ar: [
    {
      id: "survey-2026-inv",
      question: "ما هو تركيزك الأساسي للاستثمار في دول مجلس التعاون الخليجي لعام 2026؟",
      options: [
        { id: "opt-1", label: "العقارات", votes: 1240, percentage: 42 },
        { id: "opt-2", label: "التكنولوجيا والذكاء الاصطناعي", votes: 890, percentage: 30 },
        { id: "opt-3", label: "الطاقة المستدامة", votes: 530, percentage: 18 },
        { id: "opt-4", label: "السياحة والضيافة", votes: 300, percentage: 10 },
      ],
      totalVotes: 2960,
    },
    {
      id: "survey-2026-lifestyle",
      question: "أي توجه في نمط الحياة أنت أكثر حماساً له في المنطقة؟",
      options: [
        { id: "opt-1", label: "السياحة الفاخرة المستدامة", votes: 1500, percentage: 35 },
        { id: "opt-2", label: "مراكز البدو الرقميين", votes: 1200, percentage: 28 },
        { id: "opt-3", label: "سياحة التراث الثقافي", votes: 900, percentage: 21 },
        { id: "opt-4", label: "العافية والحياة الشمولية", votes: 700, percentage: 16 },
      ],
      totalVotes: 4300,
    },
    {
      id: "survey-2026-women",
      question: "أي مجال لتمكين المرأة في دول مجلس التعاون الخليجي تجده الأكثر تأثيراً؟",
      options: [
        { id: "opt-1", label: "القيادة في الأعمال", votes: 2100, percentage: 40 },
        { id: "opt-2", label: "الابتكار والتكنولوجيا", votes: 1575, percentage: 30 },
        { id: "opt-3", label: "الفنون والثقافة", votes: 1050, percentage: 20 },
        { id: "opt-4", label: "الرياضة والألعاب البدنية", votes: 525, percentage: 10 },
      ],
      totalVotes: 5250,
    }
  ],
};

export default function PublicSurvey() {
  const { language, isRTL } = useLanguage();
  const surveys = MOCK_SURVEYS[language as keyof typeof MOCK_SURVEYS] || MOCK_SURVEYS.en;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votedIds, setVotedIds] = useState<Record<string, string>>({});
  
  const currentSurvey = surveys[currentIndex];

  useEffect(() => {
    const savedVotes: Record<string, string> = {};
    surveys.forEach(s => {
      const vote = localStorage.getItem(`voted_${s.id}`);
      if (vote) savedVotes[s.id] = vote;
    });
    setVotedIds(savedVotes);
  }, [language, surveys]);

  const handleVote = (optionId: string) => {
    if (votedIds[currentSurvey.id]) return;
    const newVotes = { ...votedIds, [currentSurvey.id]: optionId };
    setVotedIds(newVotes);
    localStorage.setItem(`voted_${currentSurvey.id}`, optionId);
  };

  const nextSurvey = () => setCurrentIndex((prev) => (prev + 1) % surveys.length);
  const prevSurvey = () => setCurrentIndex((prev) => (prev - 1 + surveys.length) % surveys.length);

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 my-12 ${isRTL ? 'font-serif-ar' : ''}`}>
      <div className="glass p-8 sm:p-12 rounded-[3rem] border-brand-gold/20 shadow-2xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/5 rounded-full -mr-24 -mt-24 blur-3xl animate-pulse" />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-gold/10 text-brand-gold">
              <TrendingUp size={22} />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">
              {language === 'ar' ? 'استطلاع الرأي العام' : 'Public Sentiment'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {votedIds[currentSurvey.id] && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-green-500 font-bold text-[9px] uppercase tracking-widest"
              >
                <CheckCircle2 size={14} />
                {language === 'ar' ? 'تم التصويت' : 'Vote Recorded'}
              </motion.div>
            )}
            <div className="flex items-center gap-1">
              <button onClick={prevSurvey} className="p-1.5 rounded-full glass hover:bg-brand-gold/10 transition-colors">
                <ChevronLeft size={16} className={isRTL ? "rotate-180" : ""} />
              </button>
              <button onClick={nextSurvey} className="p-1.5 rounded-full glass hover:bg-brand-gold/10 transition-colors">
                <ChevronRight size={16} className={isRTL ? "rotate-180" : ""} />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSurvey.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl sm:text-3xl font-black mb-10 text-foreground leading-tight tracking-tight">
              {currentSurvey.question}
            </h3>

            <div className="space-y-5">
              {currentSurvey.options.map((option, idx) => (
                <button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  disabled={!!votedIds[currentSurvey.id]}
                  className={`w-full text-left relative group outline-none select-none transition-all ${votedIds[currentSurvey.id] ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'}`}
                >
                  <div className="flex justify-between items-center mb-2.5 px-2">
                    <span className={`text-sm sm:text-base font-bold transition-colors ${
                      votedIds[currentSurvey.id] === option.id ? 'text-brand-gold' : 'text-foreground/80 group-hover:text-foreground'
                    }`}>
                      {option.label}
                    </span>
                    <AnimatePresence>
                      {votedIds[currentSurvey.id] && (
                        <motion.span 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs font-black text-brand-gold tabular-nums"
                        >
                          {option.percentage}%
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="h-4 w-full bg-brand-gold/5 rounded-full overflow-hidden border border-brand-gold/10 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: votedIds[currentSurvey.id] ? `${option.percentage}%` : "0%" }}
                      transition={{ duration: 1.2, ease: "circOut", delay: idx * 0.05 }}
                      className={`h-full rounded-full ${
                        votedIds[currentSurvey.id] === option.id 
                        ? 'bg-gradient-to-r from-brand-gold/60 to-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                        : 'bg-brand-gold/20'
                      }`}
                    />
                    
                    {!votedIds[currentSurvey.id] && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-gold/5" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 pt-8 border-t border-brand-gold/10 flex flex-wrap items-center justify-between gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
          <div className="flex items-center gap-3">
            <Users size={14} className="text-brand-gold/60" />
            <span>{currentSurvey.totalVotes.toLocaleString()} {language === 'ar' ? 'مشارك' : 'Global Participants'}</span>
          </div>
          <div className="flex items-center gap-3">
            <BarChart3 size={14} className="text-brand-gold/60" />
            <span className="animate-pulse">{language === 'ar' ? 'تحليلات في الوقت الفعلي' : 'Real-time Intelligence'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
