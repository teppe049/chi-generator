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

  // Clear
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const mainFontSize = Math.floor(width * 0.55);
  const mainY = height * 0.38;
  const char = mainChar.slice(0, 1) || "チ";

  // Measure main char for positioning
  ctx.font = `900 ${mainFontSize}px ${fontFamily}`;
  const mainMetrics = ctx.measureText(char);
  const mainCharWidth = mainMetrics.width;

  // 。position (needed for orbit calculation)
  const periodFontSize = Math.floor(mainFontSize * 0.35);
  const periodX = width / 2 + mainCharWidth / 2 + periodFontSize * 0.15;
  const periodY = mainY + mainFontSize * 0.32;

  // --- Orbital ellipse (behind the character) ---
  // Ellipse centered near the period, sweeping wide
  const orbitCenterX = width * 0.48;
  const orbitCenterY = periodY - height * 0.02;
  const orbitRadiusX = width * 0.38;
  const orbitRadiusY = height * 0.18;
  const orbitRotation = -0.15; // slight tilt

  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = width * 0.004;
  ctx.beginPath();
  ctx.ellipse(
    orbitCenterX,
    orbitCenterY,
    orbitRadiusX,
    orbitRadiusY,
    orbitRotation,
    0,
    Math.PI * 2
  );
  ctx.stroke();
  ctx.restore();

  // --- White-out behind the main character ---
  // Draw a white rect behind the char area so the orbit line appears behind
  ctx.save();
  ctx.fillStyle = "#ffffff";
  const charLeft = width / 2 - mainCharWidth / 2 - width * 0.02;
  const charTop = mainY - mainFontSize * 0.48;
  const charW = mainCharWidth + width * 0.04;
  const charH = mainFontSize * 0.85;
  ctx.fillRect(charLeft, charTop, charW, charH);
  ctx.restore();

  // --- Redraw orbit arc in front (the part that should appear in front of char) ---
  // The arc segment at the bottom-right that passes in front
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = width * 0.004;
  ctx.beginPath();
  // Only draw the bottom-right portion (roughly from 4 o'clock to 7 o'clock)
  ctx.ellipse(
    orbitCenterX,
    orbitCenterY,
    orbitRadiusX,
    orbitRadiusY,
    orbitRotation,
    Math.PI * 0.55,
    Math.PI * 0.95
  );
  ctx.stroke();
  ctx.restore();

  // --- Main character ---
  ctx.fillStyle = "#000000";
  ctx.font = `900 ${mainFontSize}px ${fontFamily}`;
  ctx.fillText(char, width / 2, mainY);

  // --- 。(period) ---
  // White circle background to "cut" the orbit line behind the period
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(periodX, periodY, periodFontSize * 0.48, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Draw the period character
  ctx.fillStyle = "#000000";
  ctx.font = `900 ${periodFontSize}px ${fontFamily}`;
  ctx.fillText("。", periodX, periodY);

  // --- Redraw orbit arc that passes in front of the period ---
  // The portion of the orbit that visually crosses over/near the 。
  // This creates the "thread through" effect seen in the original logo

  // --- Subtitle ---
  if (subtitle) {
    const subtitleFontSize = Math.floor(width * 0.055);
    ctx.font = `900 ${subtitleFontSize}px ${fontFamily}`;

    const subtitleText = `−${subtitle}−`;
    const subtitleY = height * 0.78;
    ctx.fillText(subtitleText, width / 2, subtitleY);
  }
}
