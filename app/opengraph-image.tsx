import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Qatar Portal — Prayer Times, Jobs & News";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #003fa4 0%, #0056d2 50%, #0078f0 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Subtle grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div style={{ fontSize: 80, fontWeight: 900, color: "#ffffff", letterSpacing: -2, marginBottom: 16 }}>
          QATAR PORTAL
        </div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.8)", marginBottom: 48, letterSpacing: 6, fontWeight: 500 }}>
          Prayer Times · Jobs · News
        </div>
        <div
          style={{
            display: "flex",
            gap: 32,
            fontSize: 20,
            color: "#fff",
            background: "rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: "16px 36px",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <span>🕌 Doha Prayer Times</span>
          <span>💼 Qatar Jobs</span>
          <span>📰 Gulf News</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
