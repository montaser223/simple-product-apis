import { injectable, inject } from 'inversify';
import { Order } from '@/models/Order';
import { BaseRepository } from '@/repositories/BaseRepository';
import { TYPES } from '@/types';

@injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor(@inject(TYPES.OrderModel) model: typeof Order) {
    super(model);
  }
}
