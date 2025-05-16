// types/filters.ts
export interface ContactFilter {
  page?: number;
  status?: string; // ✅ string[] to support multi-select
  zip?: string;
  company?: string;
  query?: string;
  address?: string;
  limit?: number;
  after?: string;
}
