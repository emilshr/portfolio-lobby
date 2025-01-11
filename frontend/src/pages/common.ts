export type PaginatedResponse<T> = {
  page: number;
  has_more_records: boolean;
  data: T[];
};
