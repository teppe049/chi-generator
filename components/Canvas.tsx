"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
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

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }));

    useEffect(() => {
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
    }, [mainChar, subtitle, font]);

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
