export interface PageRequest {
  page: number;
  size: number;
  sortField: string;
  sortOrder: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  pageNo: number;
  pageSize: number;
  last: boolean;
}