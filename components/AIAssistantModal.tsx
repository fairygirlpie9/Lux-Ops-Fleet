import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { analyzeFleetStatus } from '../services/geminiService';
import { Technician, Job, DashboardMetrics } from '../types';
import ReactMarkdown from 'react-markdown';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  technicians: Technician[];
  jobs: Job[];
  metrics: DashboardMetrics;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ 
  isOpen, 
  onClose,
  technicians,
  jobs,
  metrics
}) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !insight) {
      handleGenerateInsight();
    }
  }, [isOpen]);

  const handleGenerateInsight = async () => {
    setLoading(true);
    setInsight(null);
    const result = await analyzeFleetStatus(technicians, jobs, metrics);
    setInsight(result);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-2xl rounded-lg shadow-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-white p-5 flex justify-between items-center border-b border-border">
            <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-1.5 rounded-md">
                    <Sparkles size={18} className="text-charcoal" />
                </div>
                <h3 className="text-lg font-semibold text-charcoal">Fleet Insights</h3>
            </div>
            <button onClick={onClose} className="text-secondary hover:text-charcoal transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[300px] max-h-[60vh] overflow-y-auto bg-gray-50/50">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-48 space-y-3">
                    <Loader2 size={32} className="text-charcoal animate-spin" />
                    <p className="text-sm font-medium text-secondary">Analyzing fleet metrics...</p>
                </div>
            ) : (
                <div className="prose prose-sm prose-gray max-w-none">
                     <ReactMarkdown>
                        {insight || "No analysis available."}
                     </ReactMarkdown>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-white flex justify-end gap-3">
             <button 
                onClick={onClose}
                className="px-4 py-2 border border-border text-charcoal text-sm font-medium rounded hover:bg-gray-50 transition-colors"
             >
                Close
             </button>
             <button 
                onClick={handleGenerateInsight}
                disabled={loading}
                className="px-4 py-2 bg-charcoal text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
             >
                {loading ? 'Thinking...' : 'Refresh Analysis'}
             </button>
        </div>
      </div>
    </div>
  );
};