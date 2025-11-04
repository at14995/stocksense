import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const tiers = [
  {
    name: 'Starter',
    price: '$0',
    priceSuffix: '/month',
    description: 'For individuals getting started with market analysis.',
    features: [
      { text: 'Watch up to 5 tickers', included: true },
      { text: 'Access basic sentiment data', included: true },
      { text: 'Receive email alerts only', included: true },
      { text: 'Read insights from analysts', included: true },
      { text: 'Unlimited Watchlists', included: false },
      { text: 'Advanced Sentiment Analytics', included: false },
      { text: 'Publish Market Insights', included: false },
    ],
    cta: {
      text: 'Get Started',
      href: '/auth'
    }
  },
  {
    name: 'Trader',
    price: '$14.99',
    priceSuffix: '/month',
    description: 'For active traders who need an edge.',
    features: [
      { text: 'Unlimited watchlists & alerts', included: true },
      { text: 'Real-time multi-channel alerts (Email, SMS, etc.)', included: true },
      { text: 'Advanced sentiment analytics', included: true },
      { text: 'Participate in community discussions', included: true },
      { text: 'Historical and predictive trends', included: true },
      { text: 'Publish Market Insights', included: false },
    ],
    cta: {
      text: 'Upgrade to Pro',
      href: '#' // Placeholder for Stripe/Billing integration
    },
    popular: true
  },
  {
    name: 'Analyst',
    price: '$29.99',
    priceSuffix: '/month',
    description: 'For creators who want to share their insights.',
    features: [
      { text: 'All features from Pro', included: true },
      { text: 'Create and publish market insights', included: true },
      { text: 'Grow your following and receive ratings', included: true },
      { text: 'Early access to new analytics APIs', included: true },
      { text: 'Higher alert limits and API export options', included: true },
    ],
    cta: {
      text: 'Apply as Analyst',
      href: '/pricing' // Placeholder as `/marketplace/apply` doesn't exist
    }
  },
];

export default function PricingPage() {
  return (
    <main className="flex flex-col items-center min-h-screen px-4 py-20 bg-transparent">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Choose the Plan That Fits You</h1>
        <p className="text-gray-300 leading-relaxed">
          Upgrade for real-time alerts, advanced analytics, and professional insights.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {tiers.map((tier) => (
          <Card key={tier.name} className={cn(
            "flex flex-col bg-[#0E0E12]/90 backdrop-blur-sm shadow-xl border-white/10 transition-all duration-300 hover:border-primary/50 hover:shadow-primary/20 hover:scale-[1.02]",
            tier.popular && "border-primary/50 shadow-primary/20"
          )}>
            {tier.popular && (
              <Badge className="absolute -top-3 right-4">Most Popular</Badge>
            )}
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-semibold">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="flex items-baseline pt-4">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground ml-2">{tier.priceSuffix}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-6 pt-0">
              <ul className="space-y-3">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {feature.included ? (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <span className={cn(!feature.included && 'text-muted-foreground line-through')}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-6">
              <Button asChild className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                <Link href={tier.cta.href}>{tier.cta.text}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
