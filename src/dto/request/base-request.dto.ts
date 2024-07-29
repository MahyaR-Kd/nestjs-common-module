import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class BaseRequest {
  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  metadata?: any;
}
