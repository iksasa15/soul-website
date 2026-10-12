import { ImageResponse } from "next/og";
import { LOGO_VIEWBOX, MARK_PIECES, MARK_VIEWBOX, TAGLINE_PATH, WORDMARK_PATH } from "@/components/brand/logo-paths";

export const alt = "SOUL — Innovating Critical Care";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#eaf4ff",
          background: "radial-gradient(circle at 80% 30%, #0b3a7a 0%, #041330 45%, #020a1a 100%)",
        }}
      >
        <svg width="520" height="520" viewBox={MARK_VIEWBOX} style={{ position: "absolute", right: -40, top: 55, opacity: 0.16 }}>
          {MARK_PIECES.map((p) => (
            <path key={p.id} d={p.d} fill={p.tone === "sky" ? "#00aeef" : "#3b8cff"} />
          ))}
        </svg>
        <svg width="372" height="138" viewBox={LOGO_VIEWBOX}>
          <path d={WORDMARK_PATH} fill="#ffffff" />
          <path d={TAGLINE_PATH} fill="#29b6f0" />
          {MARK_PIECES.map((p) => (
            <path key={p.id} d={p.d} fill={p.tone === "sky" ? "#00aeef" : "#1166a8"} />
          ))}
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>Innovating</div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, color: "#00aeef" }}>Critical Care</div>
          <div style={{ marginTop: 28, fontSize: 28, color: "#9cb4cf" }}>AI Smart Systems · Medical Devices · RFID Solutions</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#9cb4cf" }}>Sultanate of Oman</div>
      </div>
    ),
    size,
  );
}
