import {
  NotFoundException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Paginate, Paginated } from 'nestjs-paginate';
import { PaginateConfig } from 'nestjs-paginate/lib/paginate';
import { PaginationQueryCustom } from '../interfaces/pagination-query';
import { SharedMessages } from '../enums/shared-messages.enum';
import { SuccessResponse } from '../dto';
import { BaseResponseWithActionDates } from '../dto';
import { IdDto } from '../dto';
import { CoreCrudService } from '../services';
import { ParentEntity } from '../entities/parent.entity';

export class CoreCrudController<
  T extends ParentEntity,
  CreateDto,
  UpdateDto,
  ResponseDto extends BaseResponseWithActionDates,
> {
  protected constructor(
    protected readonly coreService: CoreCrudService<T, CreateDto, UpdateDto>,
    protected readonly responseDto: any,
  ) {}

  async findAll(
    @Paginate() query: PaginationQueryCustom,
    paginateConfig: PaginateConfig<T>,
  ): Promise<Paginated<T>> {
    const response = await this.coreService.findAllWithPagination(
      query,
      paginateConfig,
    );
    if (!response) throw new NotFoundException(SharedMessages.FETCH_FAILED);

    response.data = response.data.map((item) => new this.responseDto(item));
    return response;
  }

  async findOneById(id: number): Promise<SuccessResponse<ResponseDto>> {
    const response = await this.coreService.findOneById(id);
    if (!response)
      throw new NotFoundException(SharedMessages.RESOURCE_NOT_FOUND);

    return new SuccessResponse<ResponseDto>(
      new this.responseDto(response),
      SharedMessages.SUCCESSFUL,
      HttpStatus.OK,
    );
  }

  async create(createDto: CreateDto): Promise<SuccessResponse<ResponseDto>> {
    const response = await this.coreService.create(createDto);
    if (!response) throw new BadRequestException(SharedMessages.CREATE_FAILED);

    return new SuccessResponse<ResponseDto>(
      new this.responseDto(response),
      SharedMessages.SUCCESSFUL,
      HttpStatus.CREATED,
    );
  }

  async update(
    { id }: IdDto,
    updateDto: UpdateDto,
  ): Promise<SuccessResponse<ResponseDto>> {
    const response = await this.coreService.update(id, updateDto);
    if (!response) throw new BadRequestException(SharedMessages.UPDATE_FAILED);

    const foundItem = await this.coreService.findOneById(id);
    return new SuccessResponse<ResponseDto>(
      new this.responseDto(foundItem),
      SharedMessages.SUCCESSFUL,
      HttpStatus.OK,
    );
  }

  async delete({ id }: IdDto): Promise<SuccessResponse<void>> {
    const result = await this.coreService.deleteById(id);
    if (!result) throw new BadRequestException(SharedMessages.DELETE_FAILED);

    return new SuccessResponse<void>(
      undefined,
      SharedMessages.SUCCESSFUL,
      HttpStatus.OK,
    );
  }

  async softDelete({ id }: IdDto): Promise<SuccessResponse<void>> {
    const result = await this.coreService.softDeleteById(id);
    if (!result) throw new BadRequestException(SharedMessages.DELETE_FAILED);

    return new SuccessResponse<void>(
      undefined,
      SharedMessages.SUCCESSFUL,
      HttpStatus.OK,
    );
  }
}
