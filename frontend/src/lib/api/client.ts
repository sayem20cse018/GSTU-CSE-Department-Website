/**
 * Base API client for communicating with the NestJS backend.
 * All API calls from the frontend go through this file.
 */

import { siteConfig } from "@/config/site";
import type { ApiError } from "@/types";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  /** Pass a JWT token for protected admin routes */
  token?: string;
  /** Extra headers to merge */
  headers?: Record<string, string>;
  /** Revalidation config for Next.js server-side fetch caching */
  revalidate?: number | false;
  /** Cache tags for on-demand revalidation */
  tags?: string[];
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<TResponse>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<TResponse> {
    const {
      method = "GET",
      body,
      token,
      headers = {},
      revalidate,
      tags,
    } = options;

    const url = `${this.baseUrl}${endpoint}`;

    const fetchHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // Next.js 15+ extended fetch options for ISR / caching
    const nextOptions: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
      method,
      headers: fetchHeaders,
      ...(body ? { body: JSON.stringify(body) } : {}),
      ...(revalidate !== undefined || tags
        ? { next: { ...(revalidate !== undefined ? { revalidate } : {}), ...(tags ? { tags } : {}) } }
        : {}),
    };

    const response = await fetch(url, nextOptions);

    if (!response.ok) {
      let errorBody: Partial<ApiError> = {};
      try {
        errorBody = await response.json();
      } catch {
        // ignore parse errors
      }
      throw new Error(
        errorBody.message ?? `API error: ${response.status} ${response.statusText}`
      );
    }

    // 204 No Content
    if (response.status === 204) return undefined as TResponse;

    return response.json() as Promise<TResponse>;
  }

  /** Convenience wrappers */
  get<T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T, B = unknown>(endpoint: string, body: B, options?: Omit<RequestOptions<B>, "method" | "body">) {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  patch<T, B = unknown>(endpoint: string, body: B, options?: Omit<RequestOptions<B>, "method" | "body">) {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  delete<T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

/** Singleton — import this wherever you need to call the backend */
export const apiClient = new ApiClient(siteConfig.apiUrl);
