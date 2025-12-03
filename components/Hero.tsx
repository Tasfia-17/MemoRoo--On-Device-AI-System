
import React from 'react';
import { ArrowRight, MessageCircle, BrainCircuit, FileText, Sparkles } from 'lucide-react';

interface HeroProps {
  onStart?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative z-20 flex flex-col items-start text-left w-full pl-4 lg:pl-0">
      
      {/* Big Headline */}
      <h1 className="text-7xl lg:text-8xl font-display font-bold leading-[0.9] mb-8 text-white tracking-tight animate-slide-up opacity-0 drop-shadow-[0_0_25px_rgba(59,130,246,0.3)]" style={{animationDelay: '0.2s'}}>
        Your Life, <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-300 animate-pulse-glow filter drop-shadow-[0_0_15px_rgba(165,180,252,0.4)]">
          Remembered.
        </span>
      </h1>

      {/* Description */}
      <p className="text-xl md:text-2xl text-slate-300 max-w-xl mb-12 leading-relaxed font-medium animate-slide-up opacity-0" style={{animationDelay: '0.3s'}}>
        MemoRoo is the <span className="text-blue-200 font-bold">intelligent memory layer</span> for your daily life. It ingests notes, chats, and voice to build a structured second brain you can talk to.
      </p>

      {/* Feature Capabilities - Bouncy Glass Tiles */}
      <div className="flex flex-wrap gap-5 mb-14 animate-slide-up opacity-0" style={{animationDelay: '0.4s'}}>
         
         <div className="flex items-center gap-3 px-6 py-4 rounded-3xl glass-bubble cursor-pointer group hover:scale-105 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(59,130,246,0.3)]">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                <MessageCircle size={20} fill="rgba(255,255,255,0.2)" />
            </div>
            <span className="text-base font-bold text-white group-hover:text-blue-200 transition-colors">Chat Sync</span>
         </div>

         <div className="flex items-center gap-3 px-6 py-4 rounded-3xl glass-bubble cursor-pointer group hover:scale-105 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(168,85,247,0.3)]">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                <BrainCircuit size={20} fill="rgba(255,255,255,0.2)" />
            </div>
            <span className="text-base font-bold text-white group-hover:text-purple-200 transition-colors">Neural Recall</span>
         </div>

         <div className="flex items-center gap-3 px-6 py-4 rounded-3xl glass-bubble cursor-pointer group hover:scale-105 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(249,115,22,0.3)]">
             <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                <FileText size={20} fill="rgba(255,255,255,0.2)" />
            </div>
            <span className="text-base font-bold text-white group-hover:text-orange-200 transition-colors">Doc Parsing</span>
         </div>

      </div>

      {/* Buttons - Just ONE Main Call to Action */}
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto animate-slide-up opacity-0" style={{animationDelay: '0.5s'}}>
        <button 
          onClick={onStart}
          className="relative w-full sm:w-auto px-10 py-5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-500 text-white font-display font-bold text-xl shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group overflow-hidden border border-white/20"
        >
          <span className="relative z-10">Start for Free</span>
          <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform relative z-10" />
          
          {/* Shine Effect */}
          <div className="absolute top-0 -left-[100%] w-[100%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-[wiggle_1s_ease-in-out_infinite]" />
        </button>
        
        <div className="hidden lg:flex items-center gap-2 text-sm font-bold text-slate-400 animate-pulse">
            <Sparkles size={14} className="text-yellow-400" />
            <span>No credit card required</span>
        </div>
      </div>

    </div>
  );
};

export default Hero;
