import {
  Equal,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Like,
  Between,
  In,
  IsNull,
} from 'typeorm';
import { FilterTypes } from '../enums/filter-types.enum';

export class TypeormFilter {
  static [FilterTypes.STRING] = {
    Not(value: string) {
      return Not(value);
    },
    Equal(value: string) {
      return Equal(value);
    },
    Like(value: string) {
      return Like(value);
    },
  };

  static [FilterTypes.NUMBER] = {
    LessThan(value: number) {
      return LessThan(value);
    },
    Not(value: number) {
      return Not(value);
    },
    Equal(value: number) {
      return Equal(value);
    },
    LessThanOrEqual(value: number) {
      return LessThanOrEqual(value);
    },
    MoreThan(value: number) {
      return MoreThan(value);
    },
    MoreThanOrEqual(value: number) {
      return MoreThanOrEqual(value);
    },
  };

  static [FilterTypes.ARRAY] = {
    In(value: string[]) {
      return In(value);
    },
    Between(value: [number | string, number | string]) {
      return Between(value[0], value[1]);
    },
  };

  static [FilterTypes.BOOLEAN] = {
    Equal(value: boolean) {
      return Equal(value);
    },
    Not(value: boolean) {
      return Not(value);
    },
  };

  static [FilterTypes.NULL] = {
    IsNull() {
      return IsNull();
    },
    IsNotNull() {
      return Not(null);
    },
  };

  static [FilterTypes.DATE] = {
    LessThan(value: string) {
      return LessThan(formatDate(value));
    },
    Equal(value: string) {
      return Equal(formatDate(value));
    },
    LessThanOrEqual(value: string) {
      return LessThanOrEqual(formatDate(value));
    },
    MoreThan(value: string) {
      return MoreThan(formatDate(value));
    },
    MoreThanOrEqual(value: string) {
      return MoreThanOrEqual(formatDate(value));
    },
    Between(value: [string, string]) {
      return Between(formatDate(value[0]), formatDate(value[1]));
    },
  };
}

function formatDate(date: string) {
  return new Date(date).toISOString().replace('T', ' ');
}
