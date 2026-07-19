export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  customerNotes: string | null;
  internalNotes?: string | null;
  progressPercent: number;
  eta: string | null;
  clientId: string;
  serviceRequestId: string | null;
  createdAt: string;
  updatedAt: string;
}
