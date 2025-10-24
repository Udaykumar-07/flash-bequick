import { cn } from "@/lib/utils";

const FlashLogo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center", className)}>
    <span className="font-headline text-2xl font-bold tracking-tighter">Flash</span>
  </div>
);

export default FlashLogo;
