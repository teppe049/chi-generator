"use client";

import { useRef, useState, useCallback } from "react";
import { Canvas, type CanvasHandle } from "./Canvas";
import { Controls } from "./Controls";
import type { FontType } from "@/lib/draw";

export function Generator() {
  const [mainChar, setMainChar] = useState("チ");
  const [subtitle, setSubtitle] = useState("地球の運動について");
  const [font, setFont] = useState<FontType>("mincho");
  const canvasRef = useRef<CanvasHandle>(null);

  const handleDownloadPng = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${mainChar || "チ"}。.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [mainChar]);

  const handleDownloadSvg = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
  <image href="${dataUrl}" width="800" height="800"/>
</svg>`;

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.download = `${mainChar || "チ"}。.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }, [mainChar]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg">
      <Canvas
        ref={canvasRef}
        mainChar={mainChar}
        subtitle={subtitle}
        font={font}
      />
      <Controls
        mainChar={mainChar}
        subtitle={subtitle}
        font={font}
        onMainCharChange={setMainChar}
        onSubtitleChange={setSubtitle}
        onFontChange={setFont}
        onDownloadPng={handleDownloadPng}
        onDownloadSvg={handleDownloadSvg}
      />
    </div>
  );
}
