export type GithubRepository = {
  id: number;
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string | null;
  stargazersCount: number;
  language: string | null;
  ownerLogin: string;
  ownerAvatarUrl: string;
};

export type GithubSearchResult = {
  totalCount: number;
  page: number;
  totalPages: number;
  items: GithubRepository[];
};
