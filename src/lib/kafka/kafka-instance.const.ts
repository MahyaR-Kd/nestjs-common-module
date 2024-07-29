import { createKafkaLoggerAdapter } from './kafka-logger';
import { Kafka } from 'kafkajs';

export const kafka = (clientId: string, brokers: string[]) =>
  new Kafka({
    clientId,
    brokers,
    logCreator: createKafkaLoggerAdapter,
  });
