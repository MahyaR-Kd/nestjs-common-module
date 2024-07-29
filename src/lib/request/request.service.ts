import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpMethods } from './enums/http-methods.enum';
import { ConfigService } from '@nestjs/config';

interface ISendRequest {
  method: HttpMethods;
  body?: object;
  path: string;
  isAdditionalPath?: boolean;
  token?: string;
  headers?: object;
  params?: string;
}

interface ISubRequest {
  body?: any;
  path: string;
  token?: string;
  headers?: object;
  params?: string;
}

@Injectable()
export class RequestService<T> {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async sendRaw({
    method,
    body,
    isAdditionalPath,
    path,
    headers,
    token,
  }: ISendRequest): Promise<any> {
    const url = isAdditionalPath
      ? this.configService.get('app.baseUrl') + path
      : path;

    const result = await firstValueFrom(
      this.httpService.request<T>({
        method,
        data: body || {},
        url: url,
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      }),
    );

    return result;
  }

  async send({
    method,
    body,
    path,
    headers,
    token,
    params,
  }: ISendRequest): Promise<any> {
    try {
      const url = params ? path + `?${params}` : path;
      const result: any = await firstValueFrom(
        this.httpService.request<{ data: any }>({
          method,
          url,
          data: body || {},
          headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }),
      );

      return result?.data;
    } catch (err) {
      return err;
    }
  }

  post(payload: ISubRequest) {
    return this.send({ ...payload, method: HttpMethods.POST });
  }

  get(payload: ISubRequest) {
    return this.send({ ...payload, method: HttpMethods.GET });
  }

  patch(payload: ISubRequest) {
    return this.send({ ...payload, method: HttpMethods.PATCH });
  }

  remove(payload: Omit<ISubRequest, 'body'>) {
    return this.send({ ...payload, method: HttpMethods.DELETE });
  }
}

export { HttpMethods };
