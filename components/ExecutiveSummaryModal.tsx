import React from 'react';
import { X, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface ExecutiveSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveSummaryModal: React.FC<ExecutiveSummaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-3xl rounded-lg shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-charcoal text-white p-5 flex justify-between items-center">
            <div>
                <h3 className="text-lg font-bold">Executive Summary</h3>
                <p className="text-xs text-gray-400">Daily Operational Report</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-gray-50 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded border border-border shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-success" />
                        <h4 className="text-xs font-bold uppercase text-secondary">Revenue Projection</h4>
                    </div>
                    <div className="text-2xl font-bold text-charcoal">€18,240</div>
                    <div className="text-xs text-success font-medium">+12% vs Target</div>
                </div>
                <div className="bg-white p-4 rounded border border-border shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={16} className="text-black" />
                        <h4 className="text-xs font-bold uppercase text-secondary">SLA Adherence</h4>
                    </div>
                    <div className="text-2xl font-bold text-charcoal">98.4%</div>
                    <div className="text-xs text-secondary font-medium">Top 5% of region</div>
                </div>
                <div className="bg-white p-4 rounded border border-border shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={16} className="text-danger" />
                        <h4 className="text-xs font-bold uppercase text-secondary">Critical Incidents</h4>
                    </div>
                    <div className="text-2xl font-bold text-charcoal">0</div>
                    <div className="text-xs text-secondary font-medium">Safe operations</div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white p-5 rounded border border-border shadow-sm">
                    <h4 className="text-sm font-bold text-charcoal mb-3">Strategic Highlights</h4>
                    <ul className="space-y-2 text-sm text-secondary">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0"></span>
                            Fleet efficiency has reached optimal levels due to new dynamic routing algorithms implemented in Zone 1 (Barons Court).
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0"></span>
                            Technician H. Specter is currently outperforming efficiency targets by 15%, setting a benchmark for the team.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-black rounded-full mt-1.5 shrink-0"></span>
                            Projected end-of-day closure rate is 95%, with all critical priority jobs currently assigned or in progress.
                        </li>
                    </ul>
                </div>

                 <div className="bg-white p-5 rounded border border-border shadow-sm">
                    <h4 className="text-sm font-bold text-charcoal mb-3">Recommendations</h4>
                    <p className="text-sm text-secondary leading-relaxed">
                        Monitor fuel levels for Unit VAN-088 as they approach the end of shift. 
                        Consider redistributing low-priority tickets from Zone 4 to tomorrow's queue to preserve overtime budget.
                    </p>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-white flex justify-end">
             <button 
                onClick={onClose}
                className="px-6 py-2 bg-charcoal text-white text-sm font-bold rounded hover:bg-black transition-colors"
             >
                Acknowledge
             </button>
        </div>
      </div>
    </div>
  );
};