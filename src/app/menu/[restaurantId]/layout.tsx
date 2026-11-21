import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}): Promise<Metadata> {
  const { restaurantId } = await params;
  return {
    title: 'Restaurant Menu — Flash: Be Quick',
    description: 'Browse the menu and order on Flash: Be Quick. Scan QR, add items, and get VIP Express Pickup in 5 minutes.',
  };
}

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
