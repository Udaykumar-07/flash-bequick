import type { Metadata } from 'next';

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ restaurantId: string }>;
  searchParams: Promise<{ name?: string }>;
}): Promise<Metadata> {
  const { restaurantId } = await params;
  const { name } = await searchParams;
  const restaurantName = name ? decodeURIComponent(name) : 'Restaurant Menu';
  return {
    title: `${restaurantName} — Flash: Be Quick`,
    description: `Browse the menu and order from ${restaurantName} on Flash: Be Quick. Scan QR, add items, and get VIP Express Pickup in 5 minutes.`,
  };
}

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
