import { ApiProperty } from '@nestjs/swagger';

export class BaseErrorResponse {
  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: Number })
  statusCode: number;

  @ApiProperty()
  details: Record<string, any>;
}

export class ErrorResponse extends BaseErrorResponse {
  constructor(message: string, statusCode: number, details: any = {}) {
    super();

    this.message = message;
    this.statusCode = statusCode;
    this.details = details;
  }
}
