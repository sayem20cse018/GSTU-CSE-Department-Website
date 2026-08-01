import { apiClient } from "./client";
import type { Event, PaginatedResponse } from "@/types";

export const eventsApi = {
  getAll: (page = 1, limit = 10) =>
    apiClient.get<PaginatedResponse<Event>>(`/events?page=${page}&limit=${limit}`, {
      revalidate: 1800,
      tags: ["events"],
    }),

  getUpcoming: () =>
    apiClient.get<Event[]>("/events/upcoming", {
      revalidate: 900, // 15 minutes — upcoming events change more frequently
      tags: ["events-upcoming"],
    }),

  getBySlug: (slug: string) =>
    apiClient.get<Event>(`/events/${slug}`, {
      revalidate: 1800,
      tags: [`event-${slug}`],
    }),
};
