export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  notes: string | null;
  progressPercent: number;
  eta: string | null;
  clientId: string;
  serviceRequestId: string | null;
  createdAt: string;
  updatedAt: string;
}
