import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flash: Be Quick — Browse & Order',
  description: 'Browse local stores, add items to cart, and schedule your pickup — all from your browser. No app download needed.',
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
