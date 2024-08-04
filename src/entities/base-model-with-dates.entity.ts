import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';
import {Order} from '../decorators/entity-order.decorator';
import {BaseModelEntity} from "./base-model.entity";

export class BaseModelWithDatesEntity extends BaseModelEntity {
  @Order(9999)
  @CreateDateColumn()
  createdAt: Date;

  @Order(9999)
  @UpdateDateColumn()
  updatedAt: Date;

  @Order(9999)
  @DeleteDateColumn()
  deletedAt: Date;

  @Order(9999)
  @Column({ type: 'json', nullable: true })
  metadata?: any;
}
