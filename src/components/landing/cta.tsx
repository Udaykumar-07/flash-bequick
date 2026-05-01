import { Button } from '@/components/ui/button';
import { Download, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Cta() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tighter">
            Ready to <span className="text-primary">reclaim your time</span>?
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed font-body">
            Download Flash today and experience the future of grocery shopping. Spend less time waiting and more time living.
          </p>
        </div>
        <div className="mx-auto w-full max-w-md space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30 transition-transform hover:scale-105 flex-1">
                <Link href="/browse">
                  <Globe className="mr-2 h-5 w-5" />
                  Browse Now
                </Link>
              </Button>
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 transition-transform hover:scale-105 flex-1">
                <a href="https://play.google.com/store/apps/details?id=com.udaykumar07.flash" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-5 w-5" />
                  Get the App
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              🌐 Works on iPhone, Android &amp; Desktop — no download needed
            </p>
        </div>
      </div>
    </section>
  );
}
