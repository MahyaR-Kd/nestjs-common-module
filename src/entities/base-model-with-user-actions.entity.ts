import {

  Column,
} from 'typeorm';
import { Order } from '../decorators/entity-order.decorator';
import { BaseModelWithDatesEntity } from "./base-model-with-dates.entity";

export class BaseModelWithUserActionsEntity extends BaseModelWithDatesEntity {
  @Order(9999)
  @Column({ nullable: true })
  createdByUser?: string;

  @Order(9999)
  @Column({ nullable: true })
  updatedByUser?: string;

  @Order(9999)
  @Column({ nullable: true })
  deletedByUser?: string;
}
