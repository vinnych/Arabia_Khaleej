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
          background: "#7c1c2e",
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* White serrated left band — Qatar flag style */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="32"
          height="32"
          style={{ position: "absolute", inset: 0 }}
        >
          <path
            d="M0 0 L9 0 L12 3.2 L9 6.4 L12 9.6 L9 12.8 L12 16 L9 19.2 L12 22.4 L9 25.6 L12 28.8 L9 32 L0 32 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
