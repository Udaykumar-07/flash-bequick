"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home');
    }, 3000); 

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <h1 className="font-headline text-6xl font-bold tracking-tighter text-white">Flash</h1>
    </div>
  );
}
