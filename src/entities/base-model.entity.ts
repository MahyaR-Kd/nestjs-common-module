import {
  BaseEntity,
  DataSource,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { getOrder, Order } from '../decorators/entity-order.decorator';

export class BaseModelEntity extends BaseEntity {
  @Order(-1)
  @PrimaryGeneratedColumn()
  id: number;

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
