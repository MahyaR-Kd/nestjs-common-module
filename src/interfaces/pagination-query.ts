import { IsNumber, IsOptional } from 'class-validator';
import { IsString } from '../decorators/validations/default';
import { Transform } from 'class-transformer';
import { PaginateQuery } from 'nestjs-paginate';

export class PaginationQueryCustom implements PaginateQuery {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  page?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  limit?: number;

  @IsString({ each: true })
  sortBy?: [string, string][];

  @IsString({ each: true })
  @IsOptional()
  searchBy?: string[];

  @IsString({ each: true })
  @IsOptional()
  search?: string;

  @IsString({ each: true })
  @IsOptional()
  select?: string[];

  @IsString()
  @IsOptional()
  path: string;

  filter?: {
    [column: string]: string | string[];
  };
}
