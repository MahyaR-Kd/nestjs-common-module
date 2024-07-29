import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import {
  CaptchaModuleAsyncOptions,
  CaptchaModuleFactory,
  CaptchaModuleOptions,
  CAPTCHA_MODULE_OPTIONS,
} from './captcha.interface';

@Global()
@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class CaptchaModule {
  static forRoot(options: CaptchaModuleOptions): DynamicModule {
    return {
      module: CaptchaModule,
      imports: [
        CaptchaModule.forRoot({
          secret: options.secret,
          verifyUrl: options.verifyUrl,
        }),
      ],
    };
  }

  static forRootAsync(options: CaptchaModuleAsyncOptions): DynamicModule {
    return {
      module: CaptchaModule,
      imports: [...options.imports],
      providers: [...this.createAsyncProviders(options)],
      exports: [...this.createAsyncProviders(options)],
    };
  }

  private static createAsyncProviders(
    options: CaptchaModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: CaptchaModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: CAPTCHA_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: CAPTCHA_MODULE_OPTIONS,
      useFactory: async (optionsFactory: CaptchaModuleFactory) =>
        await optionsFactory.createModuleOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
