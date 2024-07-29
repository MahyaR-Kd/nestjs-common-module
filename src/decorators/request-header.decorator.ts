import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export const RequestHeader = createParamDecorator(
  async (value: any, ctx: ExecutionContext) => {
    // extract headers
    const headers = ctx.switchToHttp().getRequest().headers;

    // Convert headers to DTO object
    const dto = plainToInstance(value, headers, {
      excludeExtraneousValues: true,
    });

    // Validate
    return validateOrReject(dto).then(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (res) => {
        return dto;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (err) => {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Missing Authorization Header',
          },
          HttpStatus.FORBIDDEN,
        );
      },
    );
  },
);
