import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';
import {Order} from '../decorators/entity-order.decorator';
import {BaseModelEntity} from "./base-model.entity";
import {BaseModelWithDatesEntity} from "./base-model-with-dates.entity";

export class BaseModelWithAdminActionsEntity extends BaseModelWithDatesEntity {
  @Order(9999)
  @Column({ nullable: true })
  createdByAdmin?: string;

  @Order(9999)
  @Column({ nullable: true })
  updatedByAdmin?: string;

  @Order(9999)
  @Column({ nullable: true })
  deletedByAdmin?: string;
}
