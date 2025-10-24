import Link from 'next/link';
import FlashLogo from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" aria-label="Flash homepage">
          <FlashLogo />
        </Link>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 transition-transform hover:scale-105">
          <a href="/download/version1.apk" download>
            <Download className="mr-2 h-4 w-4" />
            Download App
          </a>
        </Button>
      </div>
    </header>
  );
}
