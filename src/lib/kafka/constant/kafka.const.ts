export enum KafkaHealthState {
  Unknown = 'Unknown',
  PreparingRebalance = 'PreparingRebalance',
  CompletingRebalance = 'CompletingRebalance',
  Stable = 'Stable',
  Dead = 'Dead',
  Empty = 'Empty',
  Pause = 'Pause',
}
