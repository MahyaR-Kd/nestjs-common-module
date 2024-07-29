import { HttpStatus, ValidationError } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class validationErrorMsg {
  @ApiProperty({ type: String })
  field: string;

  @ApiProperty({ type: String })
  message: string;
}

class ValidationMsg {
  @ApiProperty({ type: String })
  entity: string;

  @ApiProperty({
    type: validationErrorMsg,
    isArray: true,
  })
  errors: Array<validationErrorMsg>;
}

export class ValidationErrorResponseType {
  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: String })
  statusCode: string;

  @ApiProperty({ type: ValidationMsg })
  validationMsg: ValidationMsg;
}

export class ValidationErrorResponseDto {
  public message: string;
  public statusCode: string;
  public validationMsg: object;

  constructor(
    message: string,
    error: {
      validationErrors?: Array<ValidationError>;
      errors?: validationErrorMsg[];
    },
  ) {
    let validation =
      error.validationErrors &&
      error.validationErrors.map((error) => {
        error = { ...error, ...this.formatValidationError(error) };

        const field = error.property;

        const message = Object.values(error.constraints)[0];

        return {
          field,
          message,
        };
      });

    validation = validation || error.errors;

    this.message = message;
    this.statusCode = String(HttpStatus.BAD_REQUEST);
    this.validationMsg = {
      errors: validation,
    };
  }

  private formatValidationError(err: ValidationError) {
    if (err.children.length === 0)
      return {
        property: err.property,
        constraints: err.constraints,
        children: err.children,
      };

    return this.formatValidationError(err.children[0]);
  }
}
