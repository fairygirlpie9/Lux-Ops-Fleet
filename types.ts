export enum TechnicianStatus {
  Available = 'Available',
  EnRoute = 'En Route',
  Working = 'Working',
  OnBreak = 'On Break',
  Offline = 'Offline',
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Job {
  id: string;
  customer: string;
  type: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Unassigned' | 'Assigned' | 'In Progress' | 'Completed';
  estimatedValue: number;
  address: string;
  zone: string;
  scheduledTime: string;
  location: Coordinates;
}

export interface Technician {
  id: string;
  name: string;
  avatar: string;
  vehicleId: string;
  status: TechnicianStatus;
  currentJobId?: string;
  location: Coordinates;
  zone: string;
  batteryLevel: number; // 0-100
  fuelLevel: number; // 0-100
  efficiencyScore: number; // 0-100
  jobsCompletedToday: number;
  billableRate: number;
}

export interface DashboardMetrics {
  activeJobs: number;
  revenueToDate: number;
  avgResponseTime: number; // minutes
  fleetEfficiency: number; // percentage
  billableHours: number;
}

export interface Zone {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
