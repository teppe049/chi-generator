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

  // Main character - large, upper center
  const mainFontSize = Math.floor(width * 0.55);
  ctx.font = `900 ${mainFontSize}px ${fontFamily}`;

  const mainY = height * 0.38;
  const char = mainChar.slice(0, 1) || "チ";
  ctx.fillText(char, width / 2, mainY);

  // Measure main char to position the 。
  const mainMetrics = ctx.measureText(char);
  const mainCharWidth = mainMetrics.width;

  // 。- smaller, positioned at bottom-right of main char
  const periodFontSize = Math.floor(mainFontSize * 0.35);
  ctx.font = `900 ${periodFontSize}px ${fontFamily}`;
  const periodX = width / 2 + mainCharWidth / 2 + periodFontSize * 0.15;
  const periodY = mainY + mainFontSize * 0.32;
  ctx.fillText("。", periodX, periodY);

  // Subtitle with dashes: − subtitle −
  if (subtitle) {
    const subtitleFontSize = Math.floor(width * 0.055);
    ctx.font = `900 ${subtitleFontSize}px ${fontFamily}`;

    const subtitleText = `−${subtitle}−`;
    const subtitleY = height * 0.78;
    ctx.fillText(subtitleText, width / 2, subtitleY);
  }
}
