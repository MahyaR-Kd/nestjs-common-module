import { Consumer } from 'kafkajs';
import { Logger } from '@nestjs/common';
import { kafka } from './kafka-instance.const';

export default class KafkaConsumerService {
  private kafkaConsumer: Consumer;

  public constructor(clientId, brokers, groupId) {
    this.kafkaConsumer = this.createKafkaConsumer(clientId, brokers, groupId);

    const errorTypes = ['unhandledRejection', 'uncaughtException'];
    const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

    errorTypes.forEach((type) => {
      process.on(type, async (e) => {
        try {
          Logger.log(`process.on ${type}`);
          Logger.error(e);
          await this.shutdown();
          process.exit(0);
        } catch (_) {
          process.exit(1);
        }
      });
    });

    signalTraps.forEach((type) => {
      process.once(type, async () => {
        try {
          await this.shutdown();
        } finally {
          process.kill(process.pid, type);
        }
      });
    });
  }

  public async connectConsumer(): Promise<Consumer> {
    await this.kafkaConsumer.connect();
    return this.kafkaConsumer;
  }

  public async healthCheck() {
    const describe = await this.kafkaConsumer.describeGroup();
    return describe.state;
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect();
  }

  private createKafkaConsumer(
    clientId,
    brokers,
    groupId = 'consumer-group',
  ): Consumer {
    return kafka(clientId, brokers).consumer({ groupId });
  }
}
