import { Environments } from '../enums/environments.enum';

export function genEnvFilename() {
  return process.env.NODE_ENV === Environments.TEST
    ? `.env.${process.env.NODE_ENV}`
    : '.env';
}
