"use client";

import type { FontType } from "@/lib/draw";

interface ControlsProps {
  mainChar: string;
  subtitle: string;
  font: FontType;
  onMainCharChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onFontChange: (value: FontType) => void;
  onDownloadPng: () => void;
  onDownloadSvg: () => void;
}

export function Controls({
  mainChar,
  subtitle,
  font,
  onMainCharChange,
  onSubtitleChange,
  onFontChange,
  onDownloadPng,
  onDownloadSvg,
}: ControlsProps) {
  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          メイン文字（1文字）
        </label>
        <input
          type="text"
          value={mainChar}
          onChange={(e) => onMainCharChange(e.target.value.slice(0, 1))}
          maxLength={1}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md text-2xl text-center font-[family-name:var(--font-noto-serif-jp)] focus:outline-none focus:ring-2 focus:ring-neutral-400"
          placeholder="チ"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          サブタイトル
        </label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-md font-[family-name:var(--font-noto-serif-jp)] focus:outline-none focus:ring-2 focus:ring-neutral-400"
          placeholder="地球の運動について"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          フォント
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onFontChange("mincho")}
            className={`flex-1 px-3 py-2 rounded-md border text-sm transition-colors ${
              font === "mincho"
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
            }`}
          >
            太明朝
          </button>
          <button
            onClick={() => onFontChange("brush")}
            className={`flex-1 px-3 py-2 rounded-md border text-sm transition-colors ${
              font === "brush"
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
            }`}
          >
            毛筆風
          </button>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={onDownloadPng}
          className="flex-1 px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors text-sm font-medium"
        >
          PNG ダウンロード
        </button>
        <button
          onClick={onDownloadSvg}
          className="flex-1 px-4 py-2 bg-white text-neutral-900 border border-neutral-300 rounded-md hover:bg-neutral-100 transition-colors text-sm font-medium"
        >
          SVG ダウンロード
        </button>
      </div>
    </div>
  );
}
