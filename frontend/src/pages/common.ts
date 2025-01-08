export type PaginatedResponse<T> = {
  page: number;
  hasMoreRecords: boolean;
  data: T[];
};
