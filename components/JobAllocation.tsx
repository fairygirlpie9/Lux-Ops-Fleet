import React from 'react';
import { Job } from '../types';

interface JobAllocationProps {
  jobs: Job[];
  onAssign: (jobId: string) => void;
}

export const JobAllocation: React.FC<JobAllocationProps> = ({ jobs, onAssign }) => {
  const sortedJobs = [...jobs]
    .filter(j => j.status === 'Unassigned')
    .sort((a, b) => {
       const p = { Critical: 3, High: 2, Medium: 1, Low: 0 };
       return p[b.priority] - p[a.priority];
    });

  return (
    <div className="bg-surface border border-border shadow-card flex flex-col h-1/2 min-h-[150px]">
      <div className="px-4 py-3 border-b border-border bg-gray-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-charcoal">Unassigned Jobs</h2>
        </div>
        <span className="bg-charcoal text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            {sortedJobs.length}
        </span>
      </div>
      <div className="overflow-y-auto flex-1 bg-white">
        {sortedJobs.length === 0 ? (
            <div className="text-secondary text-center text-xs py-8">No pending jobs.</div>
        ) : (
            sortedJobs.map((job) => (
            <div key={job.id} className="border-b border-gray-100 p-3 hover:bg-gray-50 group transition-colors">
                <div className="flex justify-between items-start mb-1">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                        job.priority === 'Critical' ? 'bg-red-50 text-red-600 border border-red-100' : 
                        job.priority === 'High' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                        'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                        {job.priority}
                    </span>
                    <span className="text-[10px] font-semibold text-charcoal bg-gray-100 px-1 rounded">€{job.estimatedValue}</span>
                </div>
                
                <h4 className="text-xs font-bold text-charcoal mb-0.5 truncate">{job.customer}</h4>
                <p className="text-[10px] text-secondary mb-2 truncate">{job.address}</p>
                
                <div className="flex justify-between items-center">
                    <div className="text-[10px] text-secondary font-medium">
                        Due: {job.scheduledTime}
                    </div>
                    <button 
                        onClick={() => onAssign(job.id)}
                        className="text-[10px] bg-white border border-gray-300 text-charcoal px-2 py-1 rounded-sm font-semibold hover:bg-charcoal hover:text-white hover:border-charcoal transition-all"
                    >
                        Assign
                    </button>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};