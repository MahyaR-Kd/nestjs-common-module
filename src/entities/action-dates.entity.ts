import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  BaseEntity,
} from 'typeorm';
import { Order } from '../decorators/entity-order.decorator';

export class ActionDatesEntity extends BaseEntity {
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
  @Column({ nullable: true })
  createdBy?: string;

  @Order(9999)
  @Column({ nullable: true })
  updatedBy?: string;
}
