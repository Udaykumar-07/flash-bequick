"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
      <div className="flex flex-col items-center">
        <div className="flex items-center">
          <span className="text-6xl font-bold text-white">FLA</span>
          <svg
            className="h-14 w-14 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M11.3 3.3a1 1 0 00-1.6 1.2l3.57 5.5H4a1 1 0 000 2h9.27l-3.57 5.5a1 1 0 101.6 1.2l5-7.75a1 1 0 000-1.2l-5-7.75z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-6xl font-bold text-white">H</span>
        </div>
        <p className="mt-2 text-lg text-white">-be Quick</p>
      </div>
    </div>
  );
}
