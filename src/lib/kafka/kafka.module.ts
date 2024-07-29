import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import {
  KAFKA_MODULE_OPTIONS,
  KafkaModuleAsyncOptions,
  KafkaModuleFactory,
  KafkaModuleOptions,
} from './kafka.interface';
import { KafkaService } from './index';

@Global()
@Module({})
export class KafkaModule {
  static forRoot(options: KafkaModuleOptions): DynamicModule {
    return {
      module: KafkaModule,
      providers: [
        {
          provide: KAFKA_MODULE_OPTIONS,
          useValue: options,
        },
        KafkaService,
      ],
      exports: [KafkaService],
    };
  }

  static forRootAsync(options: KafkaModuleAsyncOptions): DynamicModule {
    return {
      module: KafkaModule,
      imports: [...options.imports],
      providers: [...this.createAsyncProviders(options), KafkaService],
      exports: [...this.createAsyncProviders(options), KafkaService],
    };
  }

  private static createAsyncProviders(
    options: KafkaModuleAsyncOptions,
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

  private static createProviders(options: KafkaModuleOptions): Provider[] {
    return [this.createOptionsProvider(options)];
  }
  private static createAsyncOptionsProvider(
    options: KafkaModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: KAFKA_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: KAFKA_MODULE_OPTIONS,
      useFactory: async (optionsFactory: KafkaModuleFactory) =>
        await optionsFactory.createModuleOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static createOptionsProvider(options: KafkaModuleOptions): Provider {
    return {
      provide: KAFKA_MODULE_OPTIONS,
      useFactory: async (optionsFactory: KafkaModuleFactory) =>
        await optionsFactory.createModuleOptions(),
    };
  }
}
