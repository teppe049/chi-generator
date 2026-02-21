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

  // --- Layout ---
  const mainFontSize = Math.floor(width * 0.7);
  const mainX = width * 0.47;
  const mainY = height * 0.32;

  ctx.font = `900 ${mainFontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const mainMetrics = ctx.measureText(char);
  const charRight = mainX + mainMetrics.width / 2;

  // 。circle
  const circleRadius = width * 0.075;
  const circleX = charRight + circleRadius * 0.35;
  const circleY = mainY + mainFontSize * 0.40;
  const circleLineWidth = width * 0.014;

  // Orbit - center slightly above the circle so it crosses diagonally
  const orbitCX = width * 0.44;
  const orbitCY = circleY + height * 0.01;
  const orbitRX = width * 0.39;
  const orbitRY = height * 0.115;
  const orbitRot = -0.12;
  const orbitLW = width * 0.007;

  // ===========================
  // DRAWING - layered approach
  // ===========================

  // 1. Draw full orbit ellipse (background layer)
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = orbitLW;
  ctx.beginPath();
  ctx.ellipse(orbitCX, orbitCY, orbitRX, orbitRY, orbitRot, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 2. White mask behind character area
  ctx.save();
  ctx.fillStyle = "#ffffff";
  const maskPadX = width * 0.02;
  const maskLeft = mainX - mainMetrics.width / 2 - maskPadX;
  const maskTop = mainY - mainFontSize * 0.55;
  const maskW = mainMetrics.width + maskPadX * 2;
  const maskH = mainFontSize * 0.9;
  ctx.fillRect(maskLeft, maskTop, maskW, maskH);
  ctx.restore();

  // 3. Redraw bottom arc of orbit (visible below character)
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = orbitLW;
  ctx.beginPath();
  ctx.ellipse(orbitCX, orbitCY, orbitRX, orbitRY, orbitRot, Math.PI * 0.06, Math.PI * 1.06);
  ctx.stroke();
  ctx.restore();

  // 4. Main character
  ctx.fillStyle = "#000000";
  ctx.font = `900 ${mainFontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, mainX, mainY);

  // 5. Mask ONLY the upper half of the circle area
  //    This hides the orbit behind the top of the circle,
  //    while leaving it visible across the bottom (threading effect)
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  // Upper-half semi-circle + padding for line width
  const maskR = circleRadius + circleLineWidth / 2 + orbitLW;
  ctx.arc(circleX, circleY, maskR, Math.PI * 1.15, Math.PI * 1.85); // upper portion
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 6. Draw circle outline
  ctx.save();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = circleLineWidth;
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 7. Subtitle
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
