import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Qatar Portal — Prayer Times, Jobs & Utilities";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #8A1538 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter",
          color: "white",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 100, fontWeight: 900, letterSpacing: "-0.05em", marginBottom: "20px" }}>
          Qatar Portal
        </div>
        <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: "0.2em", opacity: 0.7, textTransform: "uppercase" }}>
          Prayer Times · Service Guides · Utilities
        </div>
        
        <div style={{ 
          display: "flex", 
          gap: "20px", 
          marginTop: "60px" 
        }}>
          <div style={{ background: "rgba(255,255,255,0.1)", padding: "12px 24px", borderRadius: "100px", fontSize: 18, border: "1px solid rgba(255,255,255,0.2)" }}>
            📍 Doha, Qatar
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", padding: "12px 24px", borderRadius: "100px", fontSize: 18, border: "1px solid rgba(255,255,255,0.2)" }}>
            ⚡ Public Services
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
