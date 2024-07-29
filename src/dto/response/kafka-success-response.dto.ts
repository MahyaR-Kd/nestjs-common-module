import { IsNumber, IsOptional, IsString } from 'class-validator';
import { KafkaSuccessResponseInterface } from '../../interfaces/kafka-success-response.interfase';

export class BaseKafkaEventDto<type> {
  @IsString()
  @IsOptional()
  topic?: string;

  @IsString()
  event_source: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  event_key?: string;

  @IsOptional()
  data?: type;

  @IsNumber()
  @IsOptional()
  partition?: number;

  @IsNumber()
  @IsOptional()
  status?: number;
}

export class KafkaSuccessResponse<type> extends BaseKafkaEventDto<type> {
  constructor({
    data,
    event_source,
    topic,
    model,
    event_key,
    partition,
    status,
  }: KafkaSuccessResponseInterface<type>) {
    super();

    this.data = data;
    this.topic = topic;
    this.event_source = event_source;
    this.model = model;
    this.event_key = event_key;
    this.partition = partition;
    this.status = status;
  }

  public stringify() {
    return JSON.stringify(this);
  }
}
