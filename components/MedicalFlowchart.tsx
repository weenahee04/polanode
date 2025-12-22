import React, { useEffect, useState, useRef } from 'react';
import { FlowchartData, FlowchartNode, FlowchartNodeType } from '../types';
import { Loader2, GitMerge, CheckCircle, HelpCircle, ZoomIn, ZoomOut, RotateCcw, MousePointerClick } from 'lucide-react';

interface MedicalFlowchartProps {
  data: FlowchartData;
  isLoading: boolean;
}

interface SimulationNode extends FlowchartNode {
  x: number;
  y: number;
  level: number;
}

export const MedicalFlowchart: React.FC<MedicalFlowchartProps> = ({ data, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<SimulationNode[]>([]);
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: window.innerWidth || 360, height: 0 });
  
  // Interactive States
  const [zoom, setZoom] = useState(1);
  const [activeNodeIds, setActiveNodeIds] = useState<Set<string>>(new Set());
  const [activeEdgeIds, setActiveEdgeIds] = useState<Set<string>>(new Set());

  // 1. Measure Container Size
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
            setContainerSize({
                width: entry.contentRect.width,
                height: entry.contentRect.height
            });
        }
      }
    });
    
    observer.observe(containerRef.current);
    
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width > 0) {
        setContainerSize({ width: rect.width, height: rect.height });
    }

    return () => observer.disconnect();
  }, []);

  // 2. Calculate Layout
  useEffect(() => {
    if (data.nodes.length === 0 || containerSize.width === 0) return;

    const adjacency: Record<string, string[]> = {};
    data.edges.forEach(e => {
      if (!adjacency[e.source]) adjacency[e.source] = [];
      adjacency[e.source].push(e.target);
    });

    const processed = new Set<string>();
    const levels: Record<string, number> = {};
    const allNodeIds = new Set(data.nodes.map(n => n.id));
    
    while (processed.size < data.nodes.length) {
        let roots: string[] = [];
        const unprocessed = data.nodes.filter(n => !processed.has(n.id));
        
        const incomingCount: Record<string, number> = {};
        unprocessed.forEach(n => incomingCount[n.id] = 0);
        
        data.edges.forEach(e => {
            if (allNodeIds.has(e.source) && allNodeIds.has(e.target)) {
                if (!processed.has(e.source) && !processed.has(e.target)) {
                    incomingCount[e.target] = (incomingCount[e.target] || 0) + 1;
                }
            }
        });

        roots = unprocessed.filter(n => incomingCount[n.id] === 0).map(n => n.id);

        if (roots.length === 0 && unprocessed.length > 0) {
            roots = [unprocessed[0].id];
        }
        
        if (roots.length === 0) break;

        const queue: {id: string, lvl: number}[] = roots.map(r => ({ id: r, lvl: 0 }));

        while (queue.length > 0) {
            const { id, lvl } = queue.shift()!;
            if (processed.has(id)) continue;
            
            processed.add(id);
            levels[id] = lvl;

            const neighbors = adjacency[id] || [];
            neighbors.forEach(nid => {
                if (!processed.has(nid)) {
                    queue.push({ id: nid, lvl: lvl + 1 });
                }
            });
        }
    }

    const nodesByLevel: Record<number, FlowchartNode[]> = {};
    let maxLevel = 0;
    
    data.nodes.forEach(n => {
      const lvl = levels[n.id] !== undefined ? levels[n.id] : 0;
      maxLevel = Math.max(maxLevel, lvl);
      if (!nodesByLevel[lvl]) nodesByLevel[lvl] = [];
      nodesByLevel[lvl].push(n);
    });

    const calculatedNodes: SimulationNode[] = [];
    const levelHeight = 160;
    const nodeSpacing = 160;
    
    let maxRowWidth = 0;
    Object.values(nodesByLevel).forEach(nodes => {
        maxRowWidth = Math.max(maxRowWidth, nodes.length * nodeSpacing);
    });

    const canvasWidth = Math.max(containerSize.width, maxRowWidth + 100);
    const canvasHeight = Math.max(containerSize.height || 600, (maxLevel + 1) * levelHeight + 200);
    
    const centerX = canvasWidth / 2;

    Object.entries(nodesByLevel).forEach(([lvlStr, levelNodes]) => {
      const lvl = parseInt(lvlStr);
      const count = levelNodes.length;
      const totalWidth = (count - 1) * nodeSpacing;
      const startX = centerX - (totalWidth / 2);

      levelNodes.forEach((node, idx) => {
        calculatedNodes.push({
          ...node,
          level: lvl,
          x: startX + (idx * nodeSpacing),
          y: 80 + (lvl * levelHeight)
        });
      });
    });

    setContentSize({ width: canvasWidth, height: canvasHeight });
    setNodes(calculatedNodes);
  }, [data, containerSize]);

  // --- Interaction Handlers ---
  const handleNodeClick = (nodeId: string) => {
    // If clicking same node, clear selection
    if (activeNodeIds.has(nodeId) && activeNodeIds.size === 1) {
        setActiveNodeIds(new Set());
        setActiveEdgeIds(new Set());
        return;
    }

    // Trace path backwards from this node to root
    const pathNodes = new Set<string>();
    const pathEdges = new Set<string>();
    const queue = [nodeId];
    pathNodes.add(nodeId);

    // Build incoming edges map
    const incomingEdges: Record<string, {source: string, edgeId: number}[]> = {};
    data.edges.forEach((edge, idx) => {
        if (!incomingEdges[edge.target]) incomingEdges[edge.target] = [];
        incomingEdges[edge.target].push({ source: edge.source, edgeId: idx });
    });

    while (queue.length > 0) {
        const currentId = queue.shift()!;
        const incoming = incomingEdges[currentId] || [];
        
        incoming.forEach(({ source, edgeId }) => {
            if (!pathNodes.has(source)) {
                pathNodes.add(source);
                pathEdges.add(`${edgeId}`); // Store index or ID
                queue.push(source);
            }
        });
    }

    setActiveNodeIds(pathNodes);
    setActiveEdgeIds(pathEdges);
  };

  const resetView = () => {
      setZoom(1);
      setActiveNodeIds(new Set());
      setActiveEdgeIds(new Set());
  };

  // --- Render Helpers ---
  const renderShape = (node: SimulationNode) => {
    const isActive = activeNodeIds.has(node.id);
    const baseStyle = "transition-all duration-300 ";
    
    switch (node.type) {
      case 'start':
      case 'end':
        return `${baseStyle} rounded-full px-5 py-2.5 shadow-lg border-2 ${
            isActive 
            ? 'bg-[#0056b3] border-blue-400 ring-4 ring-blue-500/20 scale-110 z-30' 
            : 'bg-slate-800 border-slate-700 text-white'
        }`;
      case 'decision':
        return `${baseStyle} rotate-45 w-28 h-28 flex items-center justify-center shadow-md border-2 ${
            isActive
            ? 'bg-yellow-100 border-yellow-500 ring-4 ring-yellow-500/20 scale-110 z-30'
            : 'bg-yellow-50 border-yellow-400'
        }`;
      default: // process
        return `${baseStyle} rounded-xl px-4 py-3 shadow-md max-w-[200px] border ${
            isActive
            ? 'bg-blue-50 border-blue-500 ring-4 ring-blue-500/20 scale-105 z-30'
            : 'bg-white border-slate-200 hover:border-[#0056b3]'
        }`;
    }
  };

  const renderContent = (node: SimulationNode) => {
    const isActive = activeNodeIds.has(node.id);
    
    if (node.type === 'decision') {
      return (
        <div className="-rotate-45 text-center flex flex-col items-center justify-center w-40 h-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
             <HelpCircle className={`h-6 w-6 mb-1 ${isActive ? 'text-yellow-700' : 'text-yellow-600'}`} />
             <span className={`text-xs font-bold font-kanit leading-tight px-6 ${isActive ? 'text-yellow-900' : 'text-slate-800'}`}>
                {node.label}
             </span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
         {node.type === 'start' && <GitMerge className="h-5 w-5 text-white" />}
         {node.type === 'end' && <CheckCircle className={`h-5 w-5 ${isActive ? 'text-white' : 'text-green-400'}`} />}
         
         <span className={`text-sm font-medium font-kanit leading-snug ${
             node.type === 'start' || node.type === 'end' || isActive ? (node.type === 'process' ? 'text-blue-800' : 'text-white') : 'text-slate-700'
         }`}>
            {node.label}
         </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center space-y-6 bg-slate-50 p-8 text-center animate-fade-in">
        <Loader2 className="h-12 w-12 text-[#0056b3] animate-spin" />
        <h3 className="text-xl font-bold text-slate-700 font-kanit">กำลังสร้างแผนผัง... (Generating Flowchart)</h3>
      </div>
    );
  }

  if (data.nodes.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-slate-50">
        <div className="bg-white p-6 rounded-full shadow-sm mb-4 border border-slate-100">
             <GitMerge className="h-10 w-10 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 font-kanit">ไม่มีข้อมูล Flowchart</h3>
        <p className="text-sm text-slate-500 font-kanit mt-2">อัปโหลดรูปภาพเพื่อสร้างแผนผังการวินิจฉัย</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-50/50">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
            <button onClick={() => setZoom(z => Math.min(z + 0.1, 2))} className="p-2 bg-white rounded-lg shadow-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#0056b3]">
                <ZoomIn className="h-5 w-5" />
            </button>
            <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))} className="p-2 bg-white rounded-lg shadow-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#0056b3]">
                <ZoomOut className="h-5 w-5" />
            </button>
            <button onClick={resetView} className="p-2 bg-white rounded-lg shadow-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#0056b3]">
                <RotateCcw className="h-5 w-5" />
            </button>
        </div>

        {/* Legend / Instruction */}
        <div className="absolute bottom-4 left-4 z-40 bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-slate-100 shadow-sm pointer-events-none">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-kanit">
                <MousePointerClick className="h-4 w-4" />
                <span>แตะที่กล่องเพื่อดูเส้นทาง (Tap node to trace path)</span>
            </div>
        </div>

        <div 
            ref={containerRef} 
            className="h-full w-full overflow-auto touch-pan-x touch-pan-y"
        >
            <div 
                className="relative min-w-full min-h-full transition-transform duration-300 origin-top-left" 
                style={{ 
                    width: contentSize.width, 
                    height: contentSize.height,
                    transform: `scale(${zoom})`
                }}
            >
                 {/* Edges Layer */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <defs>
                      <marker id="arrowhead-flow" markerWidth="12" markerHeight="8" refX="11" refY="4" orient="auto">
                        <polygon points="0 0, 12 4, 0 8" fill="#94a3b8" />
                      </marker>
                      <marker id="arrowhead-flow-active" markerWidth="12" markerHeight="8" refX="11" refY="4" orient="auto">
                        <polygon points="0 0, 12 4, 0 8" fill="#3b82f6" />
                      </marker>
                    </defs>
                    {data.edges.map((edge, i) => {
                        const src = nodes.find(n => n.id === edge.source);
                        const tgt = nodes.find(n => n.id === edge.target);
                        if (!src || !tgt) return null;

                        const isActive = activeEdgeIds.has(`${i}`);
                        const srcY = src.y + (src.type === 'decision' ? 50 : 30);
                        const tgtY = tgt.y - (tgt.type === 'decision' ? 50 : 30);
                        const midY = (srcY + tgtY) / 2;
                        
                        return (
                            <g key={i}>
                                <path 
                                    d={`M ${src.x} ${srcY} L ${src.x} ${midY} L ${tgt.x} ${midY} L ${tgt.x} ${tgtY}`}
                                    fill="none"
                                    stroke={isActive ? "#3b82f6" : "#94a3b8"}
                                    strokeWidth={isActive ? "3" : "2"}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    markerEnd={`url(#arrowhead-flow${isActive ? '-active' : ''})`}
                                    className="transition-all duration-300"
                                />
                                {edge.label && (
                                    <foreignObject x={(src.x + tgt.x)/2 - 35} y={midY - 14} width="70" height="28">
                                        <div className="flex justify-center">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold border rounded-full shadow-sm font-kanit whitespace-nowrap transition-colors ${
                                                isActive 
                                                ? 'bg-blue-50 text-blue-600 border-blue-200' 
                                                : 'bg-white text-slate-600 border-slate-200'
                                            }`}>
                                                {edge.label}
                                            </span>
                                        </div>
                                    </foreignObject>
                                )}
                            </g>
                        );
                    })}
                 </svg>

                 {/* Nodes Layer */}
                 {nodes.map(node => (
                    <div
                        key={node.id}
                        onClick={() => handleNodeClick(node.id)}
                        className={`absolute z-10 flex items-center justify-center cursor-pointer ${renderShape(node)}`}
                        style={{
                            left: node.x,
                            top: node.y,
                            transform: `translate(-50%, -50%) ${activeNodeIds.has(node.id) && (node.type === 'decision' || node.type === 'start') ? (node.type === 'decision' ? 'rotate(45deg) scale(1.1)' : 'scale(1.1)') : (node.type === 'decision' ? 'rotate(45deg)' : '')}`,
                        }}
                    >
                        {renderContent(node)}
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};