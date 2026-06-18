"use client";

import { ErrorMessage } from "@/components/ErrorMessage";

type SearchErrorProps = {
  error: Error;
  reset: () => void;
};

export default function SearchError({ error, reset }: SearchErrorProps) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">GitHubリポジトリ検索</h1>
      <ErrorMessage message={error.message} onRetry={reset} />
    </main>
  );
}
