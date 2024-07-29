import { ModuleMetadata, Type } from '@nestjs/common';

export const KAFKA_MODULE_OPTIONS = 'KAFKA_MODULE_OPTIONS';

export interface KafkaModuleOptions {
  clientId: string;
  brokers: string[];
}

export interface KafkaModuleFactory {
  createModuleOptions: () => Promise<KafkaModuleOptions> | KafkaModuleOptions;
}

export interface KafkaModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<KafkaModuleFactory>;
  useExisting?: Type<KafkaModuleFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<KafkaModuleOptions> | KafkaModuleOptions;
}
