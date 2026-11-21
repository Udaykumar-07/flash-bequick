"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function BrowseLoading() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#020617",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: "4px solid rgba(59,130,246,0.2)",
          borderTopColor: "#3b82f6",
          borderRadius: "50%",
          animation: "spin 0.75s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function BrowseContent() {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();

  // Listen for navigation messages from the embedded Expo web app iframe
  // to keep the outer browser URL synchronized.
  useEffect(() => {
    setIsMounted(true);

    const handleMessage = (event: MessageEvent) => {
      try {
        if (event.data?.type === 'FLASH_NAVIGATE_MENU' && event.data.restaurantId) {
          const restId = encodeURIComponent(event.data.restaurantId);
          const nameParam = event.data.restaurantName
            ? `?name=${encodeURIComponent(event.data.restaurantName)}`
            : '';
          const newUrl = `/menu/${restId}${nameParam}`;
          window.history.pushState({ restaurantId: event.data.restaurantId }, '', newUrl);
        } else if (event.data?.type === 'FLASH_NAVIGATE_BROWSE') {
          window.history.pushState(null, '', '/browse');
        }
      } catch (_) {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!isMounted) {
    return <BrowseLoading />;
  }

  // If a restaurantId is passed in search query (e.g. /browse?restaurantId=vendor-Id-66227),
  // forward it to the iframe as a deep-link hash and query param.
  const queryRestId = searchParams?.get('restaurantId') || searchParams?.get('shopId');
  const queryRestName = searchParams?.get('restaurantName') || searchParams?.get('name');
  let iframeSrc = '/app-entry/';
  if (queryRestId) {
    const hashParams = new URLSearchParams();
    hashParams.set('restaurantId', queryRestId);
    if (queryRestName) hashParams.set('restaurantName', queryRestName);
    iframeSrc = `/app-entry/?${hashParams.toString()}#menu?${hashParams.toString()}`;
  }

  return (
    <>
      {/* Ensure proper mobile viewport scaling */}
      <style>{`
        html, body { margin: 0; padding: 0; overflow: hidden; }
      `}</style>
      <div
        style={{
          width: "100vw",
          height: "100dvh",
          margin: 0,
          padding: 0,
          overflow: "hidden",
          backgroundColor: "#020617",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        {/* 
          No sandbox attribute — Firebase Auth needs full cookie/localStorage access.
          Using /app-entry/ which is rewritten to serve the Expo web build's index.html 
          at a clean root-like path so Expo Router resolves to "/" correctly.
        */}
        <iframe
          src={iframeSrc}
          title="Flash: Be Quick — Browse & Order"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
          }}
          allow="geolocation; camera; microphone; storage-access"
        />
      </div>
    </>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowseLoading />}>
      <BrowseContent />
    </Suspense>
  );
}
