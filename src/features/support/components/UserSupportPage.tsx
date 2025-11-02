'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import {
  createTicket,
  listenMyTickets,
  updateTicketUser,
  deleteTicket,
} from '../supportService';
import { Ticket, TicketPriority } from '../types';
import {
  Plus,
  Pencil,
  Trash2,
  LifeBuoy,
  Loader2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function UserSupportPage() {
  const { user } = useUser();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    const unsub = listenMyTickets(user.uid, setTickets);
    return () => unsub && unsub();
  }, [user]);

  if (!user) return null;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-500/20';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-500/20';
      case 'resolved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-green-500/20';
      case 'closed':
        return 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-500/20';
      default:
        return 'bg-gray-100';
    }
  };


  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LifeBuoy className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Support</h1>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Ticket
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.subject}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`capitalize ${getStatusColor(t.status)}`}>
                    {t.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">{t.priority}</TableCell>
                <TableCell>
                  {t.updatedAt?.toDate?.().toLocaleString?.() || ''}
                </TableCell>
                <td className="p-2 text-right space-x-1">
                  {(t.status === 'open' || t.status === 'in_progress') && (
                    <InlineEditBtn
                      ticket={t}
                      onSave={(sub, msg) => updateTicketUser(t.id, sub, msg)}
                    />
                  )}
                  {t.status === 'open' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTicket(t.id)}
                      title="Delete"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </td>
              </TableRow>
            ))}
            {tickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="p-12 text-center text-muted-foreground">
                  You haven't created any support tickets yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <NewTicketDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function NewTicketDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { user } = useUser();
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('normal');
  const [isLoading, setIsLoading] = useState(false);

  const valid =
    subject.trim().length > 0 &&
    subject.trim().length <= 120 &&
    message.trim().length > 0 &&
    message.trim().length <= 2000;

  const reset = () => {
    setSubject('');
    setMessage('');
    setPriority('normal');
    setIsLoading(false);
  }

  const handleCreate = async () => {
    if (!user || !valid) return;
    setIsLoading(true);
    try {
      await createTicket(user.uid, subject, message, priority);
      toast({ title: 'Ticket Created', description: 'Our team will review your request shortly.'});
      reset();
      onOpenChange(false);
    } catch(e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not create ticket.'});
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if(!isOpen) reset();
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Support Ticket</DialogTitle>
          <DialogDescription>
            Please describe your issue in detail. Our support team will get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={120}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(v: TicketPriority) => setPriority(v)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/2000
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={!valid || isLoading} onClick={handleCreate}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InlineEditBtn({
  ticket,
  onSave,
}: {
  ticket: Ticket;
  onSave: (subject: string, message: string) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(ticket.subject);
  const [message, setMessage] = useState(ticket.message);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const valid =
    subject.trim().length > 0 &&
    subject.trim().length <= 120 &&
    message.trim().length > 0 &&
    message.trim().length <= 2000;

  const handleSave = async () => {
      if (!valid) return;
      setIsLoading(true);
      try {
          await onSave(subject, message);
          toast({ title: 'Ticket Updated'});
          setOpen(false);
      } catch (e) {
          toast({ variant: 'destructive', title: 'Error', description: 'Could not update ticket.'});
      } finally {
        setIsLoading(false);
      }
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} title="Edit">
        <Pencil className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ticket</DialogTitle>
            <DialogDescription>
              You can only edit the subject and message for tickets that are still open.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
             <div className="space-y-2">
                <Label htmlFor="edit-subject">Subject</Label>
                <Input id="edit-subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={120}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-message">Message</Label>
                <Textarea id="edit-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} maxLength={2000}/>
                <p className="text-xs text-muted-foreground text-right">{message.length}/2000</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              disabled={!valid || isLoading}
              onClick={handleSave}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
