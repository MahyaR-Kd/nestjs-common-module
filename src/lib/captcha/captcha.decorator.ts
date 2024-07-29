import { SetMetadata } from '@nestjs/common';
import { CaptchaDecorators } from './enums/captcha-decorators.enum';

export const Captcha = (params: { executeAfter: number }) =>
  SetMetadata(CaptchaDecorators.CAPTCHA, params);
