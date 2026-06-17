import { SearchForm } from "@/components/SearchForm";

type SearchPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">GitHubリポジトリ検索</h1>
      <SearchForm />
      {q ? (
        <p className="text-sm text-muted-foreground">
          検索クエリ: {q}（page: {page ?? "1"}）
        </p>
      ) : null}
    </main>
  );
}
