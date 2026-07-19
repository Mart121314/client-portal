import { Pipe, PipeTransform } from '@angular/core';

const LABELS: Record<string, string> = {
  PENDING: 'Venter',
  APPROVED: 'Godkjent',
  REJECTED: 'Avslått',
  ACTIVE: 'Aktiv',
  COMPLETED: 'Fullført',
  CANCELLED: 'Avbrutt',
  PAID: 'Betalt',
  UNPAID: 'Ubetalt',
  OVERDUE: 'Forfalt',
  DELIVERED: 'Levert',
};

@Pipe({ name: 'statusLabel' })
export class StatusLabelPipe implements PipeTransform {
  transform(value: string): string {
    return LABELS[value] ?? value;
  }
}
