"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    if (query) {
      params.set("q", query);
    }

    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="リポジトリ名で検索"
        aria-label="リポジトリ検索"
      />
      <Button type="submit">検索</Button>
    </form>
  );
}
