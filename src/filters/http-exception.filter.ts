import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../dto';
import { ConfigService } from '@nestjs/config';
import { SharedMessages } from '../enums/shared-messages.enum';
import { KafkaContext } from '@nestjs/microservices';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const result = exception.getResponse() as {
      message: string | string[];
      error: string | string[];
      details: any;
    };
    const logger = new Logger('OrderKafkaController', { timestamp: true });

    if (response instanceof KafkaContext) {
      logger.error(result);

      // TODO: add sentry for manage kafka exceptions
    }
    try {
      if (status === HttpStatus.UNPROCESSABLE_ENTITY) {
        return response.status(status).json(result);
      } else if (status === HttpStatus.BAD_REQUEST) {
        // if (result instanceof SharedMessages) {
        //
        // }
        return response
          .status(status)
          .json(
            new ErrorResponse(
              String(result?.error),
              status,
              typeof result?.message === 'string'
                ? result?.message
                : result?.message[0],
            ),
          );
      } else {
        let message: string;

        if (typeof result.message === 'string') {
          message = result?.message;
        } else {
          message = result?.message[0];
        }

        return response.status(status).json(new ErrorResponse(message, status));
      }
    } catch (err) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ErrorResponse(
            SharedMessages.INTERNAL_SERVER_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  }
}
