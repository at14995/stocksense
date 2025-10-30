'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type FAQItem = {
  q: string;
  a: React.ReactNode;
};

const defaultItems: FAQItem[] = [
  {
    q: 'How often are prices updated?',
    a: 'Live market prices are updated approximately every 30 seconds to give you near real-time data.',
  },
  {
    q: 'Where does the financial data come from?',
    a: 'We source our data from a variety of reputable financial data providers to ensure accuracy and reliability. For more details, please visit our support page.',
  },
  {
    q: 'How are sentiment scores computed?',
    a: 'Our AI analyzes thousands of news articles, social media posts, and financial reports, assigning a sentiment score from -1 (very negative) to +1 (very positive).',
  },
  {
    q: 'How do alerts notify me?',
    a: 'You can configure alerts to notify you via email, in-app notifications, or both, ensuring you never miss a critical price movement.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes, your privacy is our priority. All your data, including watchlists and profile information, is encrypted and securely stored. Read our Privacy Policy for more.',
  },
];

type FAQAccordionProps = {
  className?: string;
  items?: FAQItem[];
};

export function FAQAccordion({
  className,
  items = defaultItems,
}: FAQAccordionProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-muted-foreground">
            Find answers to common questions. For more, visit our{' '}
            <Link href="/support" className="text-primary hover:underline">
              support page
            </Link>
            .
          </p>
        </div>
        <Accordion type="single" collapsible className="mt-12 w-full">
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
