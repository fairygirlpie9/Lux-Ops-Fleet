import React from 'react';
import { Technician, TechnicianStatus } from '../types';
import { MapPin, Battery } from 'lucide-react';

interface TechnicianListProps {
  technicians: Technician[];
  onSelectTechnician: (techId: string) => void;
  selectedTechId: string | null;
}

const StatusDot: React.FC<{ status: TechnicianStatus }> = ({ status }) => {
  let colorClass = "bg-gray-300";
  if (status === TechnicianStatus.Working) colorClass = "bg-black";
  if (status === TechnicianStatus.Available) colorClass = "bg-success";
  if (status === TechnicianStatus.EnRoute) colorClass = "bg-blue-500";
  if (status === TechnicianStatus.OnBreak) colorClass = "bg-yellow-500";

  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${colorClass}`}></div>
      <span className="text-[10px] font-semibold text-secondary uppercase tracking-wide">{status}</span>
    </div>
  );
};

export const TechnicianList: React.FC<TechnicianListProps> = ({ technicians, onSelectTechnician, selectedTechId }) => {
  return (
    <div className="bg-surface border border-border shadow-card h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border bg-gray-50/50">
        <h2 className="text-sm font-bold text-charcoal">Fleet Status</h2>
      </div>
      <div className="overflow-y-auto flex-1">
        {technicians.map((tech) => (
          <div
            key={tech.id}
            onClick={() => onSelectTechnician(tech.id)}
            className={`p-3 cursor-pointer transition-colors border-l-[3px] ${
              selectedTechId === tech.id
                ? 'bg-gray-50 border-l-black'
                : 'bg-white border-l-transparent hover:bg-gray-50'
            } border-b border-gray-100 last:border-0`}
          >
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-center gap-2.5">
                <img 
                  src={tech.avatar} 
                  alt={tech.name} 
                  className="w-8 h-8 rounded-full bg-gray-200 object-cover border border-gray-100" 
                />
                <div>
                  <h4 className="text-sm font-semibold text-charcoal leading-tight">{tech.name}</h4>
                  <div className="text-[10px] text-secondary leading-tight mt-0.5">{tech.vehicleId}</div>
                </div>
              </div>
              <StatusDot status={tech.status} />
            </div>

            <div className="flex items-center gap-3 mt-1.5 pl-[42px]">
                <div className="flex items-center gap-1">
                    <MapPin size={10} className="text-secondary" />
                    <span className="text-[10px] text-secondary font-medium">{tech.zone}</span>
                </div>
                 <div className="flex items-center gap-1">
                    <Battery size={10} className={tech.batteryLevel < 20 ? 'text-danger' : 'text-secondary'}/>
                    <span className="text-[10px] text-secondary font-medium">{tech.batteryLevel}%</span>
                </div>
                <div className="flex items-center gap-1 ml-auto">
                    <span className="text-[10px] text-secondary">Eff:</span>
                    <span className="text-[10px] font-bold text-charcoal">{tech.efficiencyScore}%</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};