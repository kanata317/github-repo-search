import type { GithubRepository, GithubSearchResult } from "@/lib/types";

type GithubSearchRepositoriesApiItem = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
};

type GithubSearchRepositoriesApiResponse = {
  total_count: number;
  items: GithubSearchRepositoriesApiItem[];
};

function toGithubRepository(
  item: GithubSearchRepositoriesApiItem
): GithubRepository {
  return {
    id: item.id,
    name: item.name,
    fullName: item.full_name,
    htmlUrl: item.html_url,
    description: item.description,
    stargazersCount: item.stargazers_count,
    language: item.language,
    ownerLogin: item.owner.login,
    ownerAvatarUrl: item.owner.avatar_url,
  };
}

export async function searchRepositories(
  query: string,
  page: number
): Promise<GithubSearchResult> {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
  });

  const res = await fetch(
    `https://api.github.com/search/repositories?${params.toString()}`,
    {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error(
      `GitHub Search APIの呼び出しに失敗しました (status: ${res.status})`
    );
  }

  const data: GithubSearchRepositoriesApiResponse = await res.json();

  return {
    totalCount: data.total_count,
    items: data.items.map(toGithubRepository),
  };
}
