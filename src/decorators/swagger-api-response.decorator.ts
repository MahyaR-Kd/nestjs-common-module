import { applyDecorators } from '@nestjs/common';
import { getSchemaPath } from '@nestjs/swagger';
import { SuccessResponse } from '../dto/response/success-response.dto';
import { ApiResponse } from '@nestjs/swagger';

export function CustomApiResponse(options: {
  status: number;
  description: string;
  responseDto: any;
}) {
  // Return a function that NestJS will call to apply the decorator
  return function (target: any, key?: string, descriptor?: PropertyDescriptor) {
    // Use applyDecorators to handle combining with other potential decorators
    return applyDecorators(
      ApiResponse({
        status: options.status, // Typically CREATED status
        description: options.description,
        schema: {
          $ref: getSchemaPath(SuccessResponse),
          type: 'object',
          properties: {
            data: {
              $ref: getSchemaPath(options.responseDto),
            },
          },
        },
      }),
    )(target, key, descriptor);
  };
}
