import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  CaptchaModuleOptions,
  CAPTCHA_MODULE_OPTIONS,
  IGoogleResponse,
  ICaptchaSettings,
} from './captcha.interface';
import { RequestService } from '../request';
import { Reflector } from '@nestjs/core';
import { CachingService } from '../../caching/caching.service';
import { RedisKeys } from '../../caching/redis-keys.constant';
import { CaptchaDecorators } from './enums/captcha-decorators.enum';
import { InvalidCaptcha } from './captcha.exception';
import { HttpMethods } from '../request/enums/http-methods.enum';

@Injectable()
export class CaptchaGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(CAPTCHA_MODULE_OPTIONS)
    private captchaModuleOptions: CaptchaModuleOptions,
    private readonly requestService: RequestService<IGoogleResponse>,
    private readonly cachingService: CachingService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const captchaSettings = this.getCaptchaDetails(context);

    const request = context.switchToHttp().getRequest();

    if (captchaSettings && captchaSettings.executeAfter) {
      const ip =
        request.headers['x-forwarded-for'] || request.socket.remoteAddress;

      const result = await this.incExecutionTimes(
        ip,
        captchaSettings.executeAfter,
      );
      if (result) return true;
    }

    const text = request.headers['captcha-text'];
    if (!text) throw new InvalidCaptcha();

    await this.isCaptchaValid(text);

    return true;
  }

  private getCaptchaDetails(context: ExecutionContext): ICaptchaSettings {
    const captchaDetailsForEndpoint = this.reflector.get<ICaptchaSettings>(
      CaptchaDecorators.CAPTCHA,
      context.getHandler(),
    );
    const captchaDetailsForController = this.reflector.get<ICaptchaSettings>(
      CaptchaDecorators.CAPTCHA,
      context.getClass(),
    );
    return captchaDetailsForEndpoint || captchaDetailsForController;
  }

  // check request count by ip and increment it
  // if request count reaches the limit captcha guard appears
  private async incExecutionTimes(
    ip: string,
    executionCount: number,
  ): Promise<boolean> {
    const { name, ttl } = RedisKeys.captchaExecutionCount(ip);
    const executionTimes = await this.cachingService.get(name);

    if (executionTimes < executionCount) {
      await this.cachingService.set(name, (executionTimes || 0) + 1, ttl);
      return true;
    }
  }

  private async isCaptchaValid(text: string) {
    const result = await this.requestService.sendRaw({
      path: this.captchaModuleOptions.verifyUrl,
      body: {
        secret: this.captchaModuleOptions.secret,
        response: text,
      },
      method: HttpMethods.POST,
    });

    if (!result.data.success) throw new InvalidCaptcha();
  }
}
