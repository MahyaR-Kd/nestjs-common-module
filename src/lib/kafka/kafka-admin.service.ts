import { Admin } from 'kafkajs';
import { Logger } from '@nestjs/common';
import { kafka } from './kafka-instance.const';

export default class KafkaAdminService {
  private kafkaAdmin: Admin;

  public constructor(clientId: string, brokers: string[]) {
    this.kafkaAdmin = this.createKafkaAdmin(clientId, brokers);

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

  async getTopics() {
    let topics = await this.kafkaAdmin.listTopics();
    topics = topics.filter((topic) => topic.slice(0, 1) !== '_');
    return topics;
  }

  private async shutdown(): Promise<void> {
    await this.kafkaAdmin.disconnect();
  }

  private createKafkaAdmin(clientId, brokers): Admin {
    return kafka(clientId, brokers).admin();
  }
}
