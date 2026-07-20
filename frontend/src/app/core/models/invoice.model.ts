export type InvoiceStatus = 'UNPAID' | 'PAID' | 'OVERDUE';

export interface Invoice {
  id: string;
  amount: string;
  status: InvoiceStatus;
  dueDate: string | null;
  projectId: string;
  project?: { id: string; title: string; client: { email: string } };
  createdAt: string;
  updatedAt: string;
}
