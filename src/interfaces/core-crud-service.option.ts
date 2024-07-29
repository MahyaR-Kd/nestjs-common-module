import { EntityManager } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

export class CoreCrudServiceOption<T> {
  entityManager?: EntityManager;
  relations?: FindOptionsRelations<T>;
  existsCheck?: boolean = true;
}
