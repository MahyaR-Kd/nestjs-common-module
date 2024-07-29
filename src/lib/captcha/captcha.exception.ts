import { UnauthorizedException } from '@nestjs/common';
import { CaptchaErrors } from './enums/captcha-messages.enum';

export class InvalidCaptcha extends UnauthorizedException {
  constructor() {
    super(CaptchaErrors.INVALID_CAPTCHA);
  }
}
