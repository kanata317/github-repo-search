import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type LoadingSkeletonProps = {
  count?: number;
};

export function LoadingSkeleton({ count = 5 }: LoadingSkeletonProps) {
  return (
    <ul className="flex flex-col gap-3" aria-label="読み込み中">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
