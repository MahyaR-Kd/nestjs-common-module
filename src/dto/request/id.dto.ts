import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsId } from '../../decorators/validations/is-id.decorator';

export class IdDto {
  @ApiProperty({ default: 1 })
  @Type(() => Number)
  @IsId({ optional: false })
  id: number;
}
