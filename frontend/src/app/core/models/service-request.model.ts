export type ServiceRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ServiceRequest {
  id: string;
  description: string;
  status: ServiceRequestStatus;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}
