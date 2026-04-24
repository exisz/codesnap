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
const LAYOUTS = [
  { value: "single", label: "Single" },
  { value: "horizontal", label: "Side-by-side" },
  { value: "vertical", label: "Stacked" },
] as const;

type LayoutMode = typeof LAYOUTS[number]["value"];

interface CodeFile {
  id: string;
  name: string;
  language: string;
  code: string;
}

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

const SECOND_CODE = `# Same logic in Python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

sequence = [fibonacci(i) for i in range(10)]
print(sequence)
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`;

let fileIdCounter = 0;
const newFileId = () => `f${++fileIdCounter}-${Date.now()}`;

export default function CodeSnapEditor({
  initialLanguage = "javascript",
  initialCode,
}: {
  initialLanguage?: string;
  initialCode?: string;
} = {}) {
  const [files, setFiles] = useState<CodeFile[]>([
    {
      id: newFileId(),
      name: `main.${extForLang(initialLanguage)}`,
      language: initialLanguage,
      code: initialCode ?? DEFAULT_CODE,
    },
  ]);
  const [activeId, setActiveId] = useState<string>(() => files[0]?.id ?? "");
  const [layout, setLayout] = useState<LayoutMode>("single");
  const [theme, setTheme] = useState<string>("github-dark");
  const [background, setBackground] = useState(BACKGROUNDS[0].value);
  const [padding, setPadding] = useState(48);
  const [fontSize, setFontSize] = useState(14);
  const [showHeader, setShowHeader] = useState(true);
  const [highlightedMap, setHighlightedMap] = useState<Record<string, string>>({});
  const [exporting, setExporting] = useState(false);
  const snapRef = useRef<HTMLDivElement>(null);

  const activeFile = files.find(f => f.id === activeId) ?? files[0];

  // Highlight all files
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      files.map(async (f) => {
        try {
          const html = await codeToHtml(f.code, { lang: f.language, theme: theme as never });
          return [f.id, html] as const;
        } catch {
          return [f.id, ""] as const;
        }
      })
    ).then((entries) => {
      if (cancelled) return;
      const map: Record<string, string> = {};
      entries.forEach(([id, html]) => { map[id] = html; });
      setHighlightedMap(map);
    });
    return () => { cancelled = true; };
  }, [files, theme]);

  const updateActive = useCallback(<K extends keyof CodeFile>(key: K, value: CodeFile[K]) => {
    setFiles(prev => prev.map(f => f.id === activeId ? { ...f, [key]: value } : f));
  }, [activeId]);

  const addFile = useCallback(() => {
    if (files.length >= 4) return;
    const langDefault = files.length === 1 ? "python" : "javascript";
    const codeDefault = files.length === 1 ? SECOND_CODE : "// new file\n";
    const nf: CodeFile = {
      id: newFileId(),
      name: `file${files.length + 1}.${extForLang(langDefault)}`,
      language: langDefault,
      code: codeDefault,
    };
    setFiles(prev => [...prev, nf]);
    setActiveId(nf.id);
    if (layout === "single") setLayout("horizontal");
  }, [files.length, layout]);

  const removeFile = useCallback((id: string) => {
    if (files.length <= 1) return;
    setFiles(prev => {
      const next = prev.filter(f => f.id !== id);
      if (id === activeId) setActiveId(next[0]?.id ?? "");
      if (next.length === 1) setLayout("single");
      return next;
    });
  }, [files.length, activeId]);

  const handleExport = useCallback(async (format: "png" | "svg") => {
    if (!snapRef.current || exporting) return;
    setExporting(true);
    try {
      const fn = format === "png" ? toPng : toSvg;
      const dataUrl = await fn(snapRef.current, { pixelRatio: 2, cacheBust: true });
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

  const renderedFiles = layout === "single" ? [activeFile] : files;
  const flexDir = layout === "vertical" ? "flex-col" : "flex-row";

  return (
    <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-[260px_1fr] gap-6">
      {/* Left Sidebar */}
      <aside className="space-y-5 lg:sticky lg:top-4 lg:self-start bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 h-fit">
        <Section title="Layout">
          <div className="grid grid-cols-3 gap-1">
            {LAYOUTS.map(l => (
              <button
                key={l.value}
                onClick={() => setLayout(l.value)}
                disabled={files.length < 2 && l.value !== "single"}
                className={`text-[10px] py-1.5 px-2 rounded transition-all ${
                  layout === l.value
                    ? "bg-purple-500/30 text-white border border-purple-400/50"
                    : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 disabled:opacity-30"
                }`}
                title={l.label}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Files">
          <div className="space-y-1">
            {files.map(f => (
              <div
                key={f.id}
                className={`group flex items-center gap-1 px-2 py-1.5 rounded text-xs cursor-pointer transition-all ${
                  f.id === activeId ? "bg-purple-500/20 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
                onClick={() => setActiveId(f.id)}
              >
                <input
                  value={f.name}
                  onClick={e => e.stopPropagation()}
                  onChange={e => setFiles(prev => prev.map(x => x.id === f.id ? { ...x, name: e.target.value } : x))}
                  className="flex-1 bg-transparent border-0 outline-none min-w-0"
                />
                {files.length > 1 && (
                  <button
                    onClick={e => { e.stopPropagation(); removeFile(f.id); }}
                    className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-400 px-1"
                    title="Remove"
                  >×</button>
                )}
              </div>
            ))}
            {files.length < 4 && (
              <button
                onClick={addFile}
                className="w-full text-xs py-1.5 rounded bg-white/5 text-gray-400 border border-dashed border-white/10 hover:bg-white/10 hover:text-white transition-all"
              >
                + Add file
              </button>
            )}
          </div>
        </Section>

        <Section title="Language">
          <SidebarSelect value={activeFile?.language ?? "javascript"} onChange={v => updateActive("language", v)}
            options={LANGUAGES.map(l => ({ value: l, label: l }))} />
        </Section>

        <Section title="Theme">
          <SidebarSelect value={theme} onChange={setTheme}
            options={THEMES.map(t => ({ value: t, label: t }))} />
        </Section>

        <Section title="Background">
          <div className="grid grid-cols-5 gap-2">
            {BACKGROUNDS.map(bg => (
              <button key={bg.name} onClick={() => setBackground(bg.value)}
                className={`w-full aspect-square rounded-lg border-2 transition-all ${
                  background === bg.value ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"
                }`}
                style={{ background: bg.value === "transparent" ? "#1a1a2e" : bg.value }}
                title={bg.name}
              />
            ))}
          </div>
        </Section>

        <Section title="Padding">
          <SidebarSelect value={String(padding)} onChange={v => setPadding(Number(v))}
            options={PADDING_OPTIONS.map(p => ({ value: String(p), label: `${p}px` }))} />
        </Section>

        <Section title="Font size">
          <SidebarSelect value={String(fontSize)} onChange={v => setFontSize(Number(v))}
            options={FONT_SIZES.map(f => ({ value: String(f), label: `${f}px` }))} />
        </Section>

        <Section title="Window">
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
            <input type="checkbox" checked={showHeader} onChange={e => setShowHeader(e.target.checked)}
              className="checkbox checkbox-xs checkbox-primary" />
            Show traffic-light header
          </label>
        </Section>
      </aside>

      {/* Main canvas */}
      <main className="space-y-6 min-w-0">
        {/* Preview */}
        <div ref={snapRef} style={{ background: background === "transparent" ? undefined : background, padding: `${padding}px` }}
          className="rounded-2xl overflow-x-auto">
          <div className={`flex ${flexDir} gap-4 ${layout === "horizontal" ? "items-stretch" : ""}`}>
            {renderedFiles.map(f => (
              <div key={f.id} className={`rounded-xl overflow-hidden shadow-2xl ${layout === "horizontal" ? "flex-1 min-w-0" : "w-full"}`} style={{ background: "#1e1e1e" }}>
                {showHeader && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-black/30">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                    <span className="ml-2 text-xs text-gray-400 font-mono truncate">{layout === "single" ? f.language : f.name}</span>
                  </div>
                )}
                <div
                  className="p-4 overflow-auto [&_pre]:!bg-transparent [&_code]:!bg-transparent"
                  style={{ fontSize: `${fontSize}px` }}
                  dangerouslySetInnerHTML={{ __html: highlightedMap[f.id] ?? "" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Editor for active file */}
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
            Editing: <span className="text-purple-300">{activeFile?.name}</span>
          </div>
          <textarea
            value={activeFile?.code ?? ""}
            onChange={e => updateActive("code", e.target.value)}
            className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-sm text-gray-200 resize-y focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            placeholder="Paste your code here..."
            spellCheck={false}
          />
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => handleExport("png")} disabled={exporting}
            className="btn bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:opacity-90 hover:scale-105 transition-transform">
            {exporting ? "Exporting..." : "📷 Export PNG"}
          </button>
          <button onClick={() => handleExport("svg")} disabled={exporting}
            className="btn bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90 hover:scale-105 transition-transform">
            🎨 Export SVG
          </button>
          <button onClick={copyToClipboard} disabled={exporting}
            className="btn btn-outline border-white/20 text-gray-300 hover:bg-white/10 hover:scale-105 transition-transform">
            📋 Copy
          </button>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{title}</div>
      {children}
    </div>
  );
}

function SidebarSelect({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="select select-sm w-full bg-white/10 border-white/10 text-gray-200">
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function extForLang(lang: string): string {
  const map: Record<string, string> = {
    javascript: "js", typescript: "ts", python: "py", rust: "rs", go: "go",
    java: "java", c: "c", cpp: "cpp", csharp: "cs", ruby: "rb", php: "php",
    swift: "swift", kotlin: "kt", html: "html", css: "css", sql: "sql",
    bash: "sh", json: "json", yaml: "yaml", markdown: "md", jsx: "jsx",
    tsx: "tsx", vue: "vue", svelte: "svelte",
  };
  return map[lang] ?? "txt";
}
