// Language metadata for SEO landing pages.
// Keep keys in sync with the LANGUAGES array in CodeSnapEditor.tsx.

export type LanguageMeta = {
  slug: string;
  name: string;
  blurb: string;
  sample: string;
};

export const LANGUAGE_META: Record<string, LanguageMeta> = {
  javascript: {
    slug: "javascript",
    name: "JavaScript",
    blurb: "the language of the web — React, Node, and everything in between",
    sample: `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconst sequence = Array.from({ length: 10 }, (_, i) => fibonacci(i));\nconsole.log(sequence);`,
  },
  typescript: {
    slug: "typescript",
    name: "TypeScript",
    blurb: "JavaScript with static types — beloved across modern web teams",
    sample: `type User = { id: number; name: string };\n\nfunction greet(user: User): string {\n  return \`Hello, \${user.name}!\`;\n}\n\nconst u: User = { id: 1, name: "Ada" };\nconsole.log(greet(u));`,
  },
  python: {
    slug: "python",
    name: "Python",
    blurb: "the lingua franca of data science, scripting, and AI",
    sample: `def quicksort(xs):\n    if len(xs) <= 1:\n        return xs\n    pivot = xs[0]\n    less = [x for x in xs[1:] if x <= pivot]\n    more = [x for x in xs[1:] if x > pivot]\n    return quicksort(less) + [pivot] + quicksort(more)\n\nprint(quicksort([3, 6, 1, 8, 2, 9, 4]))`,
  },
  rust: {
    slug: "rust",
    name: "Rust",
    blurb: "memory-safe systems programming with zero-cost abstractions",
    sample: `fn main() {\n    let nums = vec![1, 2, 3, 4, 5];\n    let sum: i32 = nums.iter().sum();\n    println!("sum = {}", sum);\n}`,
  },
  go: {
    slug: "go",
    name: "Go",
    blurb: "fast, simple, and built for concurrent backend services",
    sample: `package main\n\nimport "fmt"\n\nfunc main() {\n    ch := make(chan int, 3)\n    for i := 1; i <= 3; i++ {\n        ch <- i * i\n    }\n    close(ch)\n    for v := range ch {\n        fmt.Println(v)\n    }\n}`,
  },
  java: {
    slug: "java",
    name: "Java",
    blurb: "the workhorse of enterprise and Android development",
    sample: `public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) {\n            System.out.println("count: " + i);\n        }\n    }\n}`,
  },
  c: {
    slug: "c",
    name: "C",
    blurb: "the language behind operating systems and embedded firmware",
    sample: `#include <stdio.h>\n\nint main(void) {\n    for (int i = 0; i < 5; i++) {\n        printf("%d\\n", i * i);\n    }\n    return 0;\n}`,
  },
  cpp: {
    slug: "cpp",
    name: "C++",
    blurb: "high-performance systems, game engines, and tooling",
    sample: `#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> v{1, 2, 3, 4, 5};\n    for (int x : v) std::cout << x * x << "\\n";\n    return 0;\n}`,
  },
  csharp: {
    slug: "csharp",
    name: "C#",
    blurb: ".NET, Unity game development, and Windows apps",
    sample: `using System;\n\nclass Program {\n    static void Main() {\n        for (int i = 1; i <= 5; i++) {\n            Console.WriteLine($"count: {i}");\n        }\n    }\n}`,
  },
  ruby: {
    slug: "ruby",
    name: "Ruby",
    blurb: "elegant scripting and the heart of Ruby on Rails",
    sample: `class Greeter\n  def initialize(name)\n    @name = name\n  end\n\n  def greet\n    "Hello, #{@name}!"\n  end\nend\n\nputs Greeter.new("world").greet`,
  },
  php: {
    slug: "php",
    name: "PHP",
    blurb: "the engine behind WordPress and a huge slice of the web",
    sample: `<?php\nfunction sum(array $xs): int {\n    return array_sum($xs);\n}\n\necho sum([1, 2, 3, 4, 5]);`,
  },
  swift: {
    slug: "swift",
    name: "Swift",
    blurb: "modern, safe iOS and macOS app development",
    sample: `let nums = [1, 2, 3, 4, 5]\nlet squares = nums.map { $0 * $0 }\nprint(squares)`,
  },
  kotlin: {
    slug: "kotlin",
    name: "Kotlin",
    blurb: "concise JVM language and the modern choice for Android",
    sample: `fun main() {\n    val nums = listOf(1, 2, 3, 4, 5)\n    val squares = nums.map { it * it }\n    println(squares)\n}`,
  },
  html: {
    slug: "html",
    name: "HTML",
    blurb: "the structure of every web page",
    sample: `<!doctype html>\n<html>\n  <body>\n    <h1>Hello, world</h1>\n    <p>HTML keeps it simple.</p>\n  </body>\n</html>`,
  },
  css: {
    slug: "css",
    name: "CSS",
    blurb: "styling for the modern web — grid, flex, and animations",
    sample: `.card {\n  display: grid;\n  gap: 1rem;\n  padding: 1.5rem;\n  border-radius: 12px;\n  background: linear-gradient(135deg, #6366f1, #ec4899);\n  color: white;\n}`,
  },
  sql: {
    slug: "sql",
    name: "SQL",
    blurb: "the universal language for querying relational databases",
    sample: `SELECT u.name, COUNT(o.id) AS orders\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nGROUP BY u.name\nORDER BY orders DESC\nLIMIT 10;`,
  },
  bash: {
    slug: "bash",
    name: "Bash",
    blurb: "shell scripts that glue the Unix world together",
    sample: `#!/usr/bin/env bash\nset -euo pipefail\n\nfor f in *.log; do\n  lines=$(wc -l < "$f")\n  echo "$f: $lines lines"\ndone`,
  },
  json: {
    slug: "json",
    name: "JSON",
    blurb: "the universal data-interchange format",
    sample: `{\n  "name": "CodeSnap",\n  "version": "1.0.0",\n  "languages": ["javascript", "python", "rust"],\n  "themes": 20\n}`,
  },
  yaml: {
    slug: "yaml",
    name: "YAML",
    blurb: "human-friendly configuration for CI, Kubernetes, and more",
    sample: `name: ci\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: pnpm install\n      - run: pnpm build`,
  },
  markdown: {
    slug: "markdown",
    name: "Markdown",
    blurb: "the README and docs format used everywhere",
    sample: `# CodeSnap\n\nBeautiful screenshots of your **source code**.\n\n- 24+ languages\n- 20 themes\n- PNG and SVG export\n\n> Free, fast, no account required.`,
  },
  jsx: {
    slug: "jsx",
    name: "JSX",
    blurb: "React's expressive markup-in-JavaScript syntax",
    sample: `function Greeting({ name }) {\n  return (\n    <div className="card">\n      <h1>Hello, {name}!</h1>\n      <p>Welcome to CodeSnap.</p>\n    </div>\n  );\n}`,
  },
  tsx: {
    slug: "tsx",
    name: "TSX",
    blurb: "TypeScript-flavored React components",
    sample: `type Props = { name: string };\n\nexport function Greeting({ name }: Props) {\n  return (\n    <div className="card">\n      <h1>Hello, {name}!</h1>\n    </div>\n  );\n}`,
  },
  vue: {
    slug: "vue",
    name: "Vue",
    blurb: "the progressive framework with single-file components",
    sample: `<script setup>\nimport { ref } from 'vue'\nconst count = ref(0)\n</script>\n\n<template>\n  <button @click="count++">Count is: {{ count }}</button>\n</template>`,
  },
  svelte: {
    slug: "svelte",
    name: "Svelte",
    blurb: "compile-time reactive UI with minimal runtime",
    sample: `<script>\n  let count = 0;\n</script>\n\n<button on:click={() => count += 1}>\n  clicked {count} times\n</button>`,
  },
};

export const LANGUAGE_SLUGS = Object.keys(LANGUAGE_META);
