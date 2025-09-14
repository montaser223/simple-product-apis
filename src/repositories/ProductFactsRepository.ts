import { injectable, inject } from 'inversify';
import { ProductFact } from '@/models/ProductFact';
import { BaseRepository } from '@/repositories/BaseRepository';
import { TYPES } from '@/types';

@injectable()
export class ProductFaceRepository extends BaseRepository<ProductFact> {
  constructor(@inject(TYPES.ProductFactModel) model: typeof ProductFact) {
    super(model);
  }
}
