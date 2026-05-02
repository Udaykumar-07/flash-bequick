"use client";

import { useEffect, useState } from "react";

export default function BrowsePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
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
          src="/app-entry/"
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
