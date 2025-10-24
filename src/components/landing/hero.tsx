import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Download } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-groceries');

  return (
    <section className="relative w-full min-h-dvh flex items-center justify-center pt-24 md:pt-20">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left animate-in fade-in slide-in-from-bottom-12 duration-700">
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter">
              Flash: <span className="text-primary">Be Quick.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-body max-w-2xl mx-auto md:mx-0">
              Skip the line, not your groceries. Order ahead from local stores and pick up when it suits you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 transition-transform hover:scale-105" id="download">
                <a href="/download/version1.apk" download>
                  <Download className="mr-2 h-5 w-5" />
                  Download Now
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Free to use. No hidden charges.</p>
          </div>
          <div className="flex justify-center animate-in fade-in zoom-in-95 duration-700 delay-200">
            {heroImage && (
              <div className="relative w-full max-w-md lg:max-w-lg aspect-[4/3] transform-gpu transition-transform hover:scale-105 duration-300">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary to-accent rounded-3xl opacity-20 blur-2xl"></div>
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  data-ai-hint={heroImage.imageHint}
                  className="rounded-3xl object-cover shadow-2xl shadow-primary/20 border-4 border-white/10"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
