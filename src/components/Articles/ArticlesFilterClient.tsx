// src/components/Articles/ArticlesFilterClient.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import type { TopicData } from "@/src/types/Topic";
import type { ArticleData } from "@/src/types/article";
import SelectInput from "../common/SelectInput";
import ArticleCard from "./ArticleCard";
import Pagination, { usePagination } from "../common/Pagination";
import SearchBar from "../SearchBar/SearchBar";

interface Props {
  articles: ArticleData[];
  topics: TopicData[];
}

const ALL = "all-topics";
const PAGE_SIZE = 6;

export default function ArticlesFilterClient({ articles, topics }: Props) {
  const [selected, setSelected] = useState(ALL);
  const [search, setSearch] = useState("");

  const topicOptions = useMemo(
    () => [
      { value: ALL, label: "সব টপিক" },
      ...topics.map((t) => ({ value: t._id, label: t.title })),
    ],
    [topics],
  );

  const filtered = useMemo(() => {
    const byTopic =
      selected === ALL
        ? articles
        : articles.filter((a) => a.topic?._id === selected);

    const query = search.trim().toLowerCase();
    if (!query) return byTopic;

    return byTopic.filter(
      (a) =>
        a.title?.toLowerCase().includes(query) ||
        a.description?.toLowerCase().includes(query),
    );
  }, [articles, selected, search]);

  const { page, totalPages, paginated, goToPage } = usePagination(filtered, {
    pageSize: PAGE_SIZE,
    storageKey: "articles-filter-pagination",
  });

  const handleTopicChange = useCallback(
    (value: string) => {
      setSelected(value);
      goToPage(1);
    },
    [goToPage],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      goToPage(1);
    },
    [goToPage],
  );

  const label =
    topicOptions.find((o) => o.value === selected)?.label ?? "সব টপিক";

  return (
    <div className="space-y-6 p-4 mt-20">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-3xl lg:text-5xl font-semibold text-(--color-text) bangla">
            Articles
          </h2>

          <span className="inset-0 pointer-events-none select-none text-sm bg-(--color-active-bg) text-(--color-text) px-2 rounded-lg">
            {filtered.length}
          </span>
        </div>

        <div className="w-full lg:max-w-md">
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="আর্টিকেল খুঁজুন..."
          />
        </div>

        <div className="w-full sm:w-60">
          <SelectInput
            options={topicOptions}
            value={selected}
            onChange={handleTopicChange}
            placeholder="টপিক বেছে নাও"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Inbox className="w-10 h-10 text-(--color-gray)" />
          <p className="text-sm text-(--color-gray) bangla">
            {search.trim()
              ? `"${search}" — কোনো আর্টিকেল পাওয়া যায়নি`
              : `"${label}" — কোনো আর্টিকেল নেই`}
          </p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          )}
        </div>
      )}
    </div>
  );
}
