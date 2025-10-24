import { cn } from "@/lib/utils";
import Image from "next/image";

const FlashLogo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <Image
      src="/logo.png"
      alt="Flash logo"
      width={32}
      height={32}
      className="h-8 w-8"
    />
    <span className="font-headline text-2xl font-bold tracking-tighter">Flash</span>
  </div>
);

export default FlashLogo;
