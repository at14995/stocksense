export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'normal' | 'high';

export type Ticket = {
  id: string;
  ownerUid: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  adminAssigneeUid?: string;
  resolutionNotes?: string;
  lastActor: 'user' | 'admin';
  createdAt?: any;
  updatedAt?: any;
};
