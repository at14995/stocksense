import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
        Dashboard
      </h1>
      <div className="mt-8 grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to your Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is where your personalized stock market data and user-specific information will be displayed.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
