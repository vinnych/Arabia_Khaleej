/* eslint-disable i18next/no-literal-string */
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="glass p-10 md:p-16 rounded-[3rem] border-brand-gold/20 shadow-2xl max-w-2xl w-full relative overflow-hidden">
        {/* Background Blur */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-900/10 blur-[80px] rounded-full pointer-events-none"></div>

        <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
          Unexpected Disturbance
        </h2>
        <p className="text-muted-foreground/80 mb-10 max-w-md mx-auto">
          We encountered an anomaly while fetching regional intelligence. Our systems have logged this event.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="gold-liquid px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase w-full sm:w-auto"
          >
            Attempt Recovery
          </button>
          <Link
            href="/"
            className="glass px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase text-foreground hover:bg-white/5 transition-colors w-full sm:w-auto"
          >
            Return to Base
          </Link>
        </div>
      </div>
    </div>
  );
}
