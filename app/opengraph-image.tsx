import { ImageResponse } from "next/og";

export const alt = "Zachary Chung, software engineer in LA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const pine = (s: number, color: string) => (
  <svg width={s} height={s} viewBox="0 0 32 32" key={`${s}-${color}`}>
    <path
      d="M16 3 L24 14 L20.5 14 L26 22 L18.5 22 L18.5 26 L13.5 26 L13.5 22 L6 22 L11.5 14 L8 14 Z"
      fill={color}
    />
    <rect x="13.5" y="24" width="5" height="5" rx="1.4" fill="#8a6b4a" />
  </svg>
);

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f7f2e7",
          color: "#33413a",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 18, marginBottom: 28 }}>
          {pine(64, "#93ab5e")}
          {pine(88, "#7c9a4a")}
          {pine(64, "#5f7d3c")}
        </div>
        <div style={{ fontSize: 88, fontWeight: 700 }}>Zachary Chung</div>
        <div style={{ fontSize: 36, marginTop: 16, color: "#5b6b60" }}>
          Software engineer in LA
        </div>
      </div>
    ),
    size,
  );
}
