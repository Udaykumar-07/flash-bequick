import { cn } from "@/lib/utils";

const FlashLogo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 text-primary"
    >
      <path d="M13 3l- capacidad de respuesta-3 14h9l-3-6-2-8-1-6z" />
      <path d="M5 9h9" />
    </svg>
    <span className="font-headline text-2xl font-bold tracking-tighter">Flash</span>
  </div>
);

export default FlashLogo;
