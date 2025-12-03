import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VisualGraph from './components/VisualGraph';
import CanvasInterface from './components/CanvasInterface';
import Dashboard from './components/Dashboard';
import { Database, BrainCircuit, MessageSquare, Share2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  const handleStart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 overflow-x-hidden relative font-sans">
      
      {/* --- Atmospheric Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         {/* Deep Blue Gradient Mesh */}
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617]"></div>
         
         {/* Animated Glow Orbs (Supermemory style: Blue/Indigo/Purple) */}
         <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse-glow" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {currentView === 'landing' ? (
          <>
            <Navbar onStart={handleStart} />
            
            {/* --- SECTION 1: HERO & VISUALIZATION --- */}
            <main className="w-full max-w-[1600px] mx-auto px-6 py-8 md:py-16 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16 lg:gap-8 mb-32">
              
              {/* Left Side: Text Content */}
              <div className="w-full lg:w-[45%] flex flex-col justify-center lg:pt-20">
                 <Hero onStart={handleStart} />
              </div>

              {/* Right Side: Visual Interactive App Layer */}
              <div className="w-full lg:w-[55%] relative flex items-center justify-center lg:justify-end">
                 <VisualGraph />
              </div>
              
            </main>

            {/* --- SECTION 2: NEURAL CANVAS & FEATURES --- */}
            <section className="w-full max-w-[1600px] mx-auto px-6 pb-32">
               
               <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 drop-shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                     From Chaos to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Structured Wisdom</span>
                  </h2>
                  <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                     Visualize your second brain. Connect notes, docs, and conversations in a persistent memory graph.
                  </p>
               </div>

               <CanvasInterface />

               {/* --- Feature Grid Breakdown --- */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
                  {[
                    { 
                      icon: <Database className="text-blue-400" size={24} />, 
                      title: "1. Ingestion", 
                      desc: "Drag & drop PDFs, docs, or paste URLs. We ingest it all." 
                    },
                    { 
                      icon: <BrainCircuit className="text-purple-400" size={24} />, 
                      title: "2. Chunking & Embeddings", 
                      desc: "Smart splitting of content into semantic vectors." 
                    },
                    { 
                      icon: <Share2 className="text-green-400" size={24} />, 
                      title: "3. Memory Graph", 
                      desc: "Mapping relationships: derives, extends, and updates." 
                    },
                    { 
                      icon: <MessageSquare className="text-orange-400" size={24} />, 
                      title: "4. Chat Retrieval", 
                      desc: "Hybrid search finds the exact context for your LLM." 
                    },
                  ].map((feature, idx) => (
                    <div key={idx} className="glass-bubble p-6 rounded-3xl flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                          {feature.icon}
                       </div>
                       <div>
                          <h4 className="font-display font-bold text-lg text-white mb-2">{feature.title}</h4>
                          <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>

            </section>
          </>
        ) : (
          <Dashboard onBack={() => setCurrentView('landing')} />
        )}

      </div>
    </div>
  );
};

export default App;