
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Bot, 
  ChevronLeft, 
  Plus, 
  Sparkles, 
  Search, 
  BrainCircuit, 
  MoreHorizontal, 
  Mic, 
  FileText, 
  Link as LinkIcon, 
  X,
  Database,
  Layers,
  Zap,
  LayoutGrid,
  Shuffle,
  Trash2,
  Image as ImageIcon,
  UploadCloud,
  Globe,
  PanelRightClose,
  PanelRightOpen,
  MessageSquare,
  Network,
  Heart
} from 'lucide-react';
import ChatInterface from './ChatInterface';
import MemoryGraphExplorer from './MemoryGraphExplorer';
import LifeDashboard from './LifeDashboard';

interface DashboardProps {
  onBack: () => void;
}

type CardType = 'note' | 'link' | 'file' | 'voice' | 'image';

interface CardData {
  id: string;
  type: CardType;
  title: string;
  content: string;
  url?: string;
  fileName?: string;
  x: number;
  y: number;
  confidence: number;
  vectorId?: string;
  tags: string[];
}

interface Connection {
  from: string;
  to: string;
  label: string;
  strength: number; // 0-1
}

// Demo Initial State
const INITIAL_CARDS: CardData[] = [
  {
    id: 'c1',
    type: 'voice',
    title: 'User Interview #4',
    content: 'User mentioned they struggle to organize random screenshots and voice notes into a coherent structure.',
    x: 100,
    y: 150,
    confidence: 0.95,
    vectorId: 'vec_892',
    tags: ['Research', 'Pain Point']
  },
  {
    id: 'c2',
    type: 'link',
    title: 'Competitor Analysis',
    content: 'Direct competitor offering linear timeline view, lacking spatial organization.',
    url: 'https://competitor.io/features',
    x: 450,
    y: 100,
    confidence: 0.88,
    vectorId: 'vec_104',
    tags: ['Market', 'Strategy']
  },
  {
    id: 'c3',
    type: 'image',
    title: 'Wireframe_v1.png',
    content: 'Initial exploration of the infinite canvas UI with floating cards.',
    fileName: 'wireframe_v1.png',
    x: 800,
    y: 180,
    confidence: 0.75,
    vectorId: 'vec_331',
    tags: ['Design', 'UX']
  },
  {
    id: 'c4',
    type: 'note',
    title: 'Tech Constraints',
    content: 'Need to use WebGL or optimized DOM for 100+ cards. React Flow might be too heavy.',
    x: 200,
    y: 450,
    confidence: 0.92,
    vectorId: 'vec_552',
    tags: ['Engineering', 'Performance']
  },
  {
    id: 'c5',
    type: 'file',
    title: 'Q3_Goals.pdf',
    content: 'Extracted: "Primary goal is to launch the spatial reasoning engine by Q3."',
    fileName: 'Q3_Goals.pdf',
    x: 600,
    y: 450,
    confidence: 0.82,
    vectorId: 'vec_420',
    tags: ['Strategy', 'OKRs']
  }
];

