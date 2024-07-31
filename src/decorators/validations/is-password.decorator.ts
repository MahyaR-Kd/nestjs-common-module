import { IsNotEmpty, IsString, Matches } from './default';

export function IsPassword(pattern?: RegExp | string): PropertyDecorator {
  const machPattern = pattern
    ? pattern
    : /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  return function (target: any, propertyKey: string | symbol): void {
    IsString()(target, propertyKey);
    IsNotEmpty()(target, propertyKey);
    Matches(machPattern)(target, propertyKey);
  };
}
