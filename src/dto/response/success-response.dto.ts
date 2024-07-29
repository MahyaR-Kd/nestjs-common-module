import { ApiProperty } from '@nestjs/swagger';
import { SharedMessages } from '../../enums/shared-messages.enum';
import { SuccessResponseInterface } from '../../interfaces/success-response.interface';

export class BaseSuccessResponse<type> {
  @ApiProperty({ type: Object })
  data: type;

  @ApiProperty({ type: Object })
  metadata: object;

  @ApiProperty({ type: String, default: SharedMessages.SUCCESSFUL })
  message: string;

  @ApiProperty({ type: Number, default: 200 })
  statusCode: number;
}

export class SuccessResponse<type> extends BaseSuccessResponse<type> {
  constructor({
    data,
    message = null,
    statusCode = 200,
    metadata = null,
  }: SuccessResponseInterface<type>) {
    super();

    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }
}
