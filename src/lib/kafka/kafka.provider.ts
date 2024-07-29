import { KafkaService } from './kafka.service';
import { KafkaModuleOptions } from './kafka.interface';

export const KafkaProviders = [
  {
    provide: 'KAFKA_MODEL',
    useFactory: (options: KafkaModuleOptions) => new KafkaService(options),
    inject: ['DATABASE_CONNECTION'],
  },
];
