import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isEnum } from 'class-validator';
import { SharedMessages } from '../enums/shared-messages.enum';
import { FilterConcatTypes } from '../enums/filter-concat-type.enum';
import { FilterTypes } from '../enums/filter-types.enum';
import { TypeormFilter } from '../utils/typeorm-filter.util';
import { parseJsonString } from '../utils/parse-json-string.util';
import { SortValues } from '../enums/sort-values.enum';

@Injectable()
export class FilterPipe implements PipeTransform {
  constructor(public allowedFields: any) {}

  transform(data: any) {
    data?.sort &&
      Object.keys(data.sort).map((k) => {
        if (
          !isEnum(k, this.allowedFields) ||
          !isEnum(data.sort[k], SortValues)
        ) {
          throw new BadRequestException(SharedMessages.SORT_VALIDATION_FAILED);
        }
      });
    if (data?.filter) {
      if (!data.filter.length) {
        data.filter = {};
      } else {
        const or = [];
        const and = {};

        data?.filter.map((item: any) => {
          item.value = parseJsonString(item.value);
          const type = this.getType(item.value);

          if (!TypeormFilter[type] || !TypeormFilter[type][item.operation]) {
            throw new BadRequestException(
              SharedMessages.FILTER_OPERATION_NOT_ACCEPTABLE,
            );
          }

          if (item.concatType === FilterConcatTypes.OR) {
            const value = TypeormFilter[type][item.operation](item.value);

            if (this.isRelateField(item.field)) {
              or.push(this.convertToNestedObject(item.field, value));
            } else {
              or.push({ [item.field]: value });
            }
          } else if (item.concatType == FilterConcatTypes.AND) {
            const value = TypeormFilter[type][item.operation](item.value);

            if (this.isRelateField(item.field)) {
              Object.assign(and, this.convertToNestedObject(item.field, value));
            } else {
              and[item.field] = value;
            }
          }
        });
        data.filter = [...or, and];
      }
    }

    return data;
  }

  convertToNestedObject(field: string, value: any = null) {
    const filedItem = field.split('.');
    if (filedItem.length > 1) {
      //TODO: refactor this code
      // eslint-disable-next-line no-var
      for (var obj = {}, ptr = obj, i = 0, j = filedItem.length; i < j; i++) {
        ptr = ptr[filedItem[i]] = i !== j - 1 ? {} : value;
      }
      return obj;
    }
  }

  isRelateField(field: string) {
    const filedItem = field.split('.');
    if (filedItem.length > 1) {
      return true;
    }
    return false;
  }

  getType(value: string): FilterTypes {
    let type = <FilterTypes>typeof value;
    if (Array.isArray(value)) {
      if (this.isDate(value[0]) && this.isDate(value[1])) {
        type = FilterTypes.DATE;
      } else {
        type = FilterTypes.ARRAY;
      }
    } else if (value === null) {
      type = FilterTypes.NULL;
    } else if (this.isDate(value)) {
      type = FilterTypes.DATE;
    }
    return type;
  }

  isDate(value: string) {
    const date = new Date(value);
    if (date.toString() !== 'Invalid Date') {
      return new Date(value).toISOString() == value;
    }
    return false;
  }
}
