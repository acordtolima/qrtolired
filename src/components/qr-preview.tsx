import { useEffect, useRef } from "react";
import type { CornerStyle, DotStyle } from "@/lib/qr/types";

/** Lado en píxeles del PNG descargado (apto para impresión). */
const DOWNLOAD_SIZE = 2048;

type Props = {
  data: string;
  fg: string;
  bg: string;
  accent: string;
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  logo: string | null;
  size?: number;
  type?: "canvas" | "svg";
  onReady?: (api: { download: (ext: "png" | "svg") => Promise<void> } | null) => void;
};

export function QrPreview({
  data,
  fg,
  bg,
  accent,
  dotStyle,
  cornerStyle,
  logo,
  size = 280,
  type = "canvas",
  onReady,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const ready = useRef(onReady);
  ready.current = onReady;

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let dead = false;
    node.replaceChildren();
    void (async () => {
      const { default: QRCodeStyling } = await import("qr-code-styling");
      if (dead || !host.current) return;
      const options = (px: number, margin: number) => ({
        width: px,
        height: px,
        data: data || "Sello",
        margin,
        image: logo || undefined,
        qrOptions: { errorCorrectionLevel: (logo ? "H" : "Q") as "H" | "Q" },
        dotsOptions: { type: dotStyle, color: fg },
        backgroundOptions: { color: bg },
        cornersSquareOptions: { type: cornerStyle, color: accent },
        cornersDotOptions: { type: (cornerStyle === "dot" ? "dot" : "square") as "dot" | "square", color: accent },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.38,
          margin: Math.round((4 * px) / 280),
          crossOrigin: "anonymous",
        },
      });
      const qr = new QRCodeStyling({ ...options(size, 8), type });
      host.current.replaceChildren();
      qr.append(host.current);
      ready.current?.({
        // Descarga en alta resolución, independiente del tamaño en pantalla.
        download: (ext) =>
          new QRCodeStyling({
            ...options(DOWNLOAD_SIZE, Math.round((8 * DOWNLOAD_SIZE) / 280)),
            type: ext === "svg" ? "svg" : "canvas",
          }).download({ name: "sello", extension: ext }),
      });
    })();
    return () => {
      dead = true;
      ready.current?.(null);
    };
  }, [data, fg, bg, accent, dotStyle, cornerStyle, logo, size, type]);

  return (
    <div
      ref={host}
      className="grid place-items-center [&_canvas]:h-auto [&_canvas]:max-w-full [&_svg]:h-auto [&_svg]:max-w-full"
    />
  );
}
