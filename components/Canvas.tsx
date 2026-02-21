"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { draw, type FontType } from "@/lib/draw";

interface CanvasProps {
  mainChar: string;
  subtitle: string;
  font: FontType;
}

export interface CanvasHandle {
  getCanvas: () => HTMLCanvasElement | null;
}

const CANVAS_SIZE = 800;

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(
  function Canvas({ mainChar, subtitle, font }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }));

    useEffect(() => {
      document.fonts.ready.then(() => setFontsLoaded(true));
    }, []);

    useEffect(() => {
      if (!fontsLoaded) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      draw(ctx, {
        mainChar,
        subtitle,
        font,
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
      });
    }, [mainChar, subtitle, font, fontsLoaded]);

    return (
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="w-full max-w-md border border-neutral-200 rounded-lg shadow-sm bg-white"
      />
    );
  }
);
