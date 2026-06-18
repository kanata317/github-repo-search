import { Pagination } from "@/components/Pagination";
import { RepositoryList } from "@/components/RepositoryList";
import { SearchForm } from "@/components/SearchForm";
import { searchRepositories } from "@/lib/github";

type SearchPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page } = await searchParams;
  const pageNumber = Number(page ?? "1");

  const result = q ? await searchRepositories(q, pageNumber) : null;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">GitHubリポジトリ検索</h1>
      <SearchForm />
      {result ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            検索結果: {result.totalCount}件（page: {result.page}）
          </p>
          <RepositoryList repositories={result.items} />
          <Pagination currentPage={result.page} totalPages={result.totalPages} />
        </div>
      ) : null}
    </main>
  );
}
