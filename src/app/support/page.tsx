import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
        Support
      </h1>
      <div className="mt-8 grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>How can we help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is where support information, FAQs, and contact details will be available.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
