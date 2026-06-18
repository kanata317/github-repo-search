import type { GithubRepository, GithubSearchResult } from "@/lib/types";

export const REPOSITORIES_PER_PAGE = 10;

// GitHub Search APIは検索結果の先頭1000件までしか取得できない制約がある
const MAX_SEARCHABLE_RESULTS = 1000;

export function getMaxPage(perPage: number): number {
  return Math.floor(MAX_SEARCHABLE_RESULTS / perPage);
}

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
  page: number,
  perPage: number = REPOSITORIES_PER_PAGE
): Promise<GithubSearchResult> {
  const maxPage = getMaxPage(perPage);
  const clampedPage = Math.min(Math.max(page, 1), maxPage);

  const params = new URLSearchParams({
    q: query,
    page: String(clampedPage),
    per_page: String(perPage),
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
  const totalPages = Math.min(Math.ceil(data.total_count / perPage), maxPage);

  return {
    totalCount: data.total_count,
    page: clampedPage,
    totalPages,
    items: data.items.map(toGithubRepository),
  };
}
