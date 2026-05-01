"use client";

export default function BrowsePage() {
  return (
    <div style={{ width: "100vw", height: "100dvh", margin: 0, padding: 0, overflow: "hidden" }}>
      <iframe
        src="/webapp/index.html"
        title="Flash: Be Quick — Browse & Order"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        allow="geolocation; camera; microphone"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation"
      />
    </div>
  );
}
