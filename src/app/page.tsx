import CodeSnapEditor from "@/components/CodeSnapEditor";
import Link from "next/link";
import { LANGUAGE_META, LANGUAGE_SLUGS } from "@/lib/languages";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
          CodeSnap
        </h1>
        <p className="text-gray-400 text-sm">
          Create beautiful screenshots of your source code
        </p>
      </div>
      <CodeSnapEditor />

      <section className="mt-12 max-w-3xl w-full text-center">
        <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-3">
          Language-specific generators
        </h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {LANGUAGE_SLUGS.map((s) => (
            <Link
              key={s}
              href={`/${s}`}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 transition-colors"
            >
              {LANGUAGE_META[s].name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
