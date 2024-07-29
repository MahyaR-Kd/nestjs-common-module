import { IsEnum as isEnum } from 'class-validator';

export function IsEnum(value: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    isEnum(value, {
      message: 'validation.ENUM',
    })(target, propertyKey);
  };
}
