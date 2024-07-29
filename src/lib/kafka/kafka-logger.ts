import { Logger } from '@nestjs/common';
import { logLevel, LogEntry, logCreator } from 'kafkajs';

export // This function returns a LogCreator that is compatible with KafkaJS requirements
const createKafkaLoggerAdapter: logCreator = () => {
  const nestLogger = new Logger('KafkaJS', { timestamp: true });
  // Converts KafkaJS log levels to appropriate NestJS log methods
  const logMethodMap = {
    [logLevel.ERROR]: 'error',
    [logLevel.WARN]: 'warn',
    [logLevel.INFO]: 'log',
    [logLevel.DEBUG]: 'debug',
    [logLevel.NOTHING]: 'verbose', // Adjust according to your preference
  };

  return ({ namespace, level, label, log }: LogEntry) => {
    const { message, ...extra } = log;
    const method = logMethodMap[level] || 'log';

    nestLogger[method](
      `${label} [${namespace}] ${message}`,
      JSON.stringify(extra),
    );
  };
};
