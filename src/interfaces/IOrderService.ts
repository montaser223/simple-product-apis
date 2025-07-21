import { Order } from '@/models/Order';

export interface IOrderService {
  createOrder(userId: number, productId: number, quantity: number): Promise<Order>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  getOrderById(orderId: number): Promise<Order | null>;
  updateOrderStatus(orderId: number, status: string): Promise<Order | null>;
  updateOrder(orderId: number, quantity: number): Promise<Order | null>;
  deleteOrder(orderId: number): Promise<boolean>;
}
