import React from 'react';
import { 
  Sparkles, 
  Search, 
  Plus, 
  Minimize2, 
  Maximize2, 
  MoreHorizontal, 
  FileText, 
  Mic, 
  Image as ImageIcon,
  Link,
  BrainCircuit,
  Database,
  Share2
} from 'lucide-react';

const CanvasInterface: React.FC = () => {
  return (
    <div className="w-full h-[850px] relative rounded-[3rem] border-[3px] border-white/10 bg-[#020617] overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.15)] group perspective-1000">
      
      {/* --- Background Grid --- */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none"></div>
      
      {/* --- Ambient Glows --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 blur-[100px] rounded-full mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[100px] rounded-full mix-blend-screen"></div>

      {/* --- Top Toolbar --- */}
      <div className="absolute top-6 left-6 right-6 h-20 glass-thick rounded-full flex items-center justify-between px-8 z-30 shadow-lg">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <BrainCircuit size={20} />
           </div>
           <div>
              <h3 className="font-display font-bold text-lg text-white">Neural Canvas</h3>
              <p className="text-xs text-blue-300 font-medium">Memory Graph: Active</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 transition-all">
              <Plus size={16} /> Add Source
           </button>
           <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all">
              <Sparkles size={16} className="animate-pulse" /> Synthesize
           </button>
        </div>
      </div>

      {/* --- Main Canvas Area --- */}
      <div className="absolute inset-0 top-24 bottom-0 z-10 overflow-hidden cursor-grab active:cursor-grabbing">
         
         {/* Connector Lines (SVG) */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Curved Line 1 */}
            <path 
              d="M320,250 C450,250 450,450 580,450" 
              fill="none" 
              stroke="url(#gradientLine1)" 
              strokeWidth="3" 
              strokeLinecap="round"
              className="animate-draw opacity-0"
              style={{animationDelay: '0.5s', animationFillMode: 'forwards'}}
            />
            {/* Curved Line 2 */}
            <path 
              d="M580,450 C700,450 700,300 820,300" 
              fill="none" 
              stroke="url(#gradientLine2)" 
              strokeWidth="3" 
              strokeLinecap="round"
              className="animate-draw opacity-0"
              style={{animationDelay: '1.2s', animationFillMode: 'forwards'}}
            />
             {/* Curved Line 3 */}
            <path 
              d="M320,600 C450,600 450,450 580,450" 
              fill="none" 
              stroke="url(#gradientLine1)" 
              strokeWidth="3" 
              strokeDasharray="5,5"
              strokeLinecap="round"
              className="opacity-40"
            />
            
            <defs>
              <linearGradient id="gradientLine1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
              <linearGradient id="gradientLine2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
         </svg>

         {/* --- Floating Cards --- */}

         {/* Card 1: User Research (Yellow/Orange) */}
         <div className="absolute top-[150px] left-[80px] w-64 glass-bubble rounded-[1.5rem] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-300 animate-pop-in" style={{animationDelay: '0.2s'}}>
            <div className="flex justify-between items-start mb-3">
               <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                  <Mic size={20} />
               </div>
               <button className="text-slate-500 hover:text-white"><MoreHorizontal size={18} /></button>
            </div>
            <h4 className="font-display font-bold text-white mb-2">User Interview #4</h4>
            <div className="text-xs text-slate-300 bg-white/5 p-2 rounded-lg mb-2">
               "I need a better way to organize my random thoughts..."
            </div>
            <div className="flex gap-2 mt-3">
               <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-orange-500/20 text-orange-300 border border-orange-500/20">Voice Note</span>
               <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-white/5 text-slate-400">Processed</span>
            </div>
         </div>

         {/* Card 2: Derived Insight (Center Node - Blue/Purple) */}
         <div className="absolute top-[380px] left-[520px] w-72 glass-thick rounded-[1.5rem] p-6 shadow-[0_0_60px_rgba(99,102,241,0.25)] border-indigo-500/40 hover:scale-105 transition-transform duration-300 animate-pop-in z-20" style={{animationDelay: '0.8s'}}>
             <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg animate-bounce-subtle">
                <Sparkles size={14} className="text-white" />
             </div>
             <h4 className="font-display font-bold text-lg text-white mb-2 flex items-center gap-2">
                <BrainCircuit size={18} className="text-indigo-400" />
                Core Pain Point
             </h4>
             <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Users struggle with <b>unstructured data retrieval</b>. Need semantic search to bridge the gap between "notes" and "knowledge".
             </p>
             <div className="h-1.5 w-full bg-indigo-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[85%]"></div>
             </div>
             <div className="flex justify-between mt-2 text-[10px] text-indigo-300 font-bold">
                <span>Confidence</span>
                <span>85%</span>
             </div>
         </div>

         {/* Card 3: Tech Specs (Blue) */}
         <div className="absolute top-[250px] right-[400px] w-64 glass-bubble rounded-[1.5rem] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-300 animate-pop-in" style={{animationDelay: '1.4s'}}>
            <div className="flex justify-between items-start mb-3">
               <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <FileText size={20} />
               </div>
               <button className="text-slate-500 hover:text-white"><MoreHorizontal size={18} /></button>
            </div>
            <h4 className="font-display font-bold text-white mb-2">Backend Specs v2</h4>
            <div className="text-xs text-slate-300 bg-white/5 p-2 rounded-lg mb-2">
               Implementing vector embeddings for semantic chunking...
            </div>
            <div className="flex gap-2 mt-3">
               <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/20">PDF</span>
               <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-white/5 text-slate-400">Indexed</span>
            </div>
         </div>
         
         {/* Card 4: Web Scraping (Green) */}
         <div className="absolute top-[550px] left-[250px] w-64 glass-bubble rounded-[1.5rem] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-300 animate-pop-in" style={{animationDelay: '0.5s'}}>
             <div className="flex justify-between items-start mb-3">
               <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                  <Link size={20} />
               </div>
               <button className="text-slate-500 hover:text-white"><MoreHorizontal size={18} /></button>
            </div>
            <h4 className="font-display font-bold text-white mb-2">Competitor Analysis</h4>
            <div className="text-xs text-slate-300 bg-white/5 p-2 rounded-lg mb-2">
               Scraped data from market leaders showing gap in memory retention...
            </div>
             <div className="flex gap-2 mt-3">
               <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-green-500/20 text-green-300 border border-green-500/20">URL</span>
               <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-white/5 text-slate-400">Live</span>
            </div>
         </div>

      </div>

      {/* --- Right Sidebar (Reasoning) --- */}
      <div className="absolute top-28 bottom-6 right-6 w-80 glass-thick rounded-[2.5rem] p-6 flex flex-col gap-6 shadow-2xl z-20 backdrop-blur-2xl border-l border-white/10 animate-slide-up">
          
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg animate-pulse">
                <Sparkles size={14} className="text-white" />
             </div>
             <h3 className="font-display font-bold text-white">AI Reasoning</h3>
          </div>

          {/* Step 1: Ingestion */}
          <div className="flex gap-4 items-start opacity-50 hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">1</div>
              <div>
                  <h5 className="text-sm font-bold text-white">Ingestion</h5>
                  <p className="text-xs text-slate-400 mt-1">Processed 3 unstructured inputs (Audio, PDF, Web).</p>
              </div>
          </div>

          {/* Step 2: Embedding */}
          <div className="flex gap-4 items-start opacity-50 hover:opacity-100 transition-opacity">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">2</div>
              <div>
                  <h5 className="text-sm font-bold text-white">Vector Embedding</h5>
                  <p className="text-xs text-slate-400 mt-1">Generated 1,024 dimensional vectors for semantic search.</p>
              </div>
          </div>

          {/* Step 3: Synthesis (Active) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-blue-900/50 border border-indigo-500/30">
              <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Synthesizing</span>
                  </div>
                  <span className="text-xs font-mono text-indigo-300">350ms</span>
              </div>
              <p className="text-sm text-white font-medium leading-relaxed">
                  Connecting "User Interview" pain points with "Backend Specs" solutions.
              </p>
          </div>

          {/* Relationships */}
          <div className="mt-auto">
             <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Detected Patterns</h5>
             <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                   <span className="text-xs text-slate-300">Extends Knowledge</span>
                   <div className="h-1.5 w-16 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[90%]"></div></div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                   <span className="text-xs text-slate-300">Derives Insight</span>
                   <div className="h-1.5 w-16 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[75%]"></div></div>
                </div>
             </div>
          </div>

      </div>

    </div>
  );
};

export default CanvasInterface;