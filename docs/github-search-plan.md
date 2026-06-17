# GitHubリポジトリ検索画面 - コンポーネント方針

Next.js 16 App Router準拠の構成。

## ルーティング層（app/）

- `app/search/page.tsx` — 検索画面のエントリ（Server Component）。`searchParams`（`q`, `page`等）を受け取りSSRでデータ取得
- `app/search/loading.tsx` — 検索結果のSuspenseフォールバック（スケルトン表示）
- `app/search/error.tsx` — GitHub API失敗時のエラーバウンダリ（Client Component）
- `app/api/github/search/route.ts` — （任意）GitHub APIをプロキシするRoute Handler。トークン秘匿・レート制限対策・キャッシュ制御をしたい場合に追加

## UIコンポーネント（components/）

- `SearchForm`（Client Component） — 検索input。`useRouter`/`useSearchParams`でURLクエリを更新し、検索語をURLの状態として持たせる
- `RepositoryList`（Server Component） — 検索結果一覧のコンテナ。データ取得して`RepositoryCard`をmap
- `RepositoryCard`（Server Component） — 1リポジトリの表示（名前・description・star数・language・owner avatar等）
- `Pagination`（Client Component） — ページ送りUI。クエリパラメータ`page`を書き換える
- `SortFilter`（Client Component, 任意） — stars/forks/updated等のソート切り替え
- `EmptyState` — 検索結果0件時の表示
- `LoadingSkeleton` — `loading.tsx`から呼ぶスケルトンUI
- `ErrorMessage` — `error.tsx`から呼ぶエラーUI

## データ/ロジック層（lib/）

- `lib/github.ts` — GitHub Search API（`GET /search/repositories`）を呼ぶ関数。`fetch`の`cache`/`next.revalidate`オプションをここで指定
- `lib/types.ts` — `GithubRepository`等の型定義

## 設計上の論点（検討メモ）

- 検索状態をURLの`searchParams`に持たせるか、クライアントstateに持たせるかは要件次第（共有可能なURL・ブラウザ戻る対応ならURL派が定石）
- Server Componentでのデータ取得を基本にし、入力フォームなどインタラクションが必要な部分のみClient Componentに切り出す（App Routerの基本方針）

### SSR vs CSR の判断軸

1. インタラクションの粒度 — 検索ボタン押下（ページ遷移単位）かインクリメンタルサーチ（文字入力ごと）か。前者はSSR向き、後者はCSR向き
2. SEO/初回表示の必要性 — インデックスさせたい/LCPを優先したいならSSR
3. 秘匿情報の有無 — APIトークンを隠したいならサーバー経由が必須
4. データの更新頻度とキャッシュ可否 — キャッシュ可能ならSSR + `revalidate`が有利
5. URL共有したい状態か、ローカルUI状態か

今回は「検索ボタン押下でURLが変わり、ページ送りもURLの`page`で管理する」設計を前提に、SSR（`app/search/page.tsx`でのデータ取得）を基本方針とする。

### SSRで一般的に困る点（留意事項）

- TTFBが外部API（GitHub）のレイテンシに直結する → `loading.tsx`によるstreamingで緩和
- サーバー側に外部APIへのリクエストが集約され、レート制限（未認証60回/時、トークン使用で5000回/時）に到達しやすい → `revalidate`でのキャッシュで消費を抑える
- インタラクションがページ遷移前提になりやすく、SPA的な即時UXにはClient Componentの組み合わせが必要
- エラーハンドリングが`error.tsx`単位だとページ全体を巻き込みやすい → 境界の粒度に注意
