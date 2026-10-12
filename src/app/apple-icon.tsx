import { ImageResponse } from "next/og";
import { MARK_PIECES, MARK_VIEWBOX } from "@/components/brand/logo-paths";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        <svg width="128" height="128" viewBox={MARK_VIEWBOX}>
          {MARK_PIECES.map((p) => (
            <path key={p.id} d={p.d} fill={p.tone === "sky" ? "#00aeef" : "#00416b"} />
          ))}
        </svg>
      </div>
    ),
    size,
  );
}
