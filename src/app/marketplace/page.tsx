import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

const products = [
  {
    title: 'Financial News Pro',
    description: 'Stay ahead with real-time, premium financial news and analysis.',
    price: '$29.99/mo',
    image: PlaceHolderImages.find((img) => img.id === 'marketplace-item-1'),
  },
  {
    title: 'Advanced Trading Toolkit',
    description: 'Unlock powerful charting and analysis tools for expert traders.',
    price: '$99 one-time',
    image: PlaceHolderImages.find((img) => img.id === 'marketplace-item-2'),
  },
  {
    title: 'The Value Investor eBook',
    description: 'A comprehensive guide to long-term value investing strategies.',
    price: '$19.99',
    image: PlaceHolderImages.find((img) => img.id === 'marketplace-item-3'),
  },
  {
    title: 'Advisor Session',
    description: 'A one-on-one session with a certified financial advisor.',
    price: '$250/hr',
    image: PlaceHolderImages.find((img) => img.id === 'marketplace-item-4'),
  },
  {
    title: 'Stock Screener Plus',
    description: 'Filter and find stocks that match your exact criteria with our advanced tool.',
    price: '$14.99/mo',
    image: PlaceHolderImages.find((img) => img.id === 'marketplace-item-5'),
  },
  {
    title: 'Portfolio Mastery Course',
    description: 'Learn to build and manage a diversified, high-performance portfolio.',
    price: '$499',
    image: PlaceHolderImages.find((img) => img.id === 'marketplace-item-6'),
  },
];

export default function MarketplacePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
        Marketplace
      </h1>
      <p className="mt-2 text-muted-foreground">
        Tools and resources to elevate your investment strategy.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.title} className="flex flex-col overflow-hidden">
            {product.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={product.image.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                  data-ai-hint={product.image.imageHint}
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{product.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{product.description}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <span className="text-lg font-semibold">{product.price}</span>
              <Button>Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
