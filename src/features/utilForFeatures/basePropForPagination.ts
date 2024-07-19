export interface  BaseTypeForPagination{
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    noLimit?: boolean;
  }
  