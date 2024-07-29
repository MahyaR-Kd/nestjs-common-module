import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsId } from '../../decorators/validations/is-id.decorator';

export class IdsDto {
  @ApiProperty({ default: [1], isArray: true })
  @Transform((o) => {
    const ids = o.value.split(',');
    return ids.map((value: string) => Number(value));
  })
  @IsId({ optional: false, each: true })
  ids: number[];
}
