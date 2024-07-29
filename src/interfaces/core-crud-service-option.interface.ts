import { EntityManager } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

export class CoreCrudServiceOptionInterface<T> {
  entityManager?: EntityManager;
  relations?: FindOptionsRelations<T>;
  existsCheck?: boolean = true;
}
