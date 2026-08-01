import { apiClient } from "./client";
import type { NewsItem, PaginatedResponse } from "@/types";

export const newsApi = {
  getAll: (page = 1, limit = 10) =>
    apiClient.get<PaginatedResponse<NewsItem>>(`/news?page=${page}&limit=${limit}`, {
      revalidate: 1800, // 30 minutes
      tags: ["news"],
    }),

  getBySlug: (slug: string) =>
    apiClient.get<NewsItem>(`/news/${slug}`, {
      revalidate: 1800,
      tags: [`news-${slug}`],
    }),
};
