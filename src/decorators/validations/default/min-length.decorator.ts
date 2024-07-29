import { MinLength as minLength } from 'class-validator';

export function MinLength(length: number): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    minLength(length, {
      message: 'validation.MIN_LENGTH',
    })(target, propertyKey);
  };
}
