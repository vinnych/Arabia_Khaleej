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
          background: "#7c1c2e",
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 180 180"
          width="180"
          height="180"
          style={{ position: "absolute", inset: 0 }}
        >
          {/* White serrated band — Qatar flag proportions */}
          <path
            d="M0 0 L50 0 L68 18 L50 36 L68 54 L50 72 L68 90 L50 108 L68 126 L50 144 L68 162 L50 180 L0 180 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
