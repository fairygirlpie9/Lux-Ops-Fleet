import React, { useState } from 'react';
import { MetricsPanel } from './components/MetricsPanel';
import { TechnicianList } from './components/TechnicianList';
import { SchematicMap } from './components/SchematicMap';
import { JobAllocation } from './components/JobAllocation';
import { PerformancePanel } from './components/PerformancePanel';
import { AIAssistantModal } from './components/AIAssistantModal';
import { ExecutiveSummaryModal } from './components/ExecutiveSummaryModal';
import { RealTimeClock } from './components/RealTimeClock';
import { MOCK_TECHNICIANS, MOCK_JOBS, INITIAL_METRICS } from './constants';
import { Technician, Job } from './types';
import { LayoutGrid, Bell, Search, Download, Hexagon } from 'lucide-react';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>(MOCK_TECHNICIANS);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isExecModalOpen, setIsExecModalOpen] = useState(false);
  const [metrics, setMetrics] = useState(INITIAL_METRICS);

  const handleAssignJob = (jobId: string) => {
    alert(`Job ${jobId} dispatch initiated.`);
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'Assigned' } : j));
    setMetrics(prev => ({ ...prev, activeJobs: prev.activeJobs + 1 }));
  };

  const handleTechSelect = (id: string) => {
    setSelectedTechId(id);
  };

  const handleJobSelect = (id: string) => {
    console.log("Selected Job on Map:", id);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const dateStr = new Date().toLocaleString();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("LUX OPS FLEET Report", 10, 15);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${dateStr}`, 10, 22);
    doc.line(10, 25, pageWidth - 10, 25);

    // Metrics Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Key Metrics", 10, 35);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    let yPos = 45;
    doc.text(`Active Jobs: ${metrics.activeJobs}`, 15, yPos);
    doc.text(`Revenue YTD: €${metrics.revenueToDate}`, 80, yPos);
    yPos += 8;
    doc.text(`Avg Response: ${metrics.avgResponseTime}m`, 15, yPos);
    doc.text(`Fleet Efficiency: ${metrics.fleetEfficiency}%`, 80, yPos);
    yPos += 8;
    doc.text(`Billable Hours: ${metrics.billableHours}`, 15, yPos);

    doc.line(10, yPos + 5, pageWidth - 10, yPos + 5);

    // Technicians List
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Technician Status", 10, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Name", 15, yPos);
    doc.text("Vehicle", 60, yPos);
    doc.text("Status", 100, yPos);
    doc.text("Efficiency", 150, yPos);
    doc.setTextColor(0);
    
    yPos += 2;
    doc.setLineWidth(0.5);
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 8;

    doc.setFont("helvetica", "normal");
    technicians.forEach((tech) => {
        doc.text(tech.name, 15, yPos);
        doc.text(tech.vehicleId, 60, yPos);
        doc.text(tech.status, 100, yPos);
        doc.text(`${tech.efficiencyScore}%`, 150, yPos);
        yPos += 7;
    });

    // Unassigned Jobs
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Pending Jobs", 10, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Customer", 15, yPos);
    doc.text("Priority", 80, yPos);
    doc.text("Value", 120, yPos);
    doc.setTextColor(0);
    
    yPos += 2;
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 8;

    doc.setFont("helvetica", "normal");
    jobs.filter(j => j.status === 'Unassigned').forEach((job) => {
        doc.text(job.customer, 15, yPos);
        doc.text(job.priority, 80, yPos);
        doc.text(`€${job.estimatedValue}`, 120, yPos);
        yPos += 7;
    });

    doc.save("lux-ops-report.pdf");
  };

  return (
    <div className="flex flex-col h-screen bg-background text-charcoal overflow-hidden selection:bg-gray-200 font-sans">
      {/* Navbar */}
      <header className="h-12 bg-surface border-b border-border flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="text-black flex items-center justify-center">
             <Hexagon strokeWidth={3} size={24} />
          </div>
          <h1 className="text-xl font-black tracking-widest text-charcoal leading-none uppercase flex items-center gap-3">
              <span>LUX OPS</span>
              <span>FLEET</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
             {/* Search Bar - Hidden on small tablets to save space */}
             <div className="hidden lg:flex items-center bg-gray-100 px-2 py-1 rounded w-48">
                <Search size={14} className="text-secondary mr-2" />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="bg-transparent border-none outline-none text-xs text-charcoal placeholder-secondary w-full"
                />
             </div>
            
            <div className="h-4 w-px bg-border mx-1"></div>

            <RealTimeClock />

            <div className="h-4 w-px bg-border mx-1"></div>

            <button 
                onClick={() => setIsAiModalOpen(true)}
                className="text-xs font-medium text-charcoal hover:text-black hover:bg-gray-100 px-2 py-1 rounded transition-colors flex items-center gap-1.5"
            >
                AI Insights
            </button>

            <button className="text-secondary hover:text-charcoal relative">
                <Bell size={16} />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-danger rounded-full border border-white"></span>
            </button>
            
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-secondary">
                AD
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-3 overflow-hidden flex flex-col min-h-0 bg-[#F8F9FA]">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-3 shrink-0">
            <div>
                <h2 className="text-lg font-bold text-charcoal leading-none">Operational Overview</h2>
                <p className="text-xs text-secondary mt-1">Real-time performance metrics</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setIsExecModalOpen(true)}
                    className="flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-sm text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm"
                >
                    Executive Summary
                </button>
                 <button 
                    onClick={handleExportPDF}
                    className="flex items-center gap-1.5 bg-white border border-border text-charcoal px-3 py-1.5 rounded-sm text-xs font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <Download size={12} /> Export
                </button>
            </div>
        </div>

        <div className="flex flex-col h-full gap-3 min-h-0">
            <MetricsPanel metrics={metrics} />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 pb-1">
                {/* Left Column: Fleet List */}
                <div className="lg:col-span-3 h-full min-h-0 order-2 lg:order-1 flex flex-col">
                    <TechnicianList 
                        technicians={technicians} 
                        onSelectTechnician={handleTechSelect}
                        selectedTechId={selectedTechId}
                    />
                </div>

                {/* Center Column: Map */}
                <div className="lg:col-span-6 h-[40vh] lg:h-full min-h-0 order-1 lg:order-2">
                    <SchematicMap 
                        technicians={technicians}
                        jobs={jobs}
                        selectedTechId={selectedTechId}
                        onSelectTech={handleTechSelect}
                        onSelectJob={handleJobSelect}
                    />
                </div>

                {/* Right Column: Allocation & Performance */}
                <div className="lg:col-span-3 h-full min-h-0 flex flex-col gap-3 order-3">
                    <JobAllocation jobs={jobs} onAssign={handleAssignJob} />
                    <PerformancePanel technicians={technicians} />
                </div>
            </div>
        </div>
      </main>

      {/* Modals */}
      <AIAssistantModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
        technicians={technicians}
        jobs={jobs}
        metrics={metrics}
      />
      <ExecutiveSummaryModal
        isOpen={isExecModalOpen}
        onClose={() => setIsExecModalOpen(false)}
      />
    </div>
  );
};

export default App;