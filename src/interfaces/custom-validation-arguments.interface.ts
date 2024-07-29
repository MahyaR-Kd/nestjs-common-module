import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { ValidatorConstraintInterface } from 'class-validator/types/validation/ValidatorConstraintInterface';

export interface CustomValidationArguments extends ValidationArguments {
  constraints: CustomConstraintsInterface[];
}

export interface CustomConstraintsInterface {
  repository: string;
  pathToProperty?: string;
  whereQuery?: object;
  stringPropertyQuery?: string[];
}
export interface CustomValidatorConstraintInterface
  extends ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: CustomValidationArguments,
  ): Promise<boolean> | boolean;
}
