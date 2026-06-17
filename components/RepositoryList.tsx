import { RepositoryCard } from "@/components/RepositoryCard";
import type { GithubRepository } from "@/lib/types";

type RepositoryListProps = {
  repositories: GithubRepository[];
};

export function RepositoryList({ repositories }: RepositoryListProps) {
  if (repositories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        該当するリポジトリが見つかりませんでした。
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {repositories.map((repository) => (
        <li key={repository.id}>
          <RepositoryCard repository={repository} />
        </li>
      ))}
    </ul>
  );
}
