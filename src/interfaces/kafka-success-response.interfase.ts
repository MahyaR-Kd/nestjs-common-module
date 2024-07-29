export interface KafkaSuccessResponseInterface<type> {
  data: type;
  event_source: string;
  topic?: string;
  model?: string;
  event_key?: string;
  partition?: number;
  status?: number;
}
