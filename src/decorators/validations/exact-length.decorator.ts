import { IsOptional, Length } from 'class-validator';
import { IsNotEmpty } from './default';

export function ExactLength(
  length: number,
  options?: {
    optional: boolean;
  },
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    Length(length, length, {
      message: 'validation.LENGTH',
    })(target, propertyKey);
    if (options && options.optional) IsOptional()(target, propertyKey);
    else IsNotEmpty()(target, propertyKey);
  };
}
