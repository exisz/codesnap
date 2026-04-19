import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import CodeSnapEditor from "@/components/CodeSnapEditor";
import { LANGUAGE_META, LANGUAGE_SLUGS } from "@/lib/languages";

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGUAGE_SLUGS.map((language) => ({ language }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string }>;
}): Promise<Metadata> {
  const { language } = await params;
  const meta = LANGUAGE_META[language];
  if (!meta) return {};
  const title = `${meta.name} Code Screenshot Generator`;
  const description = `Create beautiful ${meta.name} code screenshots in your browser. Free, fast, and no account required. Export as PNG or SVG with 20 syntax-highlighting themes.`;
  const url = `https://codesnap.starmap.quest/${meta.slug}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "CodeSnap",
      type: "website",
    },
    alternates: { canonical: url },
  };
}

export default async function LanguagePage({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;
  const meta = LANGUAGE_META[language];
  if (!meta) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `CodeSnap — ${meta.name} Code Screenshot Generator`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description: `Create beautiful ${meta.name} code screenshots in your browser. Export as PNG or SVG.`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: `https://codesnap.starmap.quest/${meta.slug}`,
  };

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="text-center mb-6 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
          {meta.name} Code Screenshot Generator
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Turn your {meta.name} code into beautiful, shareable images — {meta.blurb}.
        </p>
      </div>
      <CodeSnapEditor initialLanguage={meta.slug} initialCode={meta.sample} />

      <section className="mt-12 max-w-3xl text-gray-300 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-white mb-3">
          Why use CodeSnap for {meta.name}?
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-400">
          <li>Accurate {meta.name} syntax highlighting powered by Shiki — the same engine VS Code uses.</li>
          <li>20 themes including GitHub Dark, Dracula, Nord, Monokai, and One Dark Pro.</li>
          <li>9 gradient backgrounds, adjustable padding, and an optional macOS-style window chrome.</li>
          <li>Export your {meta.name} snippet as a high-resolution PNG or a scalable SVG.</li>
          <li>100% client-side — your code never leaves your browser.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-8 mb-3">
          Pair {meta.name} with another language
        </h2>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_SLUGS.filter((s) => s !== meta.slug).map((s) => (
            <Link
              key={s}
              href={`/${s}`}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 transition-colors"
            >
              {LANGUAGE_META[s].name}
            </Link>
          ))}
        </div>

        <p className="mt-8 text-xs text-gray-500">
          Looking for the full editor?{" "}
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            Open the main CodeSnap editor →
          </Link>
        </p>
      </section>
    </main>
  );
}
