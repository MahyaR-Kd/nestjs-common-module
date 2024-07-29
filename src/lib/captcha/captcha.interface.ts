import { ModuleMetadata, Type } from '@nestjs/common';

export const CAPTCHA_MODULE_OPTIONS = 'CAPTCHA_MODULE_OPTIONS';

export interface CaptchaModuleOptions {
  secret: string;
  verifyUrl: string;
}

export interface CaptchaModuleFactory {
  createModuleOptions: () =>
    | Promise<CaptchaModuleOptions>
    | CaptchaModuleOptions;
}

export interface CaptchaModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<CaptchaModuleFactory>;
  useExisting?: Type<CaptchaModuleFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<CaptchaModuleOptions> | CaptchaModuleOptions;
}

export interface IGoogleResponse {
  success: boolean;
  challenge_ts: Date;
  hostname?: string;
  apk_package_name?: string;
  error_codes: Array<string>;
}

export interface ICaptchaSettings {
  executeAfter: number;
}
