
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-brand-obsidian/95 backdrop-blur-xl">
      <div className="relative w-24 h-24 mb-8">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 border-4 border-brand-gold/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        
        {/* Inner pulsing diamond */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-brand-gold/30 rounded-sm rotate-45 animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.4)]"></div>
        </div>
      </div>
      <p className="text-sm font-bold text-brand-gold uppercase tracking-[0.3em] animate-pulse">
        Loading Intelligence...
      </p>
    </div>
  );
}
