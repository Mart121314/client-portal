export interface Message {
  id: string;
  content: string;
  projectId: string;
  senderId: string;
  sender?: { id: string; email: string; role: 'ADMIN' | 'CLIENT' };
  project?: { id: string; title: string };
  createdAt: string;
}
