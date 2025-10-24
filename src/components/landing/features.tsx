import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Store, PackageCheck, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: ShoppingCart,
    title: 'Order on the Go',
    description: 'Browse your favorite local grocery stores and place your pickup order in just a few taps.',
  },
  {
    icon: Store,
    title: 'Shop Status',
    description: 'Never waste a trip. See which stores are open or closed in real-time before you place an order.',
  },
  {
    icon: PackageCheck,
    title: 'Live Order Tracking',
    description: 'From "Pending" to "Ready for Pickup", follow your order\'s journey so you know exactly when to head out.',
  },
  {
    icon: Zap,
    title: '24-Hour Pickup',
    description: 'Life is busy. Pick up your order anytime within 24 hours. Ultimate convenience, on your schedule.',
  },
];

export default function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-body text-primary font-medium">Key Features</div>
          <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tighter">
            Everything you need, <span className="text-primary">nothing you don't.</span>
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-body">
            Flash is designed to be simple, fast, and free. We get you in and out of the store in a flash, saving you time for what really matters.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border-border hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-12" style={{animationDelay: `${index * 100}ms`}}>
              <CardHeader className="flex flex-col items-start gap-4 p-6">
                 <div className="bg-primary/10 p-3 rounded-full">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="font-body text-muted-foreground p-6 pt-0">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
