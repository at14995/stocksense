import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Bot, LineChart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: <LineChart className="h-8 w-8 text-primary" />,
    title: 'Personalized Dashboard',
    description: 'Get a tailored view of the market with key data and insights relevant to your portfolio.',
    image: PlaceHolderImages.find((img) => img.id === 'feature-dashboard'),
  },
  {
    icon: <ShoppingCart className="h-8 w-8 text-primary" />,
    title: 'Curated Marketplace',
    description: 'Explore products and services that can help you on your investment journey.',
    image: PlaceHolderImages.find((img) => img.id === 'feature-marketplace'),
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI Sentiment Analysis',
    description: 'Leverage cutting-edge AI to understand market sentiment and make informed decisions.',
    image: PlaceHolderImages.find((img) => img.id === 'feature-sentiment'),
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'landing-hero');

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="relative grid grid-cols-1 items-center gap-8 overflow-hidden rounded-lg border bg-card shadow-lg md:grid-cols-2 lg:h-[60vh]">
        <div className="p-8 md:p-12">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl">
            Navigate the Market with Confidence
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Stock Sense uses AI to analyze market sentiment, giving you a
            powerful edge for your investment strategy.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/dashboard">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        <div className="relative h-64 w-full md:h-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent md:bg-gradient-to-r"></div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold">
            Features Built for Modern Investors
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Everything you need to stay ahead in the fast-paced world of stock
            trading.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col overflow-hidden transition-shadow hover:shadow-xl">
              <CardHeader className="flex flex-row items-center gap-4">
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
              {feature.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={feature.image.imageUrl}
                    alt={feature.image.description}
                    fill
                    className="object-cover"
                    data-ai-hint={feature.image.imageHint}
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
