import { Message, Producer, ProducerBatch, TopicMessages } from 'kafkajs';
import { Logger } from '@nestjs/common';
import { kafka } from './kafka-instance.const';

export default class KafkaProducerService {
  private producer: Producer;

  constructor(clientId: string, brokers: string[]) {
    this.producer = this.createProducer(clientId, brokers);
    this.setupGracefulShutdown();
  }

  private setupGracefulShutdown(): void {
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

  public async start() {
    await this.producer.connect();
    return this;
  }

  public async shutdown(): Promise<void> {
    await this.producer.disconnect();
  }

  public async sendBatch(
    topic: string,
    messages: Array<object>,
  ): Promise<void> {
    const kafkaMessages: Array<Message> = messages.map((message) => {
      return {
        value: JSON.stringify(message),
      };
    });

    const topicMessages: TopicMessages = {
      topic,
      messages: kafkaMessages,
    };

    const batch: ProducerBatch = {
      topicMessages: [topicMessages],
    };

    await this.producer.sendBatch(batch);
  }

  async sendEvent(
    topic: string,
    message: unknown,
    partition: number = undefined,
  ) {
    const producer: Producer = this.producer;

    const kafkaMessage: Message = {
      value: typeof message == 'string' ? message : JSON.stringify(message),
    };

    // If partition is specified, set it in the send method
    kafkaMessage.partition = partition;

    const sendOptions: { topic: string; messages: Message[] } = {
      topic,
      messages: [kafkaMessage],
    };

    await producer.send(sendOptions);
  }

  private createProducer(clientId: string, brokers: string[]): Producer {
    return kafka(clientId, brokers).producer();
  }
}
