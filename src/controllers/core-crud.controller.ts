import {
  NotFoundException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Paginate, Paginated } from 'nestjs-paginate';
import { PaginateConfig } from 'nestjs-paginate/lib/paginate';
import { PaginationQueryCustomDto } from '../dto';
import { SharedMessages } from '../enums';
import { SuccessResponse } from '../dto';
import { BaseResponseWithActionDates } from '../dto';
import { IdDto } from '../dto';
import { CoreCrudService } from '../services';
import { BaseModelEntity } from '../entities';

export class CoreCrudController<
  T extends BaseModelEntity,
  CreateDto,
  UpdateDto,
  ResponseDto extends BaseResponseWithActionDates,
> {
  protected constructor(
    protected readonly coreService: CoreCrudService<T, CreateDto, UpdateDto>,
    protected readonly responseDto: any,
  ) {}

  async findAll(
    @Paginate() query: PaginationQueryCustomDto,
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

    return new SuccessResponse<ResponseDto>({
      data: new this.responseDto(response),
      message: SharedMessages.SUCCESSFUL,
      statusCode: HttpStatus.OK,
    });
  }

  async create(createDto: CreateDto): Promise<SuccessResponse<ResponseDto>> {
    const response = await this.coreService.create(createDto);
    if (!response) throw new BadRequestException(SharedMessages.CREATE_FAILED);

    return new SuccessResponse<ResponseDto>({
      data: new this.responseDto(response),
      message: SharedMessages.SUCCESSFUL,
      statusCode: HttpStatus.CREATED,
    });
  }

  async update(
    { id }: IdDto,
    updateDto: UpdateDto,
  ): Promise<SuccessResponse<ResponseDto>> {
    const response = await this.coreService.update(id, updateDto);
    if (!response) throw new BadRequestException(SharedMessages.UPDATE_FAILED);

    const foundItem = await this.coreService.findOneById(id);
    return new SuccessResponse<ResponseDto>({
      data: new this.responseDto(foundItem),
      message: SharedMessages.SUCCESSFUL,
      statusCode: HttpStatus.OK,
    });
  }

  async delete({ id }: IdDto): Promise<SuccessResponse<void>> {
    const result = await this.coreService.deleteById(id);
    if (!result) throw new BadRequestException(SharedMessages.DELETE_FAILED);

    return new SuccessResponse<void>({
      data: undefined,
      message: SharedMessages.SUCCESSFUL,
      statusCode: HttpStatus.OK,
    });
  }

  async softDelete({ id }: IdDto): Promise<SuccessResponse<void>> {
    const result = await this.coreService.softDeleteById(id);
    if (!result) throw new BadRequestException(SharedMessages.DELETE_FAILED);

    return new SuccessResponse<void>({
      data: undefined,
      message: SharedMessages.SUCCESSFUL,
      statusCode: HttpStatus.OK,
    });
  }
}
