
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  X, 
  Sparkles, 
  Rocket, 
  Filter, 
  MousePointer2, 
  Edit2, 
  Trash2, 
  Save, 
  Focus, 
  Share2,
  Activity,
  Zap,
  Maximize,
  Minimize,
  ChevronRight,
  Database,
  Search
} from 'lucide-react';

// --- Types ---
type NodeType = 'source' | 'chunk' | 'inferred' | 'root';

interface Node3D {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  connections: string[];
  meta: {
    confidence: number;
    tags: string[];
    description: string;
  };
  // Animation offsets
  phase: number; 
}

interface ProjectedNode extends Node3D {
  sx: number;
  sy: number;
  scale: number;
  zIndex: number;
  opacity: number;
  isVisible: boolean;
}

interface GraphExplorerProps {
  onClose?: () => void;
}

// --- Constants ---
const PERSPECTIVE = 1000;
const INITIAL_Z_OFFSET = 600;
const NODE_COLORS = {
  source: '#06b6d4',   // Cyan-500
  chunk: '#f97316',    // Orange-500
  inferred: '#ec4899', // Pink-500
  root: '#8b5cf6'      // Violet-500
};

const MemoryGraphExplorer: React.FC<GraphExplorerProps> = ({ onClose }) => {
  // --- State ---
  const [nodes, setNodes] = useState<Node3D[]>([]);
  
  // Camera State
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [viewMode, setViewMode] = useState<'orbit' | 'focused'>('orbit');
  
  // Interaction State
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [filterThreshold, setFilterThreshold] = useState(0);
  
  // Feature State
  const [isSparking, setIsSparking] = useState(false);
  const [sparkMessage, setSparkMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState('');

  // Refs for Physics/Animation
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const targetCamera = useRef({ x: 0, y: 0, zoom: 1 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  // --- 1. Initialization (Big Bang) ---
  useEffect(() => {
    const initGraph = () => {
      const newNodes: Node3D[] = [];
      
      // 1. Root Core
      newNodes.push({
        id: 'root',
        type: 'root',
        label: 'CORE MEMORY',
        x: 0, y: 0, z: 0,
        color: NODE_COLORS.root,
        size: 40,
        connections: [],
        meta: { confidence: 100, tags: ['System', 'Kernel'], description: 'Central storage unit for all memories.' },
        phase: 0
      });

      // 2. Spread out Clusters (Galaxies)
      const clusters = [
        { l: 'Research', desc: 'User interviews and market data' },
        { l: 'Engineering', desc: 'Backend infrastructure logs' },
        { l: 'Design', desc: 'UI/UX Wireframes and assets' },
        { l: 'Strategy', desc: 'Q3 Goals and OKRs' },
        { l: 'Personal', desc: 'Private notes and journal' }
      ];

      const galaxyRadius = 500; // Increased spacing

      clusters.forEach((cluster, i) => {
         // Distribute evenly on sphere
         const phi = Math.acos(-1 + (2 * i) / clusters.length);
         const theta = Math.sqrt(clusters.length * Math.PI) * phi;

         const cx = galaxyRadius * Math.cos(theta) * Math.sin(phi);
         const cy = galaxyRadius * Math.sin(theta) * Math.sin(phi);
         const cz = galaxyRadius * Math.cos(phi);

         const clusterId = `c_${i}`;
         newNodes.push({
            id: clusterId,
            type: 'source',
            label: cluster.l.toUpperCase(),
            x: cx, y: cy, z: cz,
            color: NODE_COLORS.source,
            size: 24,
            connections: ['root'],
            meta: { confidence: 90, tags: ['Cluster', cluster.l], description: cluster.desc },
            phase: Math.random() * Math.PI
         });

         // 3. Satellites (Chunks)
         // Reduce count, increase spread
         const satelliteCount = 5; 
         for(let j=0; j < satelliteCount; j++) {
            const r = 120 + Math.random() * 80; // Distance from cluster center
            const sTheta = Math.random() * Math.PI * 2;
            const sPhi = Math.random() * Math.PI;

            const sx = cx + r * Math.sin(sPhi) * Math.cos(sTheta);
            const sy = cy + r * Math.sin(sPhi) * Math.sin(sTheta);
            const sz = cz + r * Math.cos(sPhi);

            const isInferred = Math.random() > 0.7;
            const nodeId = `n_${i}_${j}`;

            newNodes.push({
                id: nodeId,
                type: isInferred ? 'inferred' : 'chunk',
                label: `${cluster.l} Node ${j+1}`,
                x: sx, y: sy, z: sz,
                color: isInferred ? NODE_COLORS.inferred : NODE_COLORS.chunk,
                size: isInferred ? 10 : 6,
                connections: [clusterId],
                meta: { 
                  confidence: 40 + Math.floor(Math.random() * 60), 
                  tags: [isInferred ? 'Insight' : 'Data'],
                  description: isInferred ? 'AI derived connection based on usage patterns.' : 'Raw data block ingested from source.'
                },
                phase: Math.random() * Math.PI
            });
         }
      });

      // 4. Random Cross-Links (Wormholes)
      for(let i=0; i<8; i++) {
         const n1 = newNodes[Math.floor(Math.random() * newNodes.length)];
         const n2 = newNodes[Math.floor(Math.random() * newNodes.length)];
         if(n1.id !== n2.id && n1.type !== 'root' && n2.type !== 'root') {
            if(!n1.connections.includes(n2.id)) n1.connections.push(n2.id);
         }
      }

      setNodes(newNodes);
    };

    initGraph();
  }, []);


  // --- 2. Animation Loop (The Engine) ---
  const animate = useCallback(() => {
     timeRef.current += 0.01;

     // Smooth Camera Lerp
     setCamera(prev => ({
        x: prev.x + (targetCamera.current.x - prev.x) * 0.08,
        y: prev.y + (targetCamera.current.y - prev.y) * 0.08,
        zoom: prev.zoom + (targetCamera.current.zoom - prev.zoom) * 0.08
     }));

     requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
     requestRef.current = requestAnimationFrame(animate);
     return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);


  // --- 3. Projection Logic ---
  const projectedNodes: ProjectedNode[] = useMemo(() => {
    if (!containerRef.current) return [];
    const { width, height } = containerRef.current.getBoundingClientRect();
    const cx = width / 2;
    const cy = height / 2;

    return nodes.map(node => {
       // 1. Floating Animation
       const floatY = Math.sin(timeRef.current + node.phase) * 10;
       
       // 2. Camera Rotation Matrix
       const radX = camera.x;
       const radY = camera.y;

       // Rotate Y
       let x1 = node.x * Math.cos(radY) - node.z * Math.sin(radY);
       let z1 = node.z * Math.cos(radY) + node.x * Math.sin(radY);

       // Rotate X
       let y2 = (node.y + floatY) * Math.cos(radX) - z1 * Math.sin(radX);
       let z2 = z1 * Math.cos(radX) + (node.y + floatY) * Math.sin(radX);

       // 3. Apply Camera Zoom & Perspective
       let zFinal = z2 + INITIAL_Z_OFFSET * (1/camera.zoom);
       
       const isVisible = zFinal > 50; // Clipping plane
       const scale = PERSPECTIVE / Math.max(50, zFinal);
       
       const sx = cx + x1 * scale;
       const sy = cy + y2 * scale;

       return {
          ...node,
          sx, sy, scale,
          zIndex: Math.floor(10000 - zFinal),
          opacity: Math.max(0, Math.min(1, scale * 1.5)), // Distance fade
          isVisible
       };
    }).sort((a, b) => a.zIndex - b.zIndex);
  }, [nodes, camera, timeRef.current]); // Re-calc on every frame roughly (optimized by React batching mostly, but for 60fps might need canvas. HTML is fine for < 100 nodes)


  // --- 4. Interactions ---

  const handleMouseDown = (e: React.MouseEvent) => {
     if (viewMode === 'focused') return;
     isDragging.current = true;
     lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
     if (!isDragging.current || viewMode === 'focused') return;
     const dx = e.clientX - lastMousePos.current.x;
     const dy = e.clientY - lastMousePos.current.y;
     
     targetCamera.current.y += dx * 0.003;
     targetCamera.current.x -= dy * 0.003;

     lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
     isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
     if (viewMode === 'focused') return;
     e.stopPropagation();
     const delta = -e.deltaY * 0.001;
     targetCamera.current.zoom = Math.max(0.2, Math.min(3, targetCamera.current.zoom + delta));
  };

  // --- FOCUS MODE LOGIC ---
  const handleNodeClick = (node: Node3D) => {
     if (viewMode === 'focused' && node.id === focusedNodeId) return;
     enterFocusMode(node);
  };

  const enterFocusMode = (node: Node3D) => {
     setFocusedNodeId(node.id);
     setViewMode('focused');
     setEditLabel(node.label);
     setSparkMessage(null);
     
     // Calculate rotation to face the node
     // We want node at (0,0, z) relative to camera
     // Simply: Rotate world opposite to node position
     const r = Math.sqrt(node.x*node.x + node.z*node.z);
     const theta = Math.atan2(node.x, node.z); // Y rotation
     const phi = Math.atan2(node.y, r); // X rotation

     targetCamera.current = {
        x: phi, // Tilt to node Y
        y: theta, // Pan to node X/Z
        zoom: 2.5 // Zoom in tight
     };
  };

  const exitFocusMode = () => {
     setViewMode('orbit');
     setFocusedNodeId(null);
     targetCamera.current = {
        x: 0,
        y: 0, 
        zoom: 1
     };
  };

  const warpToConnection = (targetId: string) => {
      const target = nodes.find(n => n.id === targetId);
      if(target) enterFocusMode(target);
  };

  // Feature Logic
  const handleIgniteSpark = () => {
     setIsSparking(true);
     setTimeout(() => {
        setSparkMessage("Analysis complete: 3 hidden correlations found with 'Strategy' cluster.");
        setIsSparking(false);
     }, 1500);
  };

  const handleSaveEdit = () => {
     if (focusedNodeId) {
        setNodes(prev => prev.map(n => n.id === focusedNodeId ? { ...n, label: editLabel } : n));
        setIsEditing(false);
     }
  };

  const focusedNode = useMemo(() => nodes.find(n => n.id === focusedNodeId), [focusedNodeId, nodes]);

  // --- RENDER ---
  return (
    <div 
      className="absolute inset-0 bg-[#020617] z-50 overflow-hidden font-mono select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      ref={containerRef}
    >
       {/* --- STARFIELD BACKGROUND --- */}
       <div className={`absolute inset-0 transition-opacity duration-1000 ${viewMode === 'focused' ? 'opacity-30' : 'opacity-100'}`}>
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#020617_100%)]"></div>
           {/* Stars */}
           <div className="absolute inset-0 opacity-40" style={{ 
               backgroundImage: 'radial-gradient(white 1.5px, transparent 1.5px)', 
               backgroundSize: '60px 60px',
               transform: `translate(${camera.y * 50}px, ${camera.x * 50}px)` // Parallax
           }}></div>
           {/* Grid Floor */}
           <div className="absolute top-[50%] left-[-50%] right-[-50%] bottom-[-50%] bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:100px_100px] [transform:perspective(500px)_rotateX(70deg)] opacity-20 pointer-events-none"></div>
       </div>

       {/* --- 3D SCENE --- */}
       <div className={`absolute inset-0 transition-all duration-700 ${viewMode === 'focused' ? 'blur-sm scale-105 opacity-60' : 'blur-0 scale-100 opacity-100'}`}>
           <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
               {projectedNodes.map(node => {
                  if (!node.isVisible) return null;
                  return node.connections.map(targetId => {
                     const target = projectedNodes.find(n => n.id === targetId);
                     if (!target || !target.isVisible) return null;
                     
                     // Opacity based on Z
                     const opacity = Math.min(node.opacity, target.opacity) * 0.3;
                     if (opacity < 0.05) return null;

                     return (
                        <line 
                           key={`${node.id}-${target.id}`}
                           x1={node.sx} y1={node.sy}
                           x2={target.sx} y2={target.sy}
                           stroke={node.type === 'root' ? NODE_COLORS.root : NODE_COLORS.source}
                           strokeWidth={1}
                           strokeOpacity={opacity}
                        />
                     )
                  });
               })}
           </svg>

           {projectedNodes.map(node => {
               if (!node.isVisible || node.meta.confidence < filterThreshold) return null;
               
               const isHovered = hoveredNodeId === node.id;
               const isFocused = focusedNodeId === node.id;
               
               // In focus mode, hide everything except the focused node (or ghost them)
               // Actually we blur the whole container, so we render normally here
               
               const size = node.size * node.scale * (isHovered ? 1.3 : 1);
               
               return (
                  <div
                    key={node.id}
                    className="absolute flex items-center justify-center cursor-pointer transition-transform duration-200"
                    style={{
                       left: node.sx,
                       top: node.sy,
                       width: size,
                       height: size,
                       transform: 'translate(-50%, -50%)',
                       zIndex: node.zIndex,
                       opacity: node.opacity
                    }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={(e) => { e.stopPropagation(); handleNodeClick(node); }}
                  >
                      {/* Glow */}
                      <div 
                        className={`absolute inset-0 rounded-full blur-md opacity-60 ${isFocused ? 'animate-ping' : ''}`}
                        style={{ backgroundColor: node.color }} 
                      />
                      
                      {/* Body */}
                      <div 
                        className={`relative w-full h-full rounded-full shadow-inner border border-white/20`}
                        style={{ backgroundColor: node.color }}
                      ></div>
                      
                      {/* Label - Show on Hover or High Scale */}
                      {(isHovered || node.scale > 0.6) && (
                          <div 
                             className="absolute top-full mt-2 px-2 py-1 bg-black/60 backdrop-blur rounded border border-white/10 text-white whitespace-nowrap z-50 pointer-events-none"
                             style={{ fontSize: Math.max(9, 12 * node.scale) + 'px' }}
                          >
                             <span className="font-bold drop-shadow-md">{node.label}</span>
                          </div>
                      )}
                  </div>
               );
           })}
       </div>


       {/* --- VIEW 1: ORBIT HUD (Standard) --- */}
       <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${viewMode === 'orbit' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
           
           {/* Top Right Stats */}
           <div className="absolute top-6 right-6 w-64 glass-thick rounded-xl p-4 border-r-4 border-r-cyan-500 bg-[#020617]/80 pointer-events-auto">
               <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                  <Activity size={14} className="text-cyan-400" />
                  <span className="text-xs font-bold text-cyan-400 tracking-widest">SYSTEM STATUS</span>
               </div>
               <div className="flex justify-between items-end mb-2">
                   <div className="text-[10px] text-slate-400 uppercase">Memory Nodes</div>
                   <div className="text-xl font-bold text-white font-mono">{nodes.length}</div>
               </div>
               <div className="flex justify-between items-end">
                   <div className="text-[10px] text-slate-400 uppercase">Active Clusters</div>
                   <div className="text-xl font-bold text-cyan-200 font-mono">5</div>
               </div>
           </div>

           {/* Bottom Left Filter */}
           <div className="absolute bottom-6 left-6 w-80 glass-thick rounded-xl p-4 border-l-4 border-l-pink-500 bg-[#020617]/80 pointer-events-auto">
               <div className="flex justify-between items-center mb-4">
                   <h4 className="text-xs font-bold text-pink-400 flex items-center gap-2">
                       <Filter size={12} /> STAR FILTER
                   </h4>
                   <span className="text-[9px] font-mono text-pink-300/70">{filterThreshold}% CONFIDENCE</span>
               </div>
               <input 
                  type="range" min="0" max="100" 
                  value={filterThreshold} 
                  onChange={(e) => setFilterThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
               />
               <div className="mt-4 flex gap-2 justify-center">
                  <div className="text-[9px] text-slate-500 bg-white/5 px-2 py-1 rounded">DRAG TO ROTATE</div>
                  <div className="text-[9px] text-slate-500 bg-white/5 px-2 py-1 rounded">SCROLL TO ZOOM</div>
               </div>
           </div>
       </div>


       {/* --- VIEW 2: DATA STATION (Empty Futuristic Interface) --- */}
       {focusedNode && (
          <div className={`absolute inset-0 z-50 flex items-center justify-center transition-all duration-500 ${viewMode === 'focused' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              
              {/* Back Button (Top Left) */}
              <button 
                onClick={exitFocusMode} 
                className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group z-50"
              >
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/50">
                      <Minimize size={18} />
                  </div>
                  <span className="text-sm font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">RETURN TO ORBIT</span>
              </button>

              {/* Main Holo-Panel */}
              <div className="w-[90%] max-w-5xl h-[80%] glass-thick rounded-[3rem] border border-white/10 relative overflow-hidden flex shadow-2xl animate-pop-in bg-[#020617]/90 backdrop-blur-2xl">
                  
                  {/* Left: Data Core (The Node) */}
                  <div className="w-1/3 border-r border-white/10 relative p-8 flex flex-col items-center justify-center bg-gradient-to-b from-white/5 to-transparent">
                      {/* Rotating Rings Effect around Node */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                          <div className="w-64 h-64 border border-dashed border-cyan-500 rounded-full animate-spin-slow"></div>
                          <div className="absolute w-48 h-48 border border-white/20 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '20s' }}></div>
                      </div>

                      <div 
                        className="w-32 h-32 rounded-full shadow-[0_0_50px_currentColor] mb-8 relative z-10 animate-float"
                        style={{ color: focusedNode.color, backgroundColor: focusedNode.color }}
                      >
                         <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
                      </div>

                      <h2 className="text-3xl font-display font-bold text-white text-center mb-2 drop-shadow-lg">
                          {isEditing ? 'EDITING...' : focusedNode.label}
                      </h2>
                      <div className="px-3 py-1 rounded-full border border-white/20 text-xs font-mono text-slate-300 bg-black/40">
                          ID: {focusedNode.id.toUpperCase()}
                      </div>
                  </div>

                  {/* Right: Interface Controls */}
                  <div className="flex-1 p-12 flex flex-col relative">
                      
                      {/* Header */}
                      <div className="flex justify-between items-start mb-10">
                          <div>
                              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                 <Database size={14} /> Data Packet Analysis
                              </h3>
                              {isEditing ? (
                                  <input 
                                    value={editLabel} 
                                    onChange={(e) => setEditLabel(e.target.value)} 
                                    className="text-4xl font-bold bg-transparent border-b border-white/20 focus:border-cyan-500 outline-none text-white w-full"
                                    autoFocus
                                  />
                              ) : (
                                  <h1 className="text-4xl font-display font-bold text-white">{focusedNode.label}</h1>
                              )}
                          </div>
                          
                          <div className="flex gap-2">
                              <button onClick={() => setIsEditing(!isEditing)} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">
                                  {isEditing ? <Save size={20} className="text-green-400" onClick={handleSaveEdit} /> : <Edit2 size={20} />}
                              </button>
                              <button className="p-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors">
                                  <Trash2 size={20} />
                              </button>
                          </div>
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-2 gap-8 mb-8">
                          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors group">
                              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Description</div>
                              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                                 {focusedNode.meta.description}
                              </p>
                          </div>
                          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors">
                              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Metadata</div>
                              <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">Confidence</span>
                                      <span className="text-green-400 font-bold">{focusedNode.meta.confidence}%</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                      <span className="text-slate-500">Type</span>
                                      <span className="text-blue-400 font-bold capitalize">{focusedNode.type}</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Connected Satellites (Warp Targets) */}
                      <div className="mb-auto">
                          <div className="text-xs text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                             <Share2 size={12} /> Connected Nodes
                          </div>
                          <div className="flex gap-3 overflow-x-auto pb-4">
                              {focusedNode.connections.map(connId => {
                                  const connNode = nodes.find(n => n.id === connId);
                                  if (!connNode) return null;
                                  return (
                                      <button 
                                        key={connId}
                                        onClick={() => warpToConnection(connId)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all shrink-0 group min-w-[160px]"
                                      >
                                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: connNode.color }}></div>
                                          <div className="text-left">
                                              <div className="text-xs font-bold text-slate-200 truncate w-24">{connNode.label}</div>
                                              <div className="text-[10px] text-slate-500 group-hover:text-cyan-400 transition-colors">WARP TO NODE</div>
                                          </div>
                                          <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </button>
                                  )
                              })}
                              {focusedNode.connections.length === 0 && (
                                  <div className="text-sm text-slate-500 italic">Isolated Node. No connections found.</div>
                              )}
                          </div>
                      </div>

                      {/* Spark Action */}
                      <div className="mt-8 pt-6 border-t border-white/10">
                          {sparkMessage ? (
                              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 flex items-center gap-3 animate-slide-up">
                                  <Sparkles size={18} className="text-cyan-400 animate-pulse" />
                                  <span className="text-sm text-cyan-100">{sparkMessage}</span>
                              </div>
                          ) : (
                              <button 
                                onClick={handleIgniteSpark}
                                disabled={isSparking}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold tracking-widest shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-3 group"
                              >
                                  {isSparking ? <Rocket size={20} className="animate-bounce" /> : <Zap size={20} />}
                                  {isSparking ? 'ANALYZING...' : 'IGNITE NEURAL SPARK'}
                              </button>
                          )}
                      </div>

                  </div>
              </div>
          </div>
       )}

    </div>
  );
};

export default MemoryGraphExplorer;
