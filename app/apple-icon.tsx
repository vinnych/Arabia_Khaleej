import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: 36,
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
