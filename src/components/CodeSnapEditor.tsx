"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { codeToHtml } from "shiki";
import { toPng, toSvg } from "html-to-image";

const BACKGROUNDS = [
  { name: "Sunset", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Ocean", value: "linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)" },
  { name: "Fire", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Forest", value: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
  { name: "Night", value: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" },
  { name: "Candy", value: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" },
  { name: "Peach", value: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
  { name: "Arctic", value: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)" },
  { name: "None", value: "transparent" },
];

const THEMES = [
  "github-dark",
  "github-light",
  "dracula",
  "one-dark-pro",
  "nord",
  "vitesse-dark",
  "vitesse-light",
  "material-theme-darker",
  "min-dark",
  "min-light",
  "slack-dark",
  "solarized-dark",
  "solarized-light",
  "monokai",
  "rose-pine",
  "rose-pine-moon",
  "catppuccin-mocha",
  "catppuccin-latte",
  "tokyo-night",
  "ayu-dark",
] as const;

const LANGUAGES = [
  "javascript", "typescript", "python", "rust", "go", "java", "c", "cpp",
  "csharp", "ruby", "php", "swift", "kotlin", "html", "css", "sql",
  "bash", "json", "yaml", "markdown", "jsx", "tsx", "vue", "svelte",
] as const;

const PADDING_OPTIONS = [16, 32, 48, 64, 80];
const FONT_SIZES = [12, 14, 16, 18, 20];

const DEFAULT_CODE = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Generate first 10 numbers
const sequence = Array.from(
  { length: 10 },
  (_, i) => fibonacci(i)
);

console.log(sequence);
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`;

export default function CodeSnapEditor({
  initialLanguage = "javascript",
  initialCode,
}: {
  initialLanguage?: string;
  initialCode?: string;
} = {}) {
  const [code, setCode] = useState(initialCode ?? DEFAULT_CODE);
  const [language, setLanguage] = useState<string>(initialLanguage);
  const [theme, setTheme] = useState<string>("github-dark");
  const [background, setBackground] = useState(BACKGROUNDS[0].value);
  const [padding, setPadding] = useState(48);
  const [fontSize, setFontSize] = useState(14);
  const [showHeader, setShowHeader] = useState(true);
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const [exporting, setExporting] = useState(false);
  const snapRef = useRef<HTMLDivElement>(null);

  // Highlight code
  useEffect(() => {
    let cancelled = false;
    codeToHtml(code, { lang: language, theme: theme as never })
      .then((html) => {
        if (!cancelled) setHighlightedHtml(html);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [code, language, theme]);

  const handleExport = useCallback(async (format: "png" | "svg") => {
    if (!snapRef.current || exporting) return;
    setExporting(true);
    try {
      const fn = format === "png" ? toPng : toSvg;
      const dataUrl = await fn(snapRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `codesnap.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setExporting(false);
    }
  }, [exporting]);

  const copyToClipboard = useCallback(async () => {
    if (!snapRef.current || exporting) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(snapRef.current, { pixelRatio: 2, cacheBust: true });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    } catch (e) {
      console.error("Copy failed:", e);
    } finally {
      setExporting(false);
    }
  }, [exporting]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <Select label="Language" value={language} onChange={setLanguage}
          options={LANGUAGES.map(l => ({ value: l, label: l }))} />
        <Select label="Theme" value={theme} onChange={setTheme}
          options={THEMES.map(t => ({ value: t, label: t }))} />
        <Select label="Padding" value={String(padding)} onChange={v => setPadding(Number(v))}
          options={PADDING_OPTIONS.map(p => ({ value: String(p), label: `${p}px` }))} />
        <Select label="Font" value={String(fontSize)} onChange={v => setFontSize(Number(v))}
          options={FONT_SIZES.map(f => ({ value: String(f), label: `${f}px` }))} />
        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
          <input type="checkbox" checked={showHeader} onChange={e => setShowHeader(e.target.checked)}
            className="checkbox checkbox-xs checkbox-primary" />
          Header
        </label>
      </div>

      {/* Background Picker */}
      <div className="flex flex-wrap gap-2 justify-center">
        {BACKGROUNDS.map(bg => (
          <button key={bg.name} onClick={() => setBackground(bg.value)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              background === bg.value ? "border-white scale-110" : "border-transparent"
            }`}
            style={{ background: bg.value === "transparent" ? "#1a1a2e" : bg.value }}
            title={bg.name}
          />
        ))}
      </div>

      {/* Preview */}
      <div ref={snapRef} style={{ background: background === "transparent" ? undefined : background, padding: `${padding}px` }}
        className="rounded-2xl">
        <div className="rounded-xl overflow-hidden shadow-2xl" style={{ background: "#1e1e1e" }}>
          {showHeader && (
            <div className="flex items-center gap-2 px-4 py-3 bg-black/30">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-xs text-gray-500 font-mono">{language}</span>
            </div>
          )}
          <div
            className="p-4 overflow-auto [&_pre]:!bg-transparent [&_code]:!bg-transparent"
            style={{ fontSize: `${fontSize}px` }}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </div>
      </div>

      {/* Code Input */}
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-sm text-gray-200 resize-y focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        placeholder="Paste your code here..."
        spellCheck={false}
      />

      {/* Export Buttons */}
      <div className="flex gap-3 justify-center">
        <button onClick={() => handleExport("png")} disabled={exporting}
          className="btn bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:opacity-90">
          {exporting ? "Exporting..." : "📷 Export PNG"}
        </button>
        <button onClick={() => handleExport("svg")} disabled={exporting}
          className="btn bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90">
          🎨 Export SVG
        </button>
        <button onClick={copyToClipboard} disabled={exporting}
          className="btn btn-outline border-white/20 text-gray-300 hover:bg-white/10">
          📋 Copy
        </button>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="select select-xs bg-white/10 border-white/10 text-gray-200 min-w-[100px]">
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
