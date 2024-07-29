import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class KafkaExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    return super.catch(exception, host);
  }
}

// @Catch(RpcException)
// export class CustomRpcExceptionFilter
//   implements RpcExceptionFilter<RpcException>
// {
//   catch(exception: RpcException, host: ArgumentsHost) {
//     const ctx = host.switchToRpc();
//     const response = ctx.getContext();
//
//     const status =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.INTERNAL_SERVER_ERROR;
//
//     const message = exception.message || 'Internal server error';
//
//     return response.send({
//       statusCode: status,
//       message: message,
//     });
//   }
//   // catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
//   //   return throwError(() =>
//   //     new KafkaSuccessResponse<any>({
//   //       data: exception.getError(),
//   //       event_source: 'product',
//   //       status: 400,
//   //     }).stringify(),
//   //   );
//   // }
// }
