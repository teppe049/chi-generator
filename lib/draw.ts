export type FontType = "mincho" | "brush";

export interface DrawOptions {
  mainChar: string;
  subtitle: string;
  font: FontType;
  width: number;
  height: number;
}

function getFontFamily(font: FontType): string {
  return font === "mincho"
    ? `"Noto Serif JP", serif`
    : `"Zen Antique", serif`;
}

export function draw(ctx: CanvasRenderingContext2D, options: DrawOptions) {
  const { mainChar, subtitle, font, width, height } = options;
  const fontFamily = getFontFamily(font);
  const char = mainChar.slice(0, 1) || "チ";

  // Clear
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // --- Layout calculations ---
  // Main char occupies roughly top 60% of canvas
  const mainFontSize = Math.floor(width * 0.65);
  const mainX = width * 0.48;
  const mainY = height * 0.35;

  // Measure main char
  ctx.font = `900 ${mainFontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const mainMetrics = ctx.measureText(char);
  const charRight = mainX + mainMetrics.width / 2;

  // 。(geometric circle) - positioned at bottom-right of main char
  const circleRadius = width * 0.055;
  const circleX = charRight + circleRadius * 0.3;
  const circleY = mainY + mainFontSize * 0.33;
  const circleLineWidth = width * 0.006;

  // Orbital ellipse parameters
  // The ellipse is centered roughly around the 。, tilted, and wide
  const orbitCenterX = width * 0.45;
  const orbitCenterY = circleY - height * 0.01;
  const orbitRadiusX = width * 0.35;
  const orbitRadiusY = height * 0.13;
  const orbitRotation = -0.18; // slight counter-clockwise tilt
  const orbitLineWidth = width * 0.004;

  // --- Step 1: Draw the full orbital ellipse ---
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = orbitLineWidth;
  ctx.beginPath();
  ctx.ellipse(
    orbitCenterX, orbitCenterY,
    orbitRadiusX, orbitRadiusY,
    orbitRotation,
    0, Math.PI * 2
  );
  ctx.stroke();
  ctx.restore();

  // --- Step 2: White-out behind the main character area ---
  // This makes the orbit appear "behind" the character
  ctx.save();
  ctx.fillStyle = "#ffffff";
  const maskLeft = mainX - mainMetrics.width / 2 - width * 0.03;
  const maskTop = mainY - mainFontSize * 0.52;
  const maskW = mainMetrics.width + width * 0.06;
  const maskH = mainFontSize * 0.88;
  ctx.fillRect(maskLeft, maskTop, maskW, maskH);
  ctx.restore();

  // --- Step 3: Redraw the bottom portion of the orbit (in front of mask) ---
  // This is the part visible below the character
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = orbitLineWidth;
  ctx.beginPath();
  ctx.ellipse(
    orbitCenterX, orbitCenterY,
    orbitRadiusX, orbitRadiusY,
    orbitRotation,
    Math.PI * 0.42, Math.PI * 1.05
  );
  ctx.stroke();
  ctx.restore();

  // --- Step 4: Draw the main character ---
  ctx.fillStyle = "#000000";
  ctx.font = `900 ${mainFontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, mainX, mainY);

  // --- Step 5: Draw 。as geometric circle ---
  // First, white-fill the circle area to cut the orbit line behind it
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius + circleLineWidth, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Draw the circle outline
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = circleLineWidth;
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // --- Step 6: Redraw orbit segments that pass in front of/through the 。---
  // The orbit line enters from the left side and exits from the right side of the circle
  // We need to find the intersection angles and draw the orbit outside the circle

  // Draw orbit arc that appears to connect to the circle
  // Left entry arc (from bottom-left sweeping to the circle)
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = orbitLineWidth;
  ctx.beginPath();
  ctx.ellipse(
    orbitCenterX, orbitCenterY,
    orbitRadiusX, orbitRadiusY,
    orbitRotation,
    -0.08, Math.PI * 0.42
  );
  ctx.stroke();
  ctx.restore();

  // Right exit arc (from the circle sweeping to top-right)
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = orbitLineWidth;
  ctx.beginPath();
  ctx.ellipse(
    orbitCenterX, orbitCenterY,
    orbitRadiusX, orbitRadiusY,
    orbitRotation,
    Math.PI * 1.05, Math.PI * 1.92
  );
  ctx.stroke();
  ctx.restore();

  // --- Step 7: Subtitle ---
  if (subtitle) {
    const subtitleFontSize = Math.floor(width * 0.05);
    ctx.fillStyle = "#000000";
    ctx.font = `900 ${subtitleFontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const subtitleText = `−${subtitle}−`;
    const subtitleY = height * 0.82;
    ctx.fillText(subtitleText, width / 2, subtitleY);
  }
}
