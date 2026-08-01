import { apiClient } from "./client";
import type { Faculty, ApiResponse } from "@/types";

export const facultyApi = {
  /** Fetch all active faculty members */
  getAll: () =>
    apiClient.get<Faculty[]>("/faculty", {
      revalidate: 3600, // ISR: revalidate every 1 hour
      tags: ["faculty"],
    }),

  /** Fetch a single faculty member by ID */
  getById: (id: string) =>
    apiClient.get<Faculty>(`/faculty/${id}`, {
      revalidate: 3600,
      tags: [`faculty-${id}`],
    }),
};
