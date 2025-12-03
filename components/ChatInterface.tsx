
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Paperclip, 
  Mic, 
  FileText, 
  Link as LinkIcon, 
  Database,
  Image as ImageIcon,
  Zap,
  CheckCircle2,
  BrainCircuit,
  ArrowRight,
  Activity
} from 'lucide-react';

interface CardData {
  id: string;
  type: 'note' | 'link' | 'file' | 'voice' | 'image';
  title: string;
  content: string;
  tags: string[];
}

interface ChatInterfaceProps {
  memories: CardData[];
  onAddMemory: (title: string, content: string, type: 'note') => void;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  relatedMemories?: CardData[]; // RAG Context
  action?: 'memory_updated' | 'memory_created';
  moodContext?: string; // e.g. "Stressed" or "Curious"
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ memories, onAddMemory }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: "Hi Alex! I'm ready. I have context on your User Research, Q3 Goals, and Tech Specs. What do you need to find?",
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');

    // 1. Add User Message
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
    };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    // 2. Simulate "RAG" (Retrieval)
    const keywords = userText.toLowerCase().split(' ');
    const hits = memories.filter(m => 
      keywords.some(k => k.length > 3 && (m.title.toLowerCase().includes(k) || m.content.toLowerCase().includes(k)))
    );

    // Detect Mood (Mock Logic)
    let detectedMood = '';
    if (userText.toLowerCase().includes('stress') || userText.toLowerCase().includes('worried') || userText.toLowerCase().includes('deadline')) {
        detectedMood = 'Stressed';
    } else if (userText.toLowerCase().includes('excited') || userText.toLowerCase().includes('great')) {
        detectedMood = 'Excited';
    } else if (userText.toLowerCase().includes('?')) {
        detectedMood = 'Curious';
    }
    
    // 3. Determine Response Type
    setTimeout(() => {
        let aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: '',
            moodContext: detectedMood
        };

        // Scenario A: User asks to remember something
        if (userText.toLowerCase().startsWith('remember') || userText.toLowerCase().includes('save this')) {
             const contentToSave = userText.replace(/remember|save this/gi, '').trim();
             onAddMemory('New Memory', contentToSave, 'note');
             aiResponse.content = `I've saved that to your memory graph: "${contentToSave}".`;
             aiResponse.action = 'memory_created';
        } 
        // Scenario B: Retrieval found hits
        else if (hits.length > 0) {
            aiResponse.content = `Based on your ${hits[0].type} "${hits[0].title}", here is what I found. ${hits[0].content}`;
            if (hits.length > 1) {
                aiResponse.content += ` I also found related context in "${hits[1].title}".`;
            }
            aiResponse.relatedMemories = hits.slice(0, 3);
        }
        // Scenario C: General Chat / No hits
        else {
            aiResponse.content = "I don't see a direct match in your current memory graph, but I'm listening. Should I add this as a new note?";
        }

        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);

    }, 1500); // Fake latency
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper to render icon for memory source
  const getSourceIcon = (type: string) => {
    switch (type) {
        case 'note': return <FileText size={12} className="text-yellow-400" />;
        case 'link': return <LinkIcon size={12} className="text-green-400" />;
        case 'file': return <Database size={12} className="text-red-400" />;
        case 'voice': return <Mic size={12} className="text-orange-400" />;
        case 'image': return <ImageIcon size={12} className="text-purple-400" />;
        default: return <Sparkles size={12} className="text-blue-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#020617]">
       {/* Background Grid - Faded */}
       <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>

       {/* --- Chat Area --- */}
       <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-thin z-10">
          
          {/* Welcome Placeholder if empty */}
          {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full opacity-50">
                 <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                     <Bot size={32} className="text-blue-400" />
                 </div>
                 <p className="text-slate-400">Ask your second brain anything...</p>
             </div>
          )}

          {messages.map((msg) => (
             <div key={msg.id} className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 
                 {/* AI Avatar */}
                 {msg.role === 'ai' && (
                     <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shrink-0 mt-1">
                         <Bot size={20} className="text-white" />
                     </div>
                 )}

                 <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                     
                     {/* Mood Context Badge */}
                     {msg.moodContext && (
                         <div className="text-[10px] font-bold text-orange-300 flex items-center gap-1.5 bg-orange-900/20 px-2 py-1 rounded-md border border-orange-500/20 animate-slide-up self-start">
                             <Activity size={10} />
                             Detected: {msg.moodContext}
                         </div>
                     )}

                     {/* Message Bubble */}
                     <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-md ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
                     }`}>
                         {msg.content}
                     </div>

                     {/* RAG Context: "Retrieved Memories" */}
                     {msg.relatedMemories && msg.relatedMemories.length > 0 && (
                         <div className="animate-slide-up flex flex-col gap-2 mt-1">
                             <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-2">
                                <BrainCircuit size={12} /> Retrieved Context
                             </div>
                             <div className="flex flex-wrap gap-2">
                                {msg.relatedMemories.map(mem => (
                                    <div key={mem.id} className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-indigo-900/20 border border-indigo-500/30 rounded-lg cursor-pointer hover:bg-indigo-900/40 transition-colors group">
                                        <div className="p-1 rounded bg-white/5 group-hover:bg-white/10 transition-colors">
                                           {getSourceIcon(mem.type)}
                                        </div>
                                        <span className="text-xs text-indigo-200 font-medium">{mem.title}</span>
                                        <span className="text-[10px] text-slate-500 bg-black/20 px-1.5 py-0.5 rounded ml-1">95% match</span>
                                    </div>
                                ))}
                             </div>
                         </div>
                     )}

                     {/* Action Feedback: Memory Update */}
                     {msg.action === 'memory_created' && (
                         <div className="animate-slide-up flex items-center gap-2 mt-1 text-xs text-green-400 bg-green-900/10 px-3 py-1.5 rounded-full border border-green-500/20">
                             <CheckCircle2 size={12} />
                             <span>Memory Graph Updated</span>
                         </div>
                     )}
                 </div>

                 {/* User Avatar */}
                 {msg.role === 'user' && (
                     <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg shrink-0 mt-1 border border-white/10">
                         <div className="font-bold text-sm text-slate-300">ME</div>
                     </div>
                 )}
             </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 max-w-3xl mx-auto">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
                     <Sparkles size={18} className="text-white animate-spin-slow" />
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-bl-none flex items-center gap-2 h-12">
                   <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                   <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                   <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
       </div>

       {/* --- Input Area --- */}
       <div className="p-6 pt-2 z-20">
          <div className="max-w-3xl mx-auto relative glass-thick rounded-2xl shadow-2xl p-2 flex items-end gap-2 ring-1 ring-white/10 focus-within:ring-blue-500/50 transition-all">
             
             <button className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                <Paperclip size={20} />
             </button>
             
             <textarea 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your memory or tell me something to remember..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 resize-none py-3 max-h-32 min-h-[48px] text-sm"
                rows={1}
             />
             
             {inputValue.trim() ? (
                 <button 
                    onClick={handleSendMessage}
                    className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
                 >
                    <Send size={18} fill="currentColor" />
                 </button>
             ) : (
                 <button className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                    <Mic size={20} />
                 </button>
             )}
          </div>
          <div className="text-center mt-3 text-[10px] text-slate-500">
             MemoRoo AI can make mistakes. Please verify important information.
          </div>
       </div>

    </div>
  );
};

export default ChatInterface;
