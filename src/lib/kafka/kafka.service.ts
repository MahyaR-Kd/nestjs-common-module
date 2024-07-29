import { Inject, Injectable, Logger } from '@nestjs/common';
import { Consumer } from 'kafkajs';
import KafkaConsumerService from './kafka-consumer.service';
import { KAFKA_MODULE_OPTIONS, KafkaModuleOptions } from './kafka.interface';
import { env } from '../../helpers/get-env.helper';
import { KafkaHealthState } from './constant/kafka.const';
import KafkaAdminService from './kafka-admin.service';
import KafkaProducerService from './kafka-producer.service';

@Injectable()
export class KafkaService {
  private static instance: KafkaService;
  private consumers: { [groupId: string]: KafkaConsumerService };
  private consumersInstance: { [groupId: string]: Consumer };
  private producerInstance: KafkaProducerService;
  private adminInstance: KafkaAdminService;
  public topics: { [groupId: string]: string[] };
  public groupIds: { [item: string]: string };

  constructor(
    @Inject(KAFKA_MODULE_OPTIONS)
    private kafkaModuleOptions: KafkaModuleOptions,
  ) {
    this.adminInstance = new KafkaAdminService(
      this.kafkaModuleOptions.clientId,
      this.kafkaModuleOptions.brokers,
    );
  }

  // Kafka Admin

  /**
   * Getting available topics using Kafka admin instance
   */
  async getAvailableTopics() {
    return await this.adminInstance.getTopics();
  }

  // Kafka Producer

  /**
   * Make Producer instance and starting a Kafka producer service
   */
  async startProducer() {
    this.producerInstance = new KafkaProducerService(
      this.kafkaModuleOptions.clientId,
      this.kafkaModuleOptions.brokers,
    );
    await this.producerInstance.start();
    Logger.log('Producer is Connected', 'KafkaProducer');
  }

  /**
   * Stopping Producer instance of Kafka producer service
   */
  async stopProducer() {
    await this.producerInstance.shutdown();
    Logger.log('Producer is Disconnected', 'KafkaProducer');
  }

  /**
   * sending an event using Kafka producer
   * @param topic
   * @param message
   * @param partition
   */
  async sendProducerEvent(
    topic: string,
    message: unknown,
    partition: number = undefined,
  ) {
    await this.producerInstance.sendEvent(topic, message, partition);
  }

  // Kafka Consumer

  /**
   * This function sets up multiple Kafka consumers based on the provided information,
   * initializing group IDs, topics, and consumer instances for each group.
   */
  async setBulkConsumer(
    consumersInfo: {
      groupIdKey: string;
      topics: string[];
      groupIdDefaultValue?: string;
    }[],
  ) {
    await Promise.all(
      consumersInfo.map((item) => {
        this.groupIds = {
          ...this.groupIds,
          [item.groupIdKey]: env(item.groupIdKey, item?.groupIdDefaultValue),
        };
        this.topics = {
          ...this.topics,
          [this.groupIds[item.groupIdKey]]: item?.topics,
        };
        this.consumers = {
          ...this.consumers,
          [this.groupIds[item.groupIdKey]]: new KafkaConsumerService(
            this.kafkaModuleOptions.clientId,
            this.kafkaModuleOptions.brokers,
            this.groupIds[item.groupIdKey],
          ),
        };
      }),
    );
  }

  /**
   * method setConsumer which sets up a Kafka consumer with the provided:
   * groupIdKey, topics, and optional groupIdDefaultValue value.
   * @param consumersInfo
   */
  async setConsumer(consumersInfo: {
    groupIdKey: string;
    topics: string[];
    groupIdDefaultValue?: string;
  }) {
    this.groupIds = {
      ...this.groupIds,
      [consumersInfo.groupIdKey]: env(
        consumersInfo.groupIdKey,
        consumersInfo?.groupIdDefaultValue,
      ),
    };
    this.topics = {
      ...this.topics,
      [this.groupIds[consumersInfo.groupIdKey]]: consumersInfo?.topics,
    };
    this.consumers = {
      ...this.consumers,
      [this.groupIds[consumersInfo.groupIdKey]]: new KafkaConsumerService(
        this.kafkaModuleOptions.clientId,
        this.kafkaModuleOptions.brokers,
        this.groupIds[consumersInfo.groupIdKey],
      ),
    };
  }

  /**
   * Asynchronously starts all consumers, subscribes them to respective topics.
   */
  async startAllConsumers() {
    const consumerKeys = Object.keys(this.consumers);
    for await (const key of consumerKeys) {
      this.consumersInstance = {
        ...this.consumersInstance,
        [key]: await this.consumers[key].connectConsumer(),
      };
      await this.consumersInstance[key].subscribe({ topics: this.topics[key] });
    }
    Logger.log(
      `Consumer is Connected. consumer-list: ${consumerKeys.join(', ')}`,
      'KafkaConsumer',
    );
  }

  /**
   * Stops all consumers by asynchronously shutting them down.
   */
  async stopAllConsumers() {
    return await Promise.all(
      Object.keys(this.consumers).map(async (key) => {
        await this.consumers[key].shutdown();
      }),
    );
  }

  /**
   * Method to start a consumer by group ID asynchronously.
   * @param groupId
   * @param fromBeginning
   */
  async startConsumerByGroupId(
    groupId: string,
    fromBeginning: boolean = false,
  ) {
    // Start the consumer for the given group ID and store the instance
    this.consumersInstance = {
      ...this.consumersInstance,
      [groupId]: await this.consumers[groupId].connectConsumer(),
    };
    await this.consumersInstance[groupId].subscribe({
      fromBeginning,
      topics: this.topics[groupId],
    });
    Logger.log(`\"${groupId}\" is Connected.`, 'KafkaConsumer');
    // Return the consumer instance
    return this.consumersInstance[groupId];
  }

  /**
   * Method to stop a consumer by group ID.
   */
  async stopConsumerByGroupId(groupId: string) {
    return await this.consumers[groupId].shutdown();
  }

  /**
   * This method performs a health check on a specific Kafka consumer group and determines its state.
   * It checks the Kafka state and whether any topics are paused in the consumer group.
   * Returns the KafkaHealthState based on the conditions met.
   */
  async healthCheck(groupId: string) {
    const kafkaState =
      (await this.consumers?.[groupId].healthCheck()) ?? KafkaHealthState.Dead;
    if (kafkaState === KafkaHealthState.Stable) {
      const paused = this.consumersInstance[groupId].paused();
      const isPaused = paused.filter(
        (item) => item.topic === this.topics[groupId][0],
      );
      if (isPaused.length !== 0) return KafkaHealthState.Pause;
    }
    return KafkaHealthState[kafkaState];
  }

  /**
   * Retrieves a consumer instance by group ID.
   */
  getConsumerInstanceByGroupId(groupId: string) {
    return this.consumersInstance[groupId];
  }
}
