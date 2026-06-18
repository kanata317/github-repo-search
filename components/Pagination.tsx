"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

const WINDOW_SIZE = 5;

function getPageNumbers(currentPage: number, totalPages: number): number[] {
  const half = Math.floor(WINDOW_SIZE / 2);
  const start = Math.max(1, Math.min(currentPage - half, totalPages - WINDOW_SIZE + 1));
  const end = Math.min(totalPages, start + WINDOW_SIZE - 1);
  const clampedStart = Math.max(1, end - WINDOW_SIZE + 1);

  return Array.from({ length: end - clampedStart + 1 }, (_, i) => clampedStart + i);
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  function navigateTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/search?${params.toString()}`);
  }

  return (
    <nav aria-label="ページネーション" className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => navigateTo(currentPage - 1)}
      >
        前へ
      </Button>
      {getPageNumbers(currentPage, totalPages).map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => navigateTo(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => navigateTo(currentPage + 1)}
      >
        次へ
      </Button>
    </nav>
  );
}
