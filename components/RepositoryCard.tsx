import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { GithubRepository } from "@/lib/types";

type RepositoryCardProps = {
  repository: GithubRepository;
};

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarImage
              src={repository.ownerAvatarUrl}
              alt={repository.ownerLogin}
            />
            <AvatarFallback>
              {repository.ownerLogin.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle>
            <a
              href={repository.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {repository.fullName}
            </a>
          </CardTitle>
        </div>
        {repository.description ? (
          <CardDescription>{repository.description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>★ {repository.stargazersCount.toLocaleString()}</span>
          {repository.language ? (
            <Badge variant="secondary">{repository.language}</Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
