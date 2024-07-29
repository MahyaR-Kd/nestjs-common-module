export interface SuccessResponseInterface<type> {
  data: type;
  message?: string;
  statusCode?: number;
  metadata?: any;
}
