/** Common shared types used across HRMS.Web. */

/** Generic paged result wrapper returned by the .NET API. */
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/** Normalised error payload from the .NET ProblemDetails middleware. */
export interface ApiError {
  status: number;
  title?: string;
  message: string;
  errors?: Record<string, string[]>;
  traceId?: string;
}

/** Generic key/value select option for dropdowns. */
export interface SelectOption<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
}
