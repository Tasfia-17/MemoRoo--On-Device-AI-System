import React from 'react';
import { 
  MessageCircle,
  Mic,
  FileText,
  Search,
  Sparkles,
  Play,
  FileSpreadsheet,
  Database,
  Globe
} from 'lucide-react';

const VisualGraph: React.FC = () => {
  return (
    <div className="relative w-full h-[600px] md:h-[800px] flex items-center justify-center perspective-[2500px]">
      
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-pulse-glow" />
      
      {/* Orbiting Particles */}
      <div className="absolute w-[800px] h-[800px] border border-blue-500/10 rounded-full animate-spin-slow pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/2 w-4 h-4 bg-blue-400 rounded-full shadow-[0_0_20px_rgba(96,165,250,1)] blur-[2px]"></div>
        <div className="absolute bottom-1/4 right-[10%] w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,1)]"></div>
      </div>

      {/* --- WEB INTERFACE (Back Layer) --- */}
      <div className="absolute right-[-5%] lg:right-[-10%] top-[12%] w-[500px] md:w-[700px] h-[480px] glass-thick rounded-[40px] z-10 hidden lg:flex flex-col overflow-hidden animate-float-delayed transform rotate-y-[-10deg] rotate-x-[6deg] rotate-z-[2deg] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] border-white/10">
         {/* Window Header */}
         <div className="w-full h-14 bg-white/5 border-b border-white/5 flex items-center px-6 gap-3">
            <div className="flex gap-2">
               <div className="w-3.5 h-3.5 rounded-full bg-red-400 shadow-sm"></div>
               <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-sm"></div>
               <div className="w-3.5 h-3.5 rounded-full bg-green-400 shadow-sm"></div>
            </div>
            <div className="flex-1 text-center">
                <div className="inline-block px-4 py-1.5 rounded-full bg-black/30 text-[11px] text-blue-200 font-mono border border-white/5 shadow-inner">memoroo.ai/dashboard</div>
            </div>
         </div>
         
         {/* Dashboard Content */}
         <div className="p-8 grid grid-cols-12 gap-6 h-full bg-gradient-to-b from-transparent to-[#020617]/50">
             {/* Sidebar */}
             <div className="col-span-3 bg-white/5 rounded-3xl h-[85%] flex flex-col gap-3 p-4 border border-white/5">
                 <div className="h-3 w-3/4 bg-white/10 rounded-full mb-6"></div>
                 {[1,2,3,4].map(i => (
                     <div key={i} className="h-10 w-full bg-white/5 rounded-xl hover:bg-white/10 transition-colors"></div>
                 ))}
             </div>
             
             {/* Main Area */}
             <div className="col-span-9 flex flex-col gap-6">
                 {/* Graph View */}
                 <div className="w-full h-44 bg-gradient-to-br from-indigo-900/30 to-blue-900/30 rounded-3xl border border-blue-500/20 p-6 relative overflow-hidden group shadow-inner">
                    <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-500"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="h-5 w-32 bg-blue-400/20 rounded-full"></div>
                        <Sparkles size={20} className="text-blue-400 animate-pulse" />
                    </div>
                    
                    {/* Fake Nodes Connection */}
                    <div className="flex items-center justify-center gap-8 mt-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/40 backdrop-blur-md animate-bounce-subtle border border-white/10"></div>
                        <div className="h-1 w-16 bg-gradient-to-r from-blue-500/40 to-indigo-500/40 rounded-full"></div>
                        <div className="w-16 h-16 rounded-full bg-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.5)] border border-white/20 flex items-center justify-center">
                           <div className="w-8 h-8 rounded-full bg-indigo-400/50 blur-sm"></div>
                        </div>
                        <div className="h-1 w-16 bg-gradient-to-r from-indigo-500/40 to-blue-500/40 rounded-full"></div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/40 backdrop-blur-md animate-bounce-subtle border border-white/10" style={{animationDelay: '1s'}}></div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                     <div className="h-28 bg-white/5 rounded-3xl border border-white/5 shadow-lg"></div>
                     <div className="h-28 bg-white/5 rounded-3xl border border-white/5 shadow-lg"></div>
                 </div>
             </div>
         </div>
      </div>

      {/* --- MOBILE INTERFACE (Front Layer) --- */}
      <div className="relative w-[340px] h-[680px] bg-[#020617] rounded-[4rem] border-[12px] border-[#1e293b] shadow-[0_0_100px_rgba(59,130,246,0.25)] z-30 transform rotate-y-[-15deg] rotate-x-[5deg] animate-float overflow-hidden box-border ring-1 ring-white/10">
         {/* Dynamic Island */}
         <div className="absolute top-4 left-1/2 -translate-x-1/2 w-36 h-9 bg-black rounded-full z-50 flex items-center justify-end px-4 shadow-lg border border-white/5">
             <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
         </div>
         
         {/* Screen Content */}
         <div className="w-full h-full bg-gradient-to-b from-[#0f172a] via-[#0f172a] to-[#020617] flex flex-col relative overflow-hidden text-white font-sans">
             
             {/* Header */}
             <div className="pt-20 px-7 mb-6 flex justify-between items-end">
                <div>
                    <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">Thursday</div>
                    <div className="font-display font-bold text-4xl text-white drop-shadow-md">Hi, Alex</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_5px_15px_rgba(0,0,0,0.3)] flex items-center justify-center border border-white/10">
                    <span className="font-display font-bold text-lg">A</span>
                </div>
             </div>

             {/* Search */}
             <div className="mx-6 mb-8 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center px-5 gap-3 shadow-inner group cursor-text">
                <Search size={20} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-slate-500 text-sm font-medium">Ask your memory...</span>
             </div>

             {/* Stacks */}
             <div className="flex-1 px-6 flex flex-col gap-5 overflow-hidden relative">
                 
                 {/* Stack 1: Insight */}
                 <div className="p-6 bg-gradient-to-br from-blue-600/20 to-blue-900/10 border border-blue-500/30 rounded-[2rem] relative overflow-hidden group hover:border-blue-400/50 transition-colors shadow-lg">
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all"></div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-xl bg-blue-500/20 shadow-sm">
                            <Sparkles size={16} className="text-blue-300" />
                        </div>
                        <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Recall</span>
                    </div>
                    <p className="text-[15px] text-slate-100 font-medium leading-relaxed font-sans">
                       "Don't forget to send the pitch deck to Sarah before 5 PM today!"
                    </p>
                 </div>

                 {/* Stack 2: Items */}
                 <div className="flex gap-4 overflow-x-auto pb-6 pt-2 hide-scrollbar">
                     <div className="min-w-[130px] p-5 bg-white/5 border border-white/10 rounded-[2rem] flex flex-col gap-4 hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                         <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shadow-inner">
                             <Mic size={24} />
                         </div>
                         <div>
                             <div className="text-sm font-bold">Meeting</div>
                             <div className="text-xs text-slate-400 mt-1">10:00 AM</div>
                         </div>
                     </div>
                     <div className="min-w-[130px] p-5 bg-white/5 border border-white/10 rounded-[2rem] flex flex-col gap-4 hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                         <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shadow-inner">
                             <Play size={24} fill="currentColor" />
                         </div>
                         <div>
                             <div className="text-sm font-bold">Tutorial</div>
                             <div className="text-xs text-slate-400 mt-1">Youtube</div>
                         </div>
                     </div>
                 </div>

             </div>

             {/* Bottom Nav */}
             <div className="h-24 bg-[#0f172a]/90 backdrop-blur-2xl flex justify-evenly items-center px-4 pb-4 rounded-b-[3.5rem] border-t border-white/5">
                 <div className="p-4 rounded-2xl bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.6)] transform scale-110"><Sparkles size={24} className="text-white" /></div>
                 <div className="p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-colors"><Database size={24} /></div>
                 <div className="p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-colors"><Globe size={24} /></div>
             </div>
         </div>
      </div>


      {/* --- FLOATING 3D "BUBBLE" ELEMENTS --- */}
      
      {/* 1. Red Video/Play (Youtube Vibe) */}
      <div className="absolute left-[2%] top-[20%] animate-wiggle z-40">
          <div className="glass-bubble p-5 rounded-[2rem] flex items-center gap-4 shadow-[0_20px_50px_rgba(239,68,68,0.3)] border-red-500/30 transform rotate-[-8deg] hover:scale-110 transition-transform cursor-pointer group bg-gradient-to-br from-red-500/10 to-transparent">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg text-white group-hover:rotate-12 transition-transform">
                  <Play size={28} fill="white" />
              </div>
              <div className="hidden md:block">
                  <div className="w-24 h-2.5 bg-red-500/20 rounded-full mb-2"></div>
                  <div className="w-16 h-2.5 bg-red-500/20 rounded-full"></div>
              </div>
          </div>
      </div>

      {/* 2. Green Sheets/Data */}
      <div className="absolute right-[2%] lg:right-[12%] bottom-[25%] animate-float-slow z-40">
          <div className="glass-bubble p-5 rounded-[2rem] flex items-center gap-4 shadow-[0_20px_50px_rgba(34,197,94,0.3)] border-green-500/30 transform rotate-[8deg] hover:scale-110 transition-transform cursor-pointer group bg-gradient-to-br from-green-500/10 to-transparent">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg text-white group-hover:rotate-[-12deg] transition-transform">
                  <FileSpreadsheet size={28} />
              </div>
              <div className="hidden md:block">
                  <div className="w-20 h-2.5 bg-green-500/20 rounded-full mb-2"></div>
                  <div className="w-12 h-2.5 bg-green-500/20 rounded-full"></div>
              </div>
          </div>
      </div>

      {/* 3. Orange Docs/Files - Floating Bubble */}
      <div className="absolute left-[12%] bottom-[12%] animate-bounce-subtle z-20">
          <div className="glass-bubble w-24 h-28 rounded-[2rem] border-orange-500/30 shadow-[0_20px_50px_rgba(249,115,22,0.25)] flex flex-col items-center justify-center gap-2 transform rotate-[-12deg] hover:rotate-0 transition-transform hover:scale-110 bg-gradient-to-br from-orange-500/10 to-transparent">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-md">
                  <FileText size={24} />
              </div>
          </div>
      </div>

    </div>
  );
};

export default VisualGraph;