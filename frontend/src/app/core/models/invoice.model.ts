export type InvoiceStatus = 'UNPAID' | 'PAID' | 'OVERDUE';

export interface Invoice {
  id: string;
  amount: string;
  status: InvoiceStatus;
  dueDate: string | null;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}
