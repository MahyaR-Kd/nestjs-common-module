import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EventDto<T> {
  @IsString()
  @IsOptional()
  topic?: string;

  @IsString()
  event_source: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  event_key?: string;

  @IsOptional()
  data?: T;

  @IsNumber()
  @IsOptional()
  partition?: number;
}
