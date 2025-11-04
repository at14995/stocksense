'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { createTicket } from '@/features/support/supportService';

export function ContactSection() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });

  const validate = () => {
    const newErrors = { name: '', email: '', message: '' };
    let isValid = true;
    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
      isValid = false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'A valid email is required.';
      isValid = false;
    }
    if (!message.trim() || message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // We use a placeholder UID and enrich the message for guest submissions
      const guestUid = `guest_${email.replace(/[@.]/g, '_')}`;
      const subject = `Contact Form: ${name}`;
      const enrichedMessage = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

      await createTicket(guestUid, subject, enrichedMessage, 'normal');
      
      toast({
        title: 'Message Sent!',
        description: "Thanks for reaching out. We'll get back to you shortly.",
      });
      setName('');
      setEmail('');
      setMessage('');
      setErrors({ name: '', email: '', message: '' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Could not send your message. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="relative w-full flex flex-col items-center py-16 md:py-24 border-y">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 dark:from-primary/5 dark:to-accent/5"></div>
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
          className="w-full max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Contact Us
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Have a question, issue, or partnership idea? Reach out and we'll respond quickly.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="bg-card/70 backdrop-blur-lg rounded-2xl shadow-lg p-8 space-y-6 border border-border">
            <div>
              <Label htmlFor="name" className={errors.name ? 'text-destructive' : ''}>Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="mt-2"
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email" className={errors.email ? 'text-destructive' : ''}>Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-2"
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="message" className={errors.message ? 'text-destructive' : ''}>Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message..."
                required
                className="mt-2 h-32 resize-none"
              />
              {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Message'}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
