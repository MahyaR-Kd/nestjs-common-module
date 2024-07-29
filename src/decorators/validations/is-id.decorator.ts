import { IsOptional } from 'class-validator';
import { IsInt, IsNotEmpty, IsPositive, Max } from './default';
import { ValidationConstraints } from '../../constants/validation-constraints.const';

export function IsId(options?: {
  optional?: boolean;
  each?: boolean;
}): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const each = (options && options.each) || false;
    IsInt({ each })(target, propertyKey);
    IsPositive({ each })(target, propertyKey);
    Max(ValidationConstraints.maxIntegerValue, {
      each,
    })(target, propertyKey);

    if (options && options.optional) IsOptional()(target, propertyKey);
    else IsNotEmpty()(target, propertyKey);
  };
}
