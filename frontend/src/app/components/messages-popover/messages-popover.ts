import { Component, inject, signal, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ConversationService } from '../../core/services/conversation.service';
import { ProjectService } from '../../core/services/project.service';
import { Conversation } from '../../core/models/conversation.model';
import { Message } from '../../core/models/message.model';

@Component({
  selector: 'app-messages-popover',
  imports: [FormsModule, DatePipe],
  templateUrl: './messages-popover.html',
})
export class MessagesPopover implements OnInit {
  private conversationService = inject(ConversationService);
  private projectService = inject(ProjectService);
  private elementRef = inject(ElementRef);

  @ViewChild('threadBody') threadBody?: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  conversations = signal<Conversation[]>([]);
  unreadCount = signal(0);
  openConversationProjectId = signal<string | null>(null);
  conversationMessages = signal<Message[]>([]);
  newConversationMessage = '';
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUnreadCount();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  toggle(): void {
    this.isOpen.update((open) => !open);
    if (this.isOpen()) {
      this.loadConversations();
    }
  }

  loadUnreadCount(): void {
    this.conversationService.unreadCount().subscribe((res) => this.unreadCount.set(res.count));
  }

  loadConversations(): void {
    this.conversationService.list().subscribe((conversations) => this.conversations.set(conversations));
  }

  openConversation(conversation: Conversation): void {
    this.openConversationProjectId.set(conversation.projectId);
    this.projectService.listMessages(conversation.projectId).subscribe((messages) => {
      this.conversationMessages.set(messages);
      this.scrollToBottom();
    });

    if (conversation.unreadCount > 0) {
      this.projectService.markMessagesRead(conversation.projectId).subscribe(() => {
        this.loadConversations();
        this.loadUnreadCount();
      });
    }
  }

  closeConversation(): void {
    this.openConversationProjectId.set(null);
    this.conversationMessages.set([]);
  }

  sendConversationMessage(): void {
    const projectId = this.openConversationProjectId();
    if (!projectId || !this.newConversationMessage.trim()) return;

    this.projectService.addMessage(projectId, this.newConversationMessage).subscribe({
      next: () => {
        this.newConversationMessage = '';
        this.projectService.listMessages(projectId).subscribe((messages) => {
          this.conversationMessages.set(messages);
          this.scrollToBottom();
        });
        this.loadConversations();
      },
      error: (err) => this.error.set(err?.error?.error ?? 'Kunne ikke sende melding'),
    });
  }

  conversationTitleFor(projectId: string): string {
    return this.conversations().find((c) => c.projectId === projectId)?.projectTitle ?? '';
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const element = this.threadBody?.nativeElement;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }
}
