import { MaxLength as maxLength } from 'class-validator';

export function MaxLength(length: number): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    maxLength(length, {
      message: 'validation.MAX_LENGTH',
    })(target, propertyKey);
  };
}
