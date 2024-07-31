import { IsOptional, IsPhoneNumber as isPhoneNumber } from 'class-validator';
import { IsNotEmpty } from './default';
import { CountryCode } from 'libphonenumber-js/max';

export function IsPhoneNumber(options?: {
  region: CountryCode;
  optional: boolean;
}): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    isPhoneNumber(options.region, { message: 'validation.PHONE_NUMBER' })(
      target,
      propertyKey,
    );

    if (options && options.optional) IsOptional()(target, propertyKey);
    else IsNotEmpty()(target, propertyKey);
  };
}
