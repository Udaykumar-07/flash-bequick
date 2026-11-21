"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";

function MenuLoading() {
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

/**
 * /menu/[restaurantId]?name=RestaurantName
 *
 * This page renders the Expo web app inside an iframe and deep-links it
 * directly to the RestaurantMenu screen for the given restaurant.
 *
 * The restaurant ID and name are injected into the iframe via the URL hash
 * and query parameters so the Expo app can read them on load and navigate
 * to the correct screen.
 *
 * URL format:  flashbequick.in/menu/vendor-Id-66227?name=My+Restaurant
 * QR code should encode that full URL.
 */
function MenuContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  const restaurantId = Array.isArray(params?.restaurantId)
    ? params.restaurantId[0]
    : params?.restaurantId ?? "";

  const restaurantName = searchParams?.get("name") ?? "";

  useEffect(() => {
    setIsMounted(true);

    const handleMessage = (event: MessageEvent) => {
      try {
        if (event.data?.type === 'FLASH_NAVIGATE_BROWSE') {
          window.location.href = '/browse';
        }
      } catch (_) {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!isMounted) {
    return <MenuLoading />;
  }

  // Encode the restaurant info as both query string and hash fragment
  // so the Expo Router SPA resolves it reliably without interference.
  const hashParams = new URLSearchParams();
  hashParams.set("restaurantId", restaurantId);
  if (restaurantName) hashParams.set("restaurantName", restaurantName);
  const iframeSrc = `/app-entry/?${hashParams.toString()}#menu?${hashParams.toString()}`;

  return (
    <>
      <style>{`html, body { margin: 0; padding: 0; overflow: hidden; }`}</style>
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
        <iframe
          src={iframeSrc}
          title={`${restaurantName || "Restaurant"} — Flash: Be Quick`}
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

export default function RestaurantMenuPage() {
  return (
    <Suspense fallback={<MenuLoading />}>
      <MenuContent />
    </Suspense>
  );
}
