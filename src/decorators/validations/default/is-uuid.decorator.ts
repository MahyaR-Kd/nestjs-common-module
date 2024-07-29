import { IsUUID as isUUID } from 'class-validator';

export function IsUUID(options?: { each?: boolean }): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    isUUID(4, options)(target, propertyKey);
  };
}
