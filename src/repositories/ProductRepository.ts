import { injectable, inject } from 'inversify';
import { Product } from '@/models/Product';
import { BaseRepository } from '@/repositories/BaseRepository'
import { TYPES } from '@/types';

@injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(@inject(TYPES.ProductModel) model: typeof Product) {
    super(model);
  }
}
