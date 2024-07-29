import { FindOptionsOrder, SelectQueryBuilder } from 'typeorm';

export function applySort<T>(
  query: SelectQueryBuilder<T>,
  sort?: FindOptionsOrder<T>,
) {
  let result = query;
  if (sort) {
    Object.keys(sort).map((key) => {
      const columnName =
        key.indexOf('.') === -1 ? `${query.alias}.${key}` : key;
      result = query['orderBy'](columnName, <any>sort[key]);
    });
  }
  return result;
}

export function applySortWithPrice<T>(
  query: SelectQueryBuilder<T>,
  sort?: FindOptionsOrder<T>,
) {
  const result = query;
  if (sort) {
    Object.keys(sort).map((key) => {
      const columnName =
        key.indexOf('.') === -1 && key !== 'price'
          ? `${query.alias}.${key}`
          : key;
      query = query['orderBy'](columnName, <any>sort[key]);
    });
  }
  return result;
}

export function applySortWithSearch<T>(
  query: SelectQueryBuilder<T>,
  {
    sort,
    search,
  }: {
    sort?: FindOptionsOrder<T>;
    search?: { fields: string[]; content: string };
  },
) {
  let result = query;
  if (sort) {
    Object.keys(sort).map((key) => {
      const columnName =
        key.indexOf('.') === -1 ? `${query.alias}.${key}` : key;
      result = query['orderBy'](columnName, <any>sort[key]);
    });
  }
  if (search) {
    result = applySearch(result, search);
  }
  return result;
}

export function applySortWithSearchAndPrice<T>(
  query: SelectQueryBuilder<T>,
  {
    sort,
    search,
  }: {
    sort?: FindOptionsOrder<T>;
    search?: { fields: string[]; content: string };
  },
) {
  let result = applySortWithPrice(query, sort);

  if (search) {
    result = applySearch(result, search);
  }
  return result;
}

export function applySearch<T>(
  query: SelectQueryBuilder<T>,
  {
    fields,
    content,
  }: {
    fields: string[];
    content: string;
  },
) {
  let result = query;
  const searchExpressions = fields.map((field) => `${field} LIKE :search`);
  result = result['andWhere'](`(${searchExpressions.join(' OR ')})`, {
    search: `%${content}%`,
  });
  return result;
}
