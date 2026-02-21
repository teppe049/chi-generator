import { Generator } from "@/components/Generator";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8 font-serif">
        チ。ジェネレーター
      </h1>
      <Generator />
    </main>
  );
}
