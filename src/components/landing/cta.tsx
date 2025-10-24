import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

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
        <div className="mx-auto w-full max-w-sm space-y-2">
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 transition-transform hover:scale-105 w-full">
                <a href="/download/Flash:BeQuick.apk" download>
                  <Download className="mr-2 h-5 w-5" />
                  Get the App for Free
                </a>
            </Button>
        </div>
      </div>
    </section>
  );
}
