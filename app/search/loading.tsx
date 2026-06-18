import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">GitHubリポジトリ検索</h1>
      <LoadingSkeleton />
    </main>
  );
}
