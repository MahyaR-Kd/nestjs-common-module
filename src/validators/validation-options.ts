import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';
import { MessageFormatter } from '../helpers';

export const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) =>
    new HttpException(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: `Validation failed: ${errors.length} errors found`,
        details: mapValidationErrors(errors),
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    ),
};

function mapValidationErrors(errors: ValidationError[]): any {
    return errors.reduce((result, error) => {
        const constraints = error.constraints
            ? Object.values(error.constraints)
                .map((message) => MessageFormatter.replace(message, error.property))
                .join(', ')
            : null;

        result[error.property] =
            constraints || mapValidationErrors(error.children || []);
        return result;
    }, {});
}
