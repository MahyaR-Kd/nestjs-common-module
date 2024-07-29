import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource } from 'typeorm';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

type ValidationEntity =
  | {
      id?: number | string;
    }
  | undefined;

@Injectable()
@ValidatorConstraint({ name: 'DoesExist', async: true })
export class DoesExist implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0] as string;
    const pathToProperty = validationArguments.constraints[1];
    const targetRepository = this.dataSource.getRepository(repository);
    const entity = (await targetRepository.findOne({
      where: {
        [pathToProperty ? pathToProperty : validationArguments.property]: value
          ? value
          : value?.[pathToProperty],
      },
    })) as ValidationEntity;

    if (entity?.id === value) {
      return true;
    }

    return false;
  }
}
