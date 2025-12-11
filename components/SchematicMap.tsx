import React, { useEffect, useState, useRef } from 'react';
import { Technician, Job } from '../types';

interface SchematicMapProps {
  technicians: Technician[];
  jobs: Job[];
  selectedTechId: string | null;
  onSelectTech: (id: string) => void;
  onSelectJob: (id: string) => void;
}

export const SchematicMap: React.FC<SchematicMapProps> = ({ 
    technicians, 
    jobs, 
    selectedTechId,
    onSelectTech,
    onSelectJob
}) => {
    // Simulate slight movement for "Live" feel
    const [offsets, setOffsets] = useState<Record<string, {x: number, y: number}>>({});
    
    // Dragging State
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const newOffsets: Record<string, {x: number, y: number}> = {};
            technicians.forEach(t => {
                if(t.status === 'En Route' || t.status === 'Working') {
                    newOffsets[t.id] = {
                        x: (Math.random() - 0.5) * 0.5,
                        y: (Math.random() - 0.5) * 0.5
                    };
                } else {
                    newOffsets[t.id] = { x: 0, y: 0 };
                }
            });
            setOffsets(newOffsets);
        }, 1000);
        return () => clearInterval(interval);
    }, [technicians]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        
        // Scale the drag to feel natural (approx pixel to SVG unit ratio)
        const scaleFactor = 0.15; 

        setPan(prev => ({
            x: prev.x + (dx * scaleFactor),
            y: prev.y + (dy * scaleFactor)
        }));

        lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

  return (
    <div className="bg-surface border border-border shadow-card h-full relative overflow-hidden flex flex-col select-none">
      <div className="absolute top-4 left-4 z-10 bg-surface/90 backdrop-blur border border-border px-4 py-2 shadow-sm rounded-sm pointer-events-none">
        <h3 className="font-semibold text-charcoal text-sm">Live Operations Map</h3>
        <span className="text-xs text-secondary block">West Kensington, London</span>
      </div>

      <div 
        className={`flex-1 bg-[#F3F4F6] relative w-full h-full overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Map Container */}
        <svg 
            ref={svgRef}
            className="w-full h-full pointer-events-none" // Events handled by parent div
            viewBox="0 0 100 100" 
            preserveAspectRatio="xMidYMid slice"
        >
          <defs>
             {/* Infinite Grid Pattern */}
             <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E7EB" strokeWidth="0.5"/>
             </pattern>
          </defs>

          {/* Draggable Group */}
          <g transform={`translate(${pan.x}, ${pan.y})`}>
            
            {/* Massive Background to support panning */}
            <rect x="-2000" y="-2000" width="5000" height="5000" fill="#F3F4F6" />
            <rect x="-2000" y="-2000" width="5000" height="5000" fill="url(#grid)" />

            {/* Parks / Green Areas */}
            <rect x="80" y="55" width="20" height="40" fill="#E5E7EB" opacity="0.5" /> 
            
            {/* Major Roads - Extended infinitely */}
            {/* Talgarth Rd / A4 (Top Horizontal) */}
            <path d="M -2000 15 L 2000 15" stroke="#D1D5DB" strokeWidth="4" />
            <path d="M -2000 15 L 2000 15" stroke="#FFFFFF" strokeWidth="2.5" />
            
            {/* Lillie Rd (Bottom Horizontal) */}
            <path d="M -2000 85 L 2000 85" stroke="#D1D5DB" strokeWidth="3" />
            <path d="M -2000 85 L 2000 85" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* North End Rd (Vertical Left-ish) */}
            <path d="M 30 -2000 L 30 2000" stroke="#D1D5DB" strokeWidth="3" />
            <path d="M 30 -2000 L 30 2000" stroke="#FFFFFF" strokeWidth="1.5" />
            
            {/* Warwick Rd (Vertical Right) */}
            <path d="M 75 -2000 L 75 2000" stroke="#D1D5DB" strokeWidth="3" />
            <path d="M 75 -2000 L 75 2000" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* District Line Railway */}
            <path d="M -500 230 Q 50 50 500 -180" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="1 1" />
            
            {/* Labels for Streets (repeated slightly for context) */}
            <text x="50" y="12" fill="#9CA3AF" fontSize="1.5" fontWeight="500" textAnchor="middle" letterSpacing="0.5">TALGARTH ROAD</text>
            <text x="-50" y="12" fill="#9CA3AF" fontSize="1.5" fontWeight="500" textAnchor="middle" letterSpacing="0.5">TALGARTH ROAD</text>
            <text x="150" y="12" fill="#9CA3AF" fontSize="1.5" fontWeight="500" textAnchor="middle" letterSpacing="0.5">TALGARTH ROAD</text>

            <text x="27" y="50" fill="#9CA3AF" fontSize="1.5" fontWeight="500" transform="rotate(90 27 50)" letterSpacing="0.5">NORTH END RD</text>
            <text x="72" y="50" fill="#9CA3AF" fontSize="1.5" fontWeight="500" transform="rotate(90 72 50)" letterSpacing="0.5">WARWICK RD</text>
            <text x="50" y="83" fill="#9CA3AF" fontSize="1.5" fontWeight="500" textAnchor="middle" letterSpacing="0.5">LILLIE RD</text>
            
            {/* Local Landmarks */}
            <text x="12" y="25" fill="#6B7280" fontSize="1.2" textAnchor="middle" fontWeight="600">OLYMPIA</text>
            <text x="87.5" y="30" fill="#6B7280" fontSize="1.2" textAnchor="middle" fontWeight="600">EARLS CT</text>

            {/* --- DYNAMIC DATA --- */}

            {/* Unassigned Jobs */}
            {jobs.filter(j => j.status === 'Unassigned').map((job) => (
                <g 
                    key={job.id} 
                    className="cursor-pointer pointer-events-auto"
                    onClick={(e) => { e.stopPropagation(); onSelectJob(job.id); }}
                >
                    {/* Clean Marker */}
                    <circle cx={job.location.x} cy={job.location.y} r="3" fill="#EF4444" opacity="0.2">
                        <animate attributeName="r" values="3;6" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.2;0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={job.location.x} cy={job.location.y} r="1.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="0.5" />
                </g>
            ))}

            {/* Technicians */}
            {technicians.map((tech) => {
                const isSelected = selectedTechId === tech.id;
                const offset = offsets[tech.id] || {x: 0, y: 0};
                const finalX = tech.location.x + offset.x;
                const finalY = tech.location.y + offset.y;
                
                // Tech color based on state
                const techColor = tech.status === 'Working' ? '#111827' : '#10B981';

                return (
                    <g 
                        key={tech.id} 
                        className="cursor-pointer transition-transform duration-1000 ease-linear pointer-events-auto"
                        onClick={(e) => { e.stopPropagation(); onSelectTech(tech.id); }}
                        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }} 
                    >
                        {/* Selection halo */}
                        {isSelected && (
                            <circle cx={finalX} cy={finalY} r="4" fill="none" stroke="#111827" strokeWidth="0.2" strokeDasharray="1 1" />
                        )}
                        
                        {/* Vehicle Dot */}
                        <circle 
                            cx={finalX} 
                            cy={finalY} 
                            r="2" 
                            fill={techColor} 
                            stroke="#FFFFFF" 
                            strokeWidth="0.5"
                            className="drop-shadow-sm"
                        />
                        
                        {/* Minimal Label */}
                        {isSelected && (
                            <g>
                                <rect x={finalX + 3} y={finalY - 2.5} width="10" height="5" rx="1" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.2" />
                                <text x={finalX + 8} y={finalY + 1} textAnchor="middle" fill="#111827" fontSize="2" fontWeight="500">{tech.vehicleId.split('-')[1]}</text>
                            </g>
                        )}
                    </g>
                );
            })}
          </g>
        </svg>
      </div>
      
      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
        <button 
            onClick={() => setPan({x: 0, y: 0})}
            className="w-8 h-8 bg-surface border border-border rounded shadow-sm flex items-center justify-center text-charcoal hover:bg-gray-50 text-xs font-bold"
            title="Reset View"
        >
            ⌖
        </button>
      </div>
    </div>
  );
};