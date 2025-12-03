
import React from 'react';
import { Bot, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onStart?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onStart }) => {
  return (
    <nav className="w-full px-6 py-6 flex items-center justify-between max-w-[1600px] mx-auto z-50">
      
      {/* Brand */}
      <div className="flex items-center gap-3 cursor-pointer group" onClick={onStart}>
        <div className="relative w-12 h-12 flex items-center justify-center bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 rounded-2xl shadow-[0_0_25px_rgba(59,130,246,0.6)] transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Bot className="text-white w-7 h-7 drop-shadow-md animate-pulse-glow" />
        </div>
        <span className="text-3xl font-display font-bold text-white tracking-wide group-hover:text-blue-200 transition-colors drop-shadow-lg">
          MemoRoo
        </span>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-6">
        <a href="#" className="hidden sm:block text-slate-300 hover:text-white font-bold text-sm transition-colors hover:scale-105 transform">Sign in</a>
        <button 
          onClick={onStart}
          className="flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold shadow-[0_0_25px_rgba(59,130,246,0.6)] hover:shadow-[0_0_40px_rgba(59,130,246,0.8)] border border-blue-400/30 transition-all transform hover:-translate-y-1 active:scale-95"
        >
          <span>Get Started</span>
          <ChevronRight size={18} strokeWidth={3} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
