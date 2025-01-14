import { IPaginationOptions } from '../types/pagination-options.type';

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
) => {
  return {
    data,
    hasNextPage: data.length === options.limit,
  };
};
