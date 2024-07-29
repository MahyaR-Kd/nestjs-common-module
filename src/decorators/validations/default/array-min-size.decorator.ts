import { ArrayMinSize as arrayMinSize } from 'class-validator';

export function ArrayMinSize(length: number): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    arrayMinSize(length, {
      message: 'validation.ARRAY_MIN_SIZE',
    })(target, propertyKey);
  };
}
