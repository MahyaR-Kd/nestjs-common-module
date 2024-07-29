import { ArrayMaxSize as arrayMaxSize } from 'class-validator';

export function ArrayMaxSize(length: number): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    arrayMaxSize(length, {
      message: 'validation.ARRAY_MAX_SIZE',
    })(target, propertyKey);
  };
}
