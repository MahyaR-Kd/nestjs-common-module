import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ParentEntity } from '../entities/parent.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { paginate, Paginated } from 'nestjs-paginate';
import { PaginateConfig } from 'nestjs-paginate/lib/paginate';
import { ObjectId } from 'typeorm/driver/mongodb/typings';
import { PaginationQueryCustom } from '../interfaces/pagination-query';
import { SharedMessages } from '../enums/shared-messages.enum';
import { InsertResult } from 'typeorm/query-builder/result/InsertResult';
import { CoreCrudServiceOption } from '../interfaces';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';
import { MessageFormatter } from '../helpers/message-formatter.helper';

@Injectable()
export abstract class CoreCrudService<
  T extends ParentEntity,
  CreateDto,
  UpdateDto,
> {
  private readonly relationsPath: string[];

  protected constructor(protected readonly repository: Repository<T>) {
    const metadata = this.repository.metadata;
    this.relationsPath = metadata.relations.map(
      (relation) => relation.propertyPath,
    );
  }

  async create(
    createDto: CreateDto,
    options?: CoreCrudServiceOption<T>,
  ): Promise<T> {
    const relationEntityName = Object.keys(createDto).filter(
      (item) => this.relationsPath.includes(item) && createDto[item],
    );

    relationEntityName.map((item) => {
      createDto[item] = createDto[item].map((id: number) => {
        return { id };
      });
    });

    const entity = this.repository.create(createDto as DeepPartial<T>);

    if (options?.entityManager) {
      return await options.entityManager.save(entity);
    } else {
      return await this.repository.save(entity);
    }
  }

  async findAllWithPagination(
    query: PaginationQueryCustom,
    paginateConfig: PaginateConfig<T>,
    options?: CoreCrudServiceOption<T>,
  ): Promise<Paginated<T>> {
    return await paginate<T>(query, this.repository, {
      ...paginateConfig,
      relations: options?.relations ? options?.relations : this.relationsPath,
    });
  }

  async findAll(
    query: FindManyOptions<T>,
    options?: CoreCrudServiceOption<T>,
  ): Promise<T[]> {
    let result: T[] | PromiseLike<T[]>;
    if (!options?.entityManager)
      result = await this.repository.find({
        relations: this.relationsPath,
        ...query,
      });
    else
      result = await options.entityManager.find(this.repository.target, {
        relations: this.relationsPath,
        ...query,
      });
    if (options?.existsCheck && !result) {
      throw new NotFoundException(SharedMessages.RESOURCE_NOT_FOUND);
    }
    return result;
  }

  async findOneById(
    id: number,
    options?: CoreCrudServiceOption<T>,
  ): Promise<T> {
    let result: T;

    if (options?.entityManager) {
      result = await options.entityManager.findOne<T>(this.repository.target, {
        where: {
          id,
        } as FindOptionsWhere<T>,
        relations: options?.relations ? options?.relations : this.relationsPath,
      });
    } else {
      result = await this.repository.findOne({
        where: {
          id,
        } as FindOptionsWhere<T>,
        relations: options?.relations ? options?.relations : this.relationsPath,
      });
    }
    if (options?.existsCheck && !result) {
      throw new NotFoundException(SharedMessages.RESOURCE_NOT_FOUND);
    }
    return result;
  }

  async findOne(
    query: FindManyOptions<T>,
    options?: CoreCrudServiceOption<T>,
  ): Promise<T> {
    const whereQuery = this.validateWhereQuery(query.where);
    if (!whereQuery) {
      return undefined;
    }
    query.where = whereQuery;
    let result: T;

    if (options?.entityManager) {
      result = await options?.entityManager.findOne<T>(this.repository.target, {
        relations: this.relationsPath,
        ...query,
      });
    } else {
      result = await this.repository.findOne({
        ...query,
        relations: query?.relations ? query?.relations : this.relationsPath,
      });
    }

    if (options?.existsCheck && !result) {
      throw new NotFoundException(SharedMessages.RESOURCE_NOT_FOUND);
    }
    return result;
  }

  async isExists(
    query: FindManyOptions<T>,
    options?: CoreCrudServiceOption<T>,
  ): Promise<boolean> {
    // const whereQuery = this.validateWhereQuery(query.where);
    // if (!whereQuery) {
    //   return undefined;
    // }
    // query.where = whereQuery;
    let result: boolean;

    if (options?.entityManager) {
      result = await options?.entityManager.exists<T>(this.repository.target, {
        relations: query?.relations ? query?.relations : this.relationsPath,
        ...query,
      });
    } else {
      result = await this.repository.exists({
        ...query,
        relations: query?.relations ? query?.relations : this.relationsPath,
      });
    }

    return result;
  }

  async count(
    query: FindManyOptions<T>,
    options?: CoreCrudServiceOption<T>,
  ): Promise<number> {
    const whereQuery = this.validateWhereQuery(query.where);
    if (!whereQuery) {
      return undefined;
    }
    query.where = whereQuery;
    let result: number;

    if (options?.entityManager) {
      result = await options?.entityManager.count<T>(this.repository.target, {
        relations: query?.relations ? query?.relations : this.relationsPath,
        ...query,
      });
    } else {
      result = await this.repository.count({
        ...query,
        relations: query?.relations ? query?.relations : this.relationsPath,
      });
    }

    return result;
  }

  async upsert(
    upsertDto: QueryDeepPartialEntity<T>,
    upsertOptions: UpsertOptions<T>,
    options?: CoreCrudServiceOption<T>,
  ): Promise<InsertResult> {
    try {
      let conflictPaths: string[] = [];

      let findWhereQuery: FindOptionsWhere<T> = {};
      if (this.isArray(upsertOptions.conflictPaths)) {
        conflictPaths = (upsertOptions.conflictPaths as string[]) ?? [];
      } else {
        conflictPaths = Object.keys(
          upsertOptions.conflictPaths as { [P in keyof T]?: true },
        );
      }
      conflictPaths.map((path) => {
        findWhereQuery = {
          ...findWhereQuery,
          [path]: upsertDto[path],
        };
      });
      if (!options?.entityManager) {
        const existEntity = await this.repository.findOne({
          where: findWhereQuery,
          select: ['id'],
        });

        return await this.repository.upsert(
          { id: existEntity.id, ...upsertDto },
          upsertOptions,
        );
      } else {
        const existEntity = await options?.entityManager.findOne<T>(
          this.repository.target,
          {
            where: findWhereQuery,
            select: ['id'],
          },
        );
        return await options?.entityManager.upsert(
          this.repository.target,
          { id: existEntity.id, ...upsertDto },
          upsertOptions,
        );
      }
      // Delete Cache
    } catch (error) {
      throw new BadRequestException(
        MessageFormatter.replace(SharedMessages.UPSERT_FAILED, error),
      );
    }
  }

  async update(
    id: number,
    updateDto: Partial<UpdateDto> | DeepPartial<T> | QueryDeepPartialEntity<T>,
    options?: CoreCrudServiceOption<T>,
  ): Promise<UpdateResult> {
    if (!options?.entityManager) {
      const fetchedItem = await this.repository.findOne({
        where: { id } as FindOptionsWhere<T>,
        relations: this.relationsPath,
      });

      if (!fetchedItem)
        throw new NotFoundException(SharedMessages.RESOURCE_NOT_FOUND);

      const relationEntityName = Object.keys(updateDto).filter(
        (item) => this.relationsPath.includes(item) && updateDto[item],
      );
      relationEntityName.map((item) => {
        delete fetchedItem[item];
        updateDto[item] = updateDto[item].map((id: number) => {
          return { id };
        });
      });
      const merged = this.repository.merge(
        fetchedItem,
        updateDto as unknown as DeepPartial<T>,
      );
      await this.repository.save(merged);

      return {
        generatedMaps: [],
        raw: merged,
        affected: 1,
      } as UpdateResult;
    } else {
      // Transaction context: use the provided EntityManager
      const fetchedItem = await options?.entityManager.findOne<T>(
        this.repository.target,
        {
          where: { id } as FindOptionsWhere<T>,
          relations: this.relationsPath,
        },
      );
      if (!fetchedItem)
        throw new NotFoundException(SharedMessages.RESOURCE_NOT_FOUND);

      const relationEntityName = Object.keys(updateDto).filter(
        (item) => this.relationsPath.includes(item) && updateDto[item],
      );
      relationEntityName.map((item) => {
        delete fetchedItem[item];
        updateDto[item] = updateDto[item].map((id: number) => {
          return { id };
        });
      });

      const merged = options?.entityManager.merge(
        this.repository.target,
        fetchedItem,
        updateDto as unknown as DeepPartial<T>,
      );
      await options?.entityManager.save(merged);
      // Delete Cache
      return {
        generatedMaps: [],
        raw: merged,
        affected: 1,
      } as UpdateResult;
    }
  }

  async softDelete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<T>,
    options?: CoreCrudServiceOption<T>,
  ): Promise<UpdateResult> {
    if (options?.entityManager) {
      return await options?.entityManager.softDelete(
        this.repository.target,
        criteria,
      );
    } else {
      return await this.repository.softDelete(criteria);
    }
  }

  async softDeleteById(
    id: number,
    options?: CoreCrudServiceOption<T>,
  ): Promise<UpdateResult> {
    if (options?.entityManager) {
      return await options?.entityManager.softDelete(
        this.repository.target,
        id,
      );
    } else {
      return await this.repository.softDelete(id);
    }
  }

  async delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<T>,
    options?: CoreCrudServiceOption<T>,
  ): Promise<DeleteResult> {
    if (options?.entityManager) {
      return await options?.entityManager.delete(
        this.repository.target,
        criteria,
      );
    } else {
      return await this.repository.delete(criteria);
    }
  }

  async deleteById(
    id: number,
    options?: CoreCrudServiceOption<T>,
  ): Promise<DeleteResult> {
    if (options?.entityManager) {
      return await options?.entityManager.delete(this.repository.target, id);
    } else {
      return await this.repository.delete(id);
    }
  }

  private validateWhereQuery(
    query: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ) {
    if (this.isArray(query)) {
      const newArrayQuery: FindOptionsWhere<T>[] = [];

      query = query as FindOptionsWhere<T>[];
      if (query.length !== 0) {
        query.map((key, index) => {
          if (this.isArray(query[index])) {
            return query[index].map((item) => this.validateWhereQuery(item));
          }
          if (this.isObject(query[index])) {
            this.validateWhereQuery(query[index]);
          }
          if (query[index] !== undefined) {
            newArrayQuery.push({
              [index]: query[index],
            } as FindOptionsWhere<T>);
          }
        });
      }
      if (Object.keys(newArrayQuery).length === 0) return undefined;
      return newArrayQuery;
    } else {
      let newQuery: FindOptionsWhere<T> = {};

      const queryKeys = Object.keys(query);

      if (queryKeys.length !== 0) {
        queryKeys.map((key) => {
          if (this.isArray(query[key])) {
            return query[key].map((item) => this.validateWhereQuery(item));
          }
          if (this.isObject(query[key])) {
            this.validateWhereQuery(query[key]);
          }
          if (query[key] !== undefined) {
            newQuery = {
              ...newQuery,
              [key]: query[key],
            } as FindOptionsWhere<T>;
          }
        });
      }
      if (Object.keys(newQuery).length === 0) return undefined;
      return newQuery;
    }
  }

  private isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  private isArray(value: any): boolean {
    return value !== null && typeof value === 'object' && Array.isArray(value);
  }
}
