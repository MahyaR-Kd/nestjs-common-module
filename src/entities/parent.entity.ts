import {
  BaseEntity,
  Column,
  DataSource,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ActionDatesEntity } from './action-dates.entity';
import { getOrder, Order } from '../decorators/entity-order.decorator';

export class ParentEntity extends ActionDatesEntity {
  @Order(-1)
  @PrimaryGeneratedColumn()
  id: number;

  @Order(9998)
  @Column({ default: true })
  isActive: boolean;

  @Order(9999)
  @Column({ type: 'json', nullable: true })
  metadata?: any;

  static useDataSource(dataSource: DataSource) {
    BaseEntity.useDataSource.call(this, dataSource);
    const meta = dataSource.entityMetadatasMap.get(this);
    if (meta != null) {
      // reorder columns here
      meta.columns = [...meta.columns].sort((x, y) => {
        const orderX = getOrder((x.target as any).prototype, x.propertyName);
        const orderY = getOrder((y.target as any).prototype, y.propertyName);
        return orderX - orderY;
      });
    }
  }
}
