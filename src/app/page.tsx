import CodeSnapEditor from "@/components/CodeSnapEditor";

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
    </main>
  );
}
