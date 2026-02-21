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
  const mainFontSize = Math.floor(width * 0.7);
  const mainX = width * 0.47;
  const mainY = height * 0.32;

  // Measure main char
  ctx.font = `900 ${mainFontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const mainMetrics = ctx.measureText(char);
  const charRight = mainX + mainMetrics.width / 2;

  // 。(geometric circle) - larger, positioned at bottom-right of main char
  const circleRadius = width * 0.065;
  const circleX = charRight + circleRadius * 0.6;
  const circleY = mainY + mainFontSize * 0.38;
  const circleLineWidth = width * 0.008;

  // Orbital ellipse - wide and flat, like a planetary orbit
  const orbitCenterX = width * 0.44;
  const orbitCenterY = circleY + height * 0.005;
  const orbitRadiusX = width * 0.39;
  const orbitRadiusY = height * 0.115;
  const orbitRotation = -0.12;
  const orbitLineWidth = width * 0.005;

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
  ctx.save();
  ctx.fillStyle = "#ffffff";
  const maskPadX = width * 0.02;
  const maskLeft = mainX - mainMetrics.width / 2 - maskPadX;
  const maskTop = mainY - mainFontSize * 0.55;
  const maskW = mainMetrics.width + maskPadX * 2;
  const maskH = mainFontSize * 0.9;
  ctx.fillRect(maskLeft, maskTop, maskW, maskH);
  ctx.restore();

  // --- Step 3: Redraw bottom arc of orbit (visible below the character) ---
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = orbitLineWidth;
  ctx.beginPath();
  ctx.ellipse(
    orbitCenterX, orbitCenterY,
    orbitRadiusX, orbitRadiusY,
    orbitRotation,
    Math.PI * 0.35, Math.PI * 1.0
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
  // White-fill to cut orbit behind the circle
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius + circleLineWidth * 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Circle outline
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = circleLineWidth;
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // --- Step 6: Redraw orbit arcs that should be visible around the circle ---
  // Arc from right side, sweeping up and behind character
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = orbitLineWidth;
  ctx.beginPath();
  ctx.ellipse(
    orbitCenterX, orbitCenterY,
    orbitRadiusX, orbitRadiusY,
    orbitRotation,
    -0.12, Math.PI * 0.35
  );
  ctx.stroke();
  ctx.restore();

  // Arc from bottom sweeping to the left and back up
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = orbitLineWidth;
  ctx.beginPath();
  ctx.ellipse(
    orbitCenterX, orbitCenterY,
    orbitRadiusX, orbitRadiusY,
    orbitRotation,
    Math.PI * 1.0, Math.PI * 1.88
  );
  ctx.stroke();
  ctx.restore();

  // --- Step 7: Subtitle ---
  if (subtitle) {
    const subtitleFontSize = Math.floor(width * 0.055);
    ctx.fillStyle = "#000000";
    ctx.font = `900 ${subtitleFontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const subtitleText = `−${subtitle}−`;
    const subtitleY = height * 0.85;
    ctx.fillText(subtitleText, width / 2, subtitleY);
  }
}
