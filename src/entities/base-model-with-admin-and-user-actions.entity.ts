import {
  Column,
} from 'typeorm';
import {Order} from '../decorators/entity-order.decorator';
import {BaseModelWithDatesEntity} from "./base-model-with-dates.entity";

export class BaseModelWithAdminAndUserActionsEntity extends BaseModelWithDatesEntity {
  @Order(9999)
  @Column({ nullable: true })
  createdByAdmin?: string;

  @Order(9999)
  @Column({ nullable: true })
  updatedByAdmin?: string;

  @Order(9999)
  @Column({ nullable: true })
  deletedByAdmin?: string;

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
