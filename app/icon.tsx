import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Next.js serves this as /icon.png — used as favicon
export default function Icon() {
  return new ImageResponse(
    (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: "#0f172a", // Slate
            display: "flex",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Gold accent strip */}
          <div
            style={{
              width: "25%",
              height: "100%",
              background: "#d4af37", // Gold
            }}
          />
        </div>
    ),
    { ...size }
  );
}