const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
  // View State: canvas | chat | graph | life
  const [viewMode, setViewMode] = useState<'canvas' | 'chat' | 'graph' | 'life'>('canvas');

  // Shared Data State
  const [cards, setCards] = useState<CardData[]>(INITIAL_CARDS);
  const [connections, setConnections] = useState<Connection[]>([]);
  
  // Canvas Specific State
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [addItemType, setAddItemType] = useState<CardType>('note');
  const [showSidebar, setShowSidebar] = useState(true);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemContent, setNewItemContent] = useState('');
  
  // Dragging Logic
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Logic: Add Items (Shared) ---
  const handleAddMemory = (title: string, content: string, type: CardType) => {
    const containerW = containerRef.current?.clientWidth || window.innerWidth;
    const containerH = containerRef.current?.clientHeight || window.innerHeight;

    const newCard: CardData = {
      id: `c_${Date.now()}`,
      type: type,
      title: title,
      content: content || 'No additional details provided.',
      x: (containerW / 2) - 150 + (Math.random() * 50 - 25), 
      y: (containerH / 2) - 100 + (Math.random() * 50 - 25),
      confidence: 0.6 + Math.random() * 0.4,
      vectorId: `vec_${Math.floor(Math.random() * 9999)}`,
      tags: ['New', 'Chat Created'],
    };

    setCards(prev => [...prev, newCard]);
  };

  const createCardFromModal = () => {
    if (!newItemTitle) return;
    handleAddMemory(newItemTitle, newItemContent, addItemType);
    if (addItemType === 'link') {
       // Just a hack to add URL property for demo
       setCards(prev => {
          const last = prev[prev.length - 1];
          last.url = newItemContent;
          return [...prev.slice(0, -1), last];
       });
    }
    setNewItemTitle('');
    setNewItemContent('');
    setShowAddItem(false);
  };

  // --- Canvas Actions ---

  const handleMouseDown = (e: React.MouseEvent, card: CardData) => {
    e.stopPropagation();
    setDraggingId(card.id);
    setSelectedCardId(card.id);
    setOffset({
      x: e.clientX - card.x,
      y: e.clientY - card.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;
    
    setCards(prev => prev.map(c => 
      c.id === draggingId ? { ...c, x: newX, y: newY } : c
    ));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const handleRemoveCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
    setConnections(connections.filter(c => c.from !== id && c.to !== id));
    if (selectedCardId === id) setSelectedCardId(null);
  };

  // --- Logic: Reorganize (Smart Layout) ---
  const handleReorganize = () => {
    const containerW = containerRef.current?.clientWidth || window.innerWidth;
    const containerH = containerRef.current?.clientHeight || window.innerHeight;
    
    const typeGroups: Record<string, CardData[]> = {};
    cards.forEach(c => {
      if (!typeGroups[c.type]) typeGroups[c.type] = [];
      typeGroups[c.type].push(c);
    });

    const types = Object.keys(typeGroups);
    const centerX = containerW / 2 - 140; 
    const centerY = containerH / 2 - 100;
    const radius = Math.min(containerW, containerH) * 0.25;

    let newCards = [...cards];
    
    types.forEach((type, typeIdx) => {
      const angle = (typeIdx / types.length) * 2 * Math.PI;
      const groupCenterX = centerX + Math.cos(angle) * radius;
      const groupCenterY = centerY + Math.sin(angle) * radius;
      
      const groupCards = typeGroups[type];
      groupCards.forEach((card, cardIdx) => {
        const cardNewX = groupCenterX + (cardIdx % 2 === 0 ? 30 : -30) * Math.ceil(cardIdx/2);
        const cardNewY = groupCenterY + (cardIdx * 40) - (groupCards.length * 20);
        
        const index = newCards.findIndex(c => c.id === card.id);
        if (index !== -1) {
            newCards[index] = { ...newCards[index], x: cardNewX, y: cardNewY };
        }
      });
    });

    setCards(newCards);
  };

  // --- Logic: Shuffle ---
  const handleShuffle = () => {
    const containerW = containerRef.current?.clientWidth || window.innerWidth;
    const containerH = containerRef.current?.clientHeight || window.innerHeight;
    
    setCards(prev => prev.map(c => ({
      ...c,
      x: 50 + Math.random() * (containerW - 350),
      y: 50 + Math.random() * (containerH - 250)
    })));
  };

  // --- Logic: Synthesize (Create Connections) ---
  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setConnections([]);

    setTimeout(() => {
        const newConnections: Connection[] = [];
        
        const research = cards.find(c => c.type === 'voice' || c.tags.includes('Research'));
        const design = cards.find(c => c.type === 'image' || c.tags.includes('Design'));
        
        if (research && design) {
           newConnections.push({ from: research.id, to: design.id, label: 'Informs', strength: 0.9 });
        }

        const tech = cards.find(c => c.type === 'note' && c.tags.includes('Engineering'));
        const file = cards.find(c => c.type === 'file');
        
        if (tech && file) {
            newConnections.push({ from: tech.id, to: file.id, label: 'Constraints', strength: 0.7 });
        }

        const link = cards.find(c => c.type === 'link');
        if (link && research) {
            newConnections.push({ from: link.id, to: research.id, label: 'Market Data', strength: 0.8 });
        }

        setConnections(newConnections);
        setIsSynthesizing(false);
        handleReorganize();

    }, 1500);
  };

  // Helper for Styles
  const getCardStyle = (type: CardType) => {
    switch (type) {
      case 'note': return 'border-yellow-500/30 bg-yellow-500/10 shadow-[0_10px_30px_rgba(234,179,8,0.1)]';
      case 'link': return 'border-green-500/30 bg-green-500/10 shadow-[0_10px_30px_rgba(34,197,94,0.1)]';
      case 'file': return 'border-red-500/30 bg-red-500/10 shadow-[0_10px_30px_rgba(239,68,68,0.1)]';
      case 'voice': return 'border-orange-500/30 bg-orange-500/10 shadow-[0_10px_30px_rgba(249,115,22,0.1)]';
      case 'image': return 'border-purple-500/30 bg-purple-500/10 shadow-[0_10px_30px_rgba(168,85,247,0.1)]';
      default: return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  const getIcon = (type: CardType) => {
      switch (type) {
        case 'note': return <FileText size={16} className="text-yellow-400" />;
        case 'link': return <Globe size={16} className="text-green-400" />;
        case 'file': return <Database size={16} className="text-red-400" />;
        case 'voice': return <Mic size={16} className="text-orange-400" />;
        case 'image': return <ImageIcon size={16} className="text-purple-400" />;
      }
  };

  // Render Logic
  return (
    <div 
      className="fixed inset-0 bg-[#020617] text-white overflow-hidden flex flex-col z-50 font-sans selection:bg-blue-500/30"
      onMouseMove={viewMode === 'canvas' ? handleMouseMove : undefined}
      onMouseUp={viewMode === 'canvas' ? handleMouseUp : undefined}
    >
       {/* --- Header / Toolbar --- */}
       <header className="h-16 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md flex items-center justify-between px-6 z-50 relative shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                <ChevronLeft size={20} className="text-slate-400 group-hover:text-white transition-colors" />
             </button>
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg">
                   <Bot size={18} className="text-white" />
                </div>
                <div className="hidden md:block">
                    <div className="font-display font-bold text-sm leading-none mb-0.5">My Second Brain</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                       Thinking Environment
                    </div>
                </div>
             </div>
          </div>

          {/* Center: View Switcher */}
          <div className="absolute left-1/2 -translate-x-1/2 flex bg-white/5 p-1 rounded-full border border-white/10 overflow-x-auto max-w-[280px] md:max-w-none">
              <button 
                onClick={() => setViewMode('canvas')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'canvas' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                  <LayoutGrid size={14} /> <span className="hidden sm:inline">Canvas</span>
              </button>
              <button 
                onClick={() => setViewMode('chat')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'chat' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                  <MessageSquare size={14} /> <span className="hidden sm:inline">Chat</span>
              </button>
              <button 
                onClick={() => setViewMode('graph')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'graph' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                  <Network size={14} /> <span className="hidden sm:inline">Graph</span>
              </button>
              <button 
                onClick={() => setViewMode('life')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'life' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                  <Heart size={14} /> <span className="hidden sm:inline">Life</span>
              </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
              {viewMode === 'canvas' && (
                <>
                 <button 
                    onClick={() => setShowAddItem(true)} 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition-colors text-slate-300 hover:text-white"
                 >
                    <Plus size={14} /> <span className="hidden sm:inline">Add</span>
                 </button>
                 
                 <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block"></div>
                 
                 <div className="hidden sm:flex gap-1">
                    <button onClick={handleReorganize} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors tooltip" title="Smart Grouping">
                        <LayoutGrid size={18} />
                    </button>
                    <button onClick={handleShuffle} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors tooltip" title="Shuffle Canvas">
                        <Shuffle size={18} />
                    </button>
                 </div>
                 
                 <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block"></div>

                 <button 
                   onClick={handleSynthesize} 
                   disabled={isSynthesizing}
                   className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all ${isSynthesizing ? 'opacity-80' : ''}`}
                 >
                    <Sparkles size={14} className={isSynthesizing ? 'animate-spin' : ''} /> 
                    {isSynthesizing ? <span className="hidden sm:inline">Reasoning...</span> : <span className="hidden sm:inline">Synthesize</span>}
                 </button>
                 
                 <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block"></div>

                 <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className={`w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center transition-all ${
                        showSidebar 
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/30' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    {showSidebar ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
                </button>
                </>
              )}
              {viewMode === 'chat' && (
                 <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-bold text-blue-300 flex items-center gap-2">
                    <Sparkles size={12} /> AI Model v2.5
                 </div>
              )}
               {viewMode === 'graph' && (
                 <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-bold text-purple-300 flex items-center gap-2">
                    <Network size={12} /> Graph Explorer
                 </div>
              )}
              {viewMode === 'life' && (
                 <div className="px-3 py-1.5 bg-pink-500/10 border border-pink-500/20 rounded-full text-xs font-bold text-pink-300 flex items-center gap-2">
                    <Heart size={12} /> Life Dashboard
                 </div>
              )}
          </div>
       </header>

       {/* --- Main Workspace Switcher --- */}
       <div className="flex-1 flex relative overflow-hidden">
          
          {viewMode === 'canvas' ? (
             <>
                {/* --- Canvas Area --- */}
                <div className="flex-1 relative bg-[#020617] overflow-hidden transition-all duration-300" ref={containerRef}>
                    <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
                    
                    {/* Connections Layer (SVG) */}
                    <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
                        <defs>
                            <linearGradient id="gradientLink" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.4" />
                            </linearGradient>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" fillOpacity="0.5" />
                            </marker>
                        </defs>
                        {connections.map((conn, idx) => {
                            const fromCard = cards.find(c => c.id === conn.from);
                            const toCard = cards.find(c => c.id === conn.to);
                            if (!fromCard || !toCard) return null;

                            // Simple curve calculation
                            const startX = fromCard.x + 144; // center of w-72 (288px)
                            const startY = fromCard.y + 80;  // rough center vertically
                            const endX = toCard.x + 144;
                            const endY = toCard.y + 80;

                            // Control point for curve
                            const midX = (startX + endX) / 2;
                            const midY = (startY + endY) / 2 - 50; 

                            return (
                              <g key={`${conn.from}-${conn.to}`}>
                                <path 
                                  d={`M${startX},${startY} Q${midX},${midY} ${endX},${endY}`} 
                                  stroke="url(#gradientLink)" 
                                  strokeWidth="3" 
                                  fill="none" 
                                  className="animate-draw"
                                  markerEnd="url(#arrowhead)"
                                />
                                <foreignObject x={(startX + endX)/2 - 40} y={(startY + endY)/2 - 30} width="80" height="30">
                                    <div className="bg-[#020617]/80 backdrop-blur text-[10px] text-indigo-300 text-center rounded-full border border-indigo-500/30 px-2 py-0.5">
                                      {conn.label}
                                    </div>
                                </foreignObject>
                              </g>
                            );
                        })}
                    </svg>

                    {/* Cards Render */}
                    {cards.map(card => (
                        <div
                          key={card.id}
                          onMouseDown={(e) => handleMouseDown(e, card)}
                          style={{ 
                              left: card.x, 
                              top: card.y,
                              cursor: draggingId === card.id ? 'grabbing' : 'grab',
                              zIndex: draggingId === card.id || selectedCardId === card.id ? 20 : 10
                          }}
                          className={`absolute w-72 p-5 rounded-[1.5rem] border backdrop-blur-xl transition-shadow group ${getCardStyle(card.type)} ${selectedCardId === card.id ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#020617] scale-105 shadow-2xl' : 'hover:scale-105'}`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 rounded-lg bg-white/10 shadow-inner">
                                      {getIcon(card.type)}
                                  </div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{card.type}</span>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      className="p-1 text-slate-400 hover:text-red-400 transition-colors rounded-full hover:bg-white/10"
                                      onClick={(e) => { e.stopPropagation(); handleRemoveCard(card.id); }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            
                            <h3 className="font-display font-bold text-lg leading-tight mb-2 text-white/90">{card.title}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed font-medium line-clamp-3">{card.content}</p>
                            
                            {card.url && (
                              <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-300 bg-blue-500/10 p-1.5 rounded-lg border border-blue-500/20 max-w-full overflow-hidden">
                                <LinkIcon size={12} />
                                <span className="truncate">{new URL(card.url).hostname}</span>
                              </div>
                            )}
                            {card.fileName && (
                              <div className="mt-2 flex items-center gap-1.5 text-xs text-red-300 bg-red-500/10 p-1.5 rounded-lg border border-red-500/20">
                                <FileText size={12} />
                                <span className="truncate">{card.fileName}</span>
                              </div>
                            )}

                            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                                <div className="flex gap-1">
                                  {card.tags.map((tag, i) => (
                                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5">{tag}</span>
                                  ))}
                                </div>
                                {card.confidence && (
                                  <div className="flex items-center gap-1 text-[10px] font-bold text-green-400">
                                    <Zap size={10} fill="currentColor" />
                                    {Math.round(card.confidence * 100)}%
                                  </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- Right AI Sidebar (Canvas Mode) --- */}
                <div className={`border-l border-white/5 bg-[#020617]/95 backdrop-blur-md z-40 flex flex-col shadow-2xl transition-all duration-300 ease-in-out ${showSidebar ? 'w-[360px] translate-x-0' : 'w-0 translate-x-full border-none'}`}>
                    <div className="w-[360px] flex flex-col h-full"> 
                      <div className="p-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent flex justify-between items-start">
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <Sparkles size={16} className="text-blue-400" />
                                  <h2 className="font-display font-bold text-lg">AI Reasoning</h2>
                              </div>
                              <p className="text-xs text-slate-400">Contextual analysis engine v2.0</p>
                          </div>
                          <button onClick={() => setShowSidebar(false)} className="text-slate-500 hover:text-white transition-colors">
                              <PanelRightClose size={18} />
                          </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
                          
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-900/20 border border-blue-500/30">
                              <div className={`w-2 h-2 rounded-full ${isSynthesizing ? 'bg-yellow-400 animate-ping' : 'bg-green-400'}`}></div>
                              <span className="text-xs font-mono text-blue-200">
                                {isSynthesizing ? 'PROCESSING_GRAPH...' : 'SYSTEM_IDLE'}
                              </span>
                          </div>

                          <div>
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Active Synthesis</h3>
                              
                              {connections.length > 0 ? (
                                <div className="space-y-3 animate-slide-up">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                                        <div className="flex items-center gap-2 mb-2">
                                          <BrainCircuit size={16} className="text-indigo-400" />
                                          <span className="text-sm font-bold text-white">Pattern Detected</span>
                                        </div>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                          Strong correlation between <span className="text-orange-300">User Research</span> pain points and <span className="text-purple-300">Design Wireframes</span>. Suggested action: Validate wireframe v1 against user voice notes.
                                        </p>
                                    </div>
                                    
                                    {connections.map((c, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300">
                                          <span>Node Link #{i+1}</span>
                                          <span className="text-blue-400 font-mono">{Math.round(c.strength * 100)}% Str</span>
                                        </div>
                                    ))}
                                </div>
                              ) : (
                                <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl">
                                    <Layers size={24} className="text-slate-600 mx-auto mb-2" />
                                    <p className="text-xs text-slate-500">Add nodes and click Synthesize<br/>to reveal hidden connections.</p>
                                </div>
                              )}
                          </div>

                          <div>
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Semantic Clusters</h3>
                              <div className="flex flex-wrap gap-2">
                                {Array.from(new Set(cards.flatMap(c => c.tags))).map(tag => (
                                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] text-slate-300 cursor-pointer transition-colors">
                                        #{tag}
                                    </span>
                                ))}
                              </div>
                          </div>

                      </div>
                    </div>
                </div>
             </>
          ) : viewMode === 'chat' ? (
             /* --- Chat Mode --- */
             <ChatInterface memories={cards} onAddMemory={handleAddMemory} />
          ) : viewMode === 'graph' ? (
             /* --- Graph Mode --- */
             <MemoryGraphExplorer />
          ) : (
             /* --- Life Dashboard --- */
             <LifeDashboard />
          )}

       </div>

       {/* --- ADD ITEM OVERLAY --- */}
       {showAddItem && (
         <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] glass-thick rounded-3xl p-6 z-50 animate-pop-in shadow-[0_0_100px_rgba(0,0,0,0.5)]">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="font-display font-bold text-lg text-white">Add to Memory</h3>
                 <button onClick={() => setShowAddItem(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X size={18} /></button>
             </div>

             <div className="flex gap-2 mb-6 p-1 bg-black/40 rounded-xl">
                 {(['note', 'link', 'file'] as const).map(type => (
                     <button
                       key={type}
                       onClick={() => setAddItemType(type)}
                       className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize flex items-center justify-center gap-2 transition-all ${addItemType === type ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                     >
                        {type === 'note' && <FileText size={14} />}
                        {type === 'link' && <LinkIcon size={14} />}
                        {type === 'file' && <UploadCloud size={14} />}
                        {type}
                     </button>
                 ))}
             </div>

             <div className="space-y-4">
                 <div>
                    <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Title / Name</label>
                    <input 
                      type="text" 
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      placeholder={addItemType === 'link' ? "e.g. Article Name" : "e.g. Project Specs"}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      autoFocus
                    />
                 </div>

                 {addItemType === 'note' && (
                     <div>
                        <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Content</label>
                        <textarea 
                          value={newItemContent}
                          onChange={(e) => setNewItemContent(e.target.value)}
                          placeholder="Type your thought..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors h-24 resize-none"
                        />
                     </div>
                 )}

                 {addItemType === 'link' && (
                     <div>
                        <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">URL</label>
                        <input 
                          type="text" 
                          value={newItemContent}
                          onChange={(e) => setNewItemContent(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                     </div>
                 )}
                 
                 {addItemType === 'file' && (
                     <div className="h-24 rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
                        <UploadCloud size={24} />
                        <span className="text-xs">Drag & Drop or Click to Upload</span>
                     </div>
                 )}

                 <button 
                   onClick={createCardFromModal}
                   className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 mt-2 flex items-center justify-center gap-2"
                 >
                    <Plus size={16} /> Add Node
                 </button>
             </div>
         </div>
       )}

    </div>
  );
};

export default Dashboard;
