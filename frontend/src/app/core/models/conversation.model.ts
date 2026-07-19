import { Message } from './message.model';

export interface Conversation {
  projectId: string;
  projectTitle: string;
  clientEmail: string;
  lastMessage: Message | null;
  unreadCount: number;
}
