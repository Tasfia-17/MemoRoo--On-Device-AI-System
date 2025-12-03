
import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Calendar, 
  Search, 
  Image as ImageIcon, 
  Mic, 
  MapPin, 
  BookOpen, 
  Zap, 
  Trophy,
  Smile,
  Frown,
  TrendingUp,
  MoreHorizontal,
  Clock
} from 'lucide-react';

const LifeDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'wiki'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data for Mood
  const moodData = [
    { day: 'Mon', value: 60, label: 'Calm', color: 'bg-blue-500' },
    { day: 'Tue', value: 40, label: 'Stressed', color: 'bg-orange-500', note: 'Project Deadline' },
    { day: 'Wed', value: 85, label: 'Joyful', color: 'bg-pink-500' },
    { day: 'Thu', value: 70, label: 'Focused', color: 'bg-indigo-500' },
    { day: 'Fri', value: 90, label: 'Excited', color: 'bg-green-500' },
    { day: 'Sat', value: 50, label: 'Tired', color: 'bg-slate-500' },
    { day: 'Sun', value: 80, label: 'Relaxed', color: 'bg-teal-500' },
  ];

  // Mock Data for Timeline (Multi-modal)
  const timelineEvents = [
    {
      id: 1,
      time: '10:42 AM',
      type: 'voice',
      title: 'Design Brainstorm',
      desc: 'Voice note recorded while walking. "Need to simplify the navigation layer."',
      mood: 'Creative',
      moodColor: 'text-purple-400',
      asset: 'audio_wave.svg'
    },
    {
      id: 2,
      time: 'Yesterday',
      type: 'photo',
      title: 'Whiteboard Session',
      desc: 'Snapshot of the Q3 architecture diagram.',
      mood: 'Productive',
      moodColor: 'text-green-400',
      asset: 'image'
    },
    {
      id: 3,
      time: 'Jan 2',
      type: 'text',
      title: 'Project Alpha Goal',
      desc: 'Log: "Feeling overwhelmed by the scope creep. Need to push back on features."',
      mood: 'Stressed',
      moodColor: 'text-orange-400',
      warning: true
    }
  ];

  // Mock Data for Private Wiki
  const wikiEntries = [
    { id: 'w1', title: 'Project Alpha', type: 'Project', tags: ['Work', 'Q3'], summary: 'Main infrastructure overhaul for 2024. Key stakeholder: Sarah.' },
    { id: 'w2', title: 'Kyoto Trip', type: 'Event', tags: ['Travel', '2023'], summary: '2-week vacation in Japan. Visited Fushimi Inari. Stayed at Ryokan.' },
    { id: 'w3', title: 'React Performance', type: 'Knowledge', tags: ['Dev', 'Learning'], summary: 'Notes on memoization, virtualization, and concurrent mode patterns.' },
  ];

  return (
    <div className="absolute inset-0 bg-[#020617] overflow-y-auto scrollbar-thin z-10 font-sans">
      <div className="max-w-[1400px] mx-auto p-6 md:p-10 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
           <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 flex items-center gap-3">
                 <Heart className="text-pink-500 fill-pink-500 animate-pulse" />
                 Life OS
              </h1>
              <p className="text-slate-400 text-lg">Your memories, organized into a living story.</p>
           </div>
           
           <div className="flex gap-4">
              <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center min-w-[100px]">
                 <span className="text-xs text-slate-400 uppercase font-bold">Streak</span>
                 <span className="text-2xl font-display font-bold text-orange-400 flex items-center gap-1">
                    <Zap size={18} fill="currentColor" /> 12
                 </span>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center min-w-[100px]">
                 <span className="text-xs text-slate-400 uppercase font-bold">Memories</span>
                 <span className="text-2xl font-display font-bold text-blue-400">8,421</span>
              </div>
           </div>
        </div>

        {/* --- SECTION 1: CONTEXTUAL MOOD MEMORY --- */}
        <section className="mb-12">
           <div className="flex items-center gap-3 mb-6">
              <Activity className="text-indigo-400" />
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Emotional Context Stream</h2>
           </div>
           
           <div className="w-full h-64 glass-thick rounded-[2.5rem] p-8 relative overflow-hidden flex items-end gap-2 md:gap-4 shadow-[0_0_50px_rgba(79,70,229,0.15)] group">
              {/* Background Graph Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
              
              {/* Bars */}
              {moodData.map((data, idx) => (
                  <div key={idx} className="flex-1 flex flex-col justify-end gap-3 group/bar relative h-full">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-32 bg-slate-900 border border-white/10 p-3 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all z-20 pointer-events-none shadow-xl">
                          <div className="text-xs text-slate-400 mb-1">{data.day}</div>
                          <div className="font-bold text-white text-sm">{data.label}</div>
                          {data.note && <div className="text-[10px] text-orange-300 mt-1 italic">"{data.note}"</div>}
                      </div>

                      <div 
                        className={`w-full rounded-2xl relative transition-all duration-500 hover:brightness-125 ${data.color}`}
                        style={{ height: `${data.value}%`, opacity: 0.8 }}
                      >
                         <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-white/20 to-transparent rounded-2xl"></div>
                         {/* Glow */}
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-10 bg-white/30 blur-xl"></div>
                      </div>
                      
                      <div className="text-center">
                          <div className="text-xs font-bold text-slate-400 mb-1">{data.day}</div>
                          <div className={`w-2 h-2 rounded-full mx-auto ${data.color}`}></div>
                      </div>
                  </div>
              ))}

              {/* Connective Line (SVG) */}
              <svg className="absolute inset-0 pointer-events-none w-full h-full opacity-30" style={{ transform: 'scaleY(0.8) translateY(-20px)' }}>
                 <path d="M0,200 Q100,100 200,180 T400,150 T600,80 T800,120 T1000,50 T1200,150" fill="none" stroke="white" strokeWidth="4" className="animate-draw" />
              </svg>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* --- SECTION 2: LIFE TIMELINE (Multi-modal) --- */}
           <div className="lg:col-span-7 flex flex-col">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                      <Clock className="text-blue-400" />
                      <h2 className="text-xl font-bold text-white uppercase tracking-wider">Timeline</h2>
                  </div>
                  <div className="flex bg-white/5 p-1 rounded-lg">
                      <button 
                        onClick={() => setActiveTab('timeline')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'timeline' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        Activity
                      </button>
                      <button 
                         onClick={() => setActiveTab('wiki')}
                         className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'wiki' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        Wiki
                      </button>
                  </div>
               </div>

               {activeTab === 'timeline' ? (
                   <div className="relative pl-8 border-l-2 border-white/5 space-y-8">
                      {timelineEvents.map((event, i) => (
                          <div key={event.id} className="relative group">
                              {/* Connector Node */}
                              <div className={`absolute -left-[41px] top-6 w-5 h-5 rounded-full border-4 border-[#020617] shadow-[0_0_15px_currentColor] ${event.mood === 'Stressed' ? 'bg-orange-500 text-orange-500' : 'bg-blue-500 text-blue-500'}`}></div>
                              
                              <div className="glass-bubble p-6 rounded-[2rem] hover:bg-white/5 transition-all hover:scale-[1.02] transform perspective-1000">
                                  <div className="flex justify-between items-start mb-3">
                                      <div className="flex items-center gap-3">
                                          <div className={`p-2.5 rounded-xl ${event.type === 'voice' ? 'bg-purple-500/20 text-purple-400' : event.type === 'photo' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                              {event.type === 'voice' && <Mic size={18} />}
                                              {event.type === 'photo' && <ImageIcon size={18} />}
                                              {event.type === 'text' && <BookOpen size={18} />}
                                          </div>
                                          <div>
                                              <h3 className="font-bold text-lg text-white">{event.title}</h3>
                                              <div className="text-xs text-slate-400">{event.time}</div>
                                          </div>
                                      </div>
                                      <div className={`text-xs font-bold px-3 py-1 rounded-full border bg-white/5 ${event.moodColor} border-white/10`}>
                                          {event.mood}
                                      </div>
                                  </div>
                                  
                                  <p className="text-slate-300 text-sm leading-relaxed pl-1">
                                      {event.desc}
                                  </p>
                                  
                                  {/* Multi-modal Preview */}
                                  {event.type === 'photo' && (
                                      <div className="mt-4 h-32 w-full bg-slate-800 rounded-xl overflow-hidden relative group/img cursor-pointer">
                                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                                          <div className="absolute inset-0 flex items-center justify-center text-slate-500 group-hover/img:text-white transition-colors">
                                              <ImageIcon size={32} />
                                              <span className="ml-2 text-sm font-bold">View Image</span>
                                          </div>
                                      </div>
                                  )}
                                  
                                  {event.type === 'voice' && (
                                      <div className="mt-4 h-12 w-full bg-slate-900 rounded-xl flex items-center px-4 gap-2">
                                          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                              <div className="w-0 h-0 border-l-[6px] border-l-black border-y-[4px] border-y-transparent ml-0.5"></div>
                                          </div>
                                          <div className="flex-1 h-8 flex items-center gap-0.5 opacity-50">
                                              {[...Array(20)].map((_, j) => (
                                                  <div key={j} className="w-1 bg-white rounded-full" style={{ height: `${20 + Math.random() * 80}%` }}></div>
                                              ))}
                                          </div>
                                          <span className="text-xs font-mono text-slate-400">0:42</span>
                                      </div>
                                  )}

                                  {event.warning && (
                                      <div className="mt-3 flex items-center gap-2 text-xs text-orange-400 bg-orange-900/20 p-2 rounded-lg border border-orange-500/20">
                                          <Activity size={12} />
                                          <span>Mood Alert: High cortisol levels detected in language pattern.</span>
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))}
                   </div>
               ) : (
                   /* --- PRIVATE WIKI MODE --- */
                   <div className="space-y-6 animate-pop-in">
                       <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                          <input 
                             type="text" 
                             placeholder="Search your private knowledge base..." 
                             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                             value={searchQuery}
                             onChange={(e) => setSearchQuery(e.target.value)}
                          />
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {wikiEntries.filter(w => w.title.toLowerCase().includes(searchQuery.toLowerCase())).map(entry => (
                               <div key={entry.id} className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer group">
                                   <div className="flex justify-between items-start mb-3">
                                       <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider bg-blue-900/20 px-2 py-1 rounded-md">{entry.type}</span>
                                       <MoreHorizontal size={16} className="text-slate-500 hover:text-white" />
                                   </div>
                                   <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-blue-300 transition-colors">{entry.title}</h3>
                                   <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-4">{entry.summary}</p>
                                   <div className="flex flex-wrap gap-2">
                                       {entry.tags.map(tag => (
                                           <span key={tag} className="text-[10px] text-slate-500 px-2 py-1 rounded-md bg-black/20">#{tag}</span>
                                       ))}
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               )}
           </div>

           {/* --- SECTION 3: WIDGETS (Habits/Goals) --- */}
           <div className="lg:col-span-5 flex flex-col gap-8">
               
               {/* Daily Habits */}
               <div className="glass-thick rounded-[2.5rem] p-8">
                   <div className="flex items-center justify-between mb-6">
                       <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                           <Trophy size={18} className="text-yellow-400" /> Habits
                       </h3>
                       <span className="text-xs text-slate-400">Today</span>
                   </div>
                   
                   <div className="space-y-4">
                       <div className="flex items-center gap-4 group cursor-pointer">
                           <div className="w-12 h-12 rounded-full border-4 border-blue-600 flex items-center justify-center text-xs font-bold text-white relative">
                               75%
                               <div className="absolute inset-0 border-4 border-slate-700 rounded-full -z-10"></div>
                           </div>
                           <div className="flex-1">
                               <div className="text-sm font-bold text-white">Hydration</div>
                               <div className="text-xs text-slate-400">1,500 / 2,000 ml</div>
                           </div>
                           <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                               <TrendingUp size={16} />
                           </div>
                       </div>
                       
                       <div className="flex items-center gap-4 group cursor-pointer">
                           <div className="w-12 h-12 rounded-full border-4 border-purple-600 flex items-center justify-center text-xs font-bold text-white relative">
                               100%
                               <div className="absolute inset-0 border-4 border-slate-700 rounded-full -z-10"></div>
                           </div>
                           <div className="flex-1">
                               <div className="text-sm font-bold text-white">Deep Work</div>
                               <div className="text-xs text-slate-400">4 / 4 hours</div>
                           </div>
                           <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-green-400 opacity-100">
                               <Smile size={16} />
                           </div>
                       </div>

                       <div className="flex items-center gap-4 group cursor-pointer">
                           <div className="w-12 h-12 rounded-full border-4 border-transparent border-t-orange-500 border-r-orange-500 flex items-center justify-center text-xs font-bold text-white relative">
                               30%
                               <div className="absolute inset-0 border-4 border-slate-700 rounded-full -z-10"></div>
                           </div>
                           <div className="flex-1">
                               <div className="text-sm font-bold text-white">Meditation</div>
                               <div className="text-xs text-slate-400">5 / 15 mins</div>
                           </div>
                           <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                               <TrendingUp size={16} />
                           </div>
                       </div>
                   </div>
               </div>
               
               {/* Private Wikipedia Prompt */}
               <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-indigo-500/30 relative overflow-hidden group">
                   <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/30 transition-all"></div>
                   <BookOpen size={32} className="text-indigo-400 mb-4" />
                   <h3 className="text-2xl font-display font-bold text-white mb-2">Your Private Wikipedia</h3>
                   <p className="text-sm text-slate-300 leading-relaxed mb-6">
                       Everything you know, instantly searchable. We've auto-generated 12 new wiki entries from your last meeting.
                   </p>
                   <button onClick={() => setActiveTab('wiki')} className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors border border-white/5">
                       Explore Knowledge Base
                   </button>
               </div>

           </div>

        </div>

      </div>
    </div>
  );
};

export default LifeDashboard;
