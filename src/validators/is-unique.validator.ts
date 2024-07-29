import { ValidatorConstraint } from 'class-validator';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  CustomValidationArguments,
  CustomValidatorConstraintInterface,
} from '../interfaces/custom-validation-arguments.interface';

type ValidationEntity =
  | {
      id?: number | string;
    }
  | undefined;

@Injectable()
@ValidatorConstraint({ name: 'IsUnique', async: true })
export class IsUnique implements CustomValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async validate(
    value: string,
    validationArguments: CustomValidationArguments,
  ) {
    const repository = validationArguments.constraints[0]?.repository;
    const targetRepository = this.dataSource.getRepository(repository);

    const pathToProperty =
      validationArguments.constraints[0]?.pathToProperty ??
      validationArguments.property;
    const whereQuery =
      (validationArguments?.constraints[0]?.whereQuery as FindOptionsWhere<
        typeof targetRepository
      >) ?? [];

    let combineQuery = {};

    validationArguments?.constraints[0]?.stringPropertyQuery?.map(
      (condition: string) => {
        combineQuery = {
          ...combineQuery,
          [condition]: validationArguments.object?.[condition],
        };
      },
    );
    const entity = (await targetRepository.findOne({
      where: {
        [pathToProperty ? pathToProperty : validationArguments.property]: value
          ? value
          : value?.[pathToProperty],
        ...whereQuery,
      },
    })) as ValidationEntity;

    if (entity?.id) {
      return false;
    }

    return true;
  }
}
