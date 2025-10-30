'use client';
import { useEffect, useState } from 'react';
import { listenAllTicketsByStatus, adminUpdateTicket } from '../supportService';
import { Ticket, TicketStatus } from '../types';
import { ShieldCheck } from 'lucide-react';
import { notify } from '@/features/notifications/notifyService';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function AdminSupportPage() {
  const [statusFilter, setStatusFilter] =
    useState<TicketStatus | 'all'>('open');
  const [rows, setRows] = useState<Ticket[]>([]);

  useEffect(() => {
    const unsub = listenAllTicketsByStatus(statusFilter, setRows);
    return () => unsub && unsub();
  }, [statusFilter]);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Support Admin</h1>
        </div>
        <div className="w-48">
          <Select
            value={statusFilter}
            onValueChange={(v: any) => setStatusFilter(v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {rows.map((t) => (
          <div key={t.id} className="border rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Main Ticket Info */}
              <div className="md:col-span-2 space-y-2">
                <h3 className="font-semibold">{t.subject}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {t.message}
                </p>
                {t.resolutionNotes && (
                  <div className="text-sm pt-2 mt-2 border-t">
                    <p className="font-semibold text-primary">Resolution Notes:</p>
                    <p className="text-muted-foreground whitespace-pre-line">{t.resolutionNotes}</p>
                  </div>
                )}
              </div>
              {/* Metadata and Actions */}
              <div className="space-y-4">
                 <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>User:</strong> {t.ownerUid.slice(0, 10)}...</p>
                    <p><strong>Priority:</strong> <span className="capitalize">{t.priority}</span></p>
                    <p><strong>Status:</strong> <span className="capitalize">{t.status.replace('_',' ')}</span></p>
                    <p><strong>Assignee:</strong> {t.adminAssigneeUid ? t.adminAssigneeUid.slice(0,10)+'...' : 'Unassigned'}</p>
                    <p><strong>Updated:</strong> {t.updatedAt?.toDate?.().toLocaleString()}</p>
                 </div>
                 <AdminActions ticket={t} />
              </div>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No tickets match the current filter.
          </div>
        )}
      </div>
    </div>
  );
}

function AdminActions({ ticket }: { ticket: Ticket }) {
  const { user } = useUser();
  const { toast } = useToast();

  async function setStatus(status: Ticket['status']) {
    try {
      await adminUpdateTicket(ticket.id, { status });
      await notify(
        ticket.ownerUid,
        'ticket',
        'Ticket status updated',
        `Your ticket "${ticket.subject.slice(0,20)}..." status has been updated to: ${status.replace('_',' ')}`,
        '/support'
      );
      toast({ title: 'Status Updated' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error updating status' });
    }
  }
  async function assignSelf() {
    if (!user) return;
    try {
      await adminUpdateTicket(ticket.id, {
        adminAssigneeUid: user.uid,
        status: ticket.status === 'open' ? 'in_progress' : ticket.status,
      });
      toast({ title: 'Ticket Assigned' });
    } catch(e) {
       toast({ variant: 'destructive', title: 'Error assigning ticket' });
    }
  }
  async function addNotes() {
    const notes = prompt('Enter resolution notes:');
    if (!notes || !notes.trim()) return;
    try {
      await adminUpdateTicket(ticket.id, { resolutionNotes: notes });
      await notify(
        ticket.ownerUid,
        'ticket',
        'Note added to your ticket',
        `A support agent added a note to your ticket: "${ticket.subject.slice(0,20)}..."`,
        '/support'
      );
      toast({ title: 'Notes Added' });
    } catch(e) {
       toast({ variant: 'destructive', title: 'Error adding notes' });
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={assignSelf} disabled={!user}>
          Assign to Me
        </Button>
        <Button size="sm" variant="outline" onClick={addNotes}>
          Add Notes
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {ticket.status !== 'in_progress' && (
          <Button size="xs" variant="secondary" onClick={() => setStatus('in_progress')}>
            Set In Progress
          </Button>
        )}
        {ticket.status !== 'resolved' && (
          <Button size="xs" variant="secondary" onClick={() => setStatus('resolved')}>
            Set Resolved
          </Button>
        )}
        {ticket.status !== 'closed' && (
           <Button size="xs" variant="secondary" onClick={() => setStatus('closed')}>
            Set Closed
          </Button>
        )}
      </div>
    </div>
  );
}
