export type DeliverableStatus = 'PENDING' | 'DELIVERED';

export interface Deliverable {
  id: string;
  title: string;
  description: string | null;
  status: DeliverableStatus;
  dueDate: string | null;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}
