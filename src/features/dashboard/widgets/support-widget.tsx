'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';

export function SupportWidget() {
  return (
    <div>
      <Card className="bg-[#121521]/95 border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <HelpCircle className="h-5 w-5" />
            <span>Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Need help? Our support team typically responds within 24 hours.
          </p>
          <div className="flex gap-4">
            <Button asChild className="flex-1">
              <Link href="/support">Open Ticket</Link>
            </Button>
            <Button asChild variant="secondary" className="flex-1">
              <Link href="/support#faq">Read FAQs</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
