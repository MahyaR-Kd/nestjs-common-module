import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { SharedMessages } from '../enums';

@Injectable()
export class FilterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { filter_value, filter_concat_type, filter_operation } =
      request.query;

    if (filter_value && filter_concat_type && filter_operation) {
      if (
        !Object.keys(filter_value).length ||
        !Object.keys(filter_concat_type).length ||
        !Object.keys(filter_operation).length
      ) {
        throw new BadRequestException(SharedMessages.FILTER_VALIDATION_FAILED);
      }

      const filter = [];
      for (const key in filter_value) {
        const concatType = filter_concat_type[key];
        const operation = filter_operation[key];
        const value = filter_value[key];
        if (!concatType || !operation || !value)
          throw new BadRequestException(
            SharedMessages.FILTER_VALIDATION_FAILED,
          );

        filter.push({
          field: key,
          concatType,
          operation,
          value,
        });
      }
      request.query.filter = filter;
    } else {
      request.query.filter = [];
    }

    return next.handle().pipe();
  }
}
