import { injectable, inject } from 'inversify';
import { IOrderService } from '@/interfaces/IOrderService';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { TYPES } from '@/types';
import { IRepository } from '@/interfaces/IRepository';
import { ILogger } from '@/interfaces/ILogger';
import { ERROR_CODES } from '@/consts';
import { AppError } from '@/utils/appError';

@injectable()
export class OrderService implements IOrderService {

  constructor(
    @inject(TYPES.OrderRepository) private orderRepository: IRepository<Order>,
    @inject(TYPES.IProductRepository) private productRepository: IRepository<Product>,
    @inject(TYPES.ILogger) private logger: ILogger,
  ) {
  }

  public async createOrder(userId: number, productId: number, quantity: number): Promise<Order> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      this.logger.warn({
        message: 'Product not found during order creation',
        module: 'OrderService',
        action: 'createOrder',
        productId: productId,
        output: {}
      });
      throw new AppError(ERROR_CODES.PRODUCT_NOT_FOUND);
    }

    if (product.stock < quantity) {
      this.logger.warn({
        message: 'Not enough stock for product during order creation',
        module: 'OrderService',
        action: 'createOrder',
        productId: productId,
        requestedQuantity: quantity,
        availableStock: product.stock,
        output: {}
      });
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Not enough stock for this product');
    }

    const totalAmount = product.price * quantity;

    const order = await this.orderRepository.create({
      userId,
      productId,
      quantity,
      totalAmount,
      status: 'pending',
    });

    product.stock -= quantity;
    await product.save();

    return order;
  }

  public async getOrdersByUserId(userId: number): Promise<Order[]> {
    const orders = await this.orderRepository.findAll({ where: { userId } });
    this.logger.info({
      message: 'Fetched orders by user ID',
      module: 'OrderService',
      action: 'getOrdersByUserId',
      userId: userId,
      orderCount: orders.length,
      output: {}
    });
    return orders;
  }

  public async getOrderById(orderId: number): Promise<Order | null> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      this.logger.warn({
        message: 'Order not found by ID',
        module: 'OrderService',
        action: 'getOrderById',
        orderId: orderId,
        output: {}
      });
      throw new AppError(ERROR_CODES.ORDER_NOT_FOUND);
    }
    this.logger.info({
      message: 'Fetched order by ID',
      module: 'OrderService',
      action: 'getOrderById',
      orderId: orderId,
      output: {}
    });
    return order;
  }

  public async updateOrderStatus(orderId: number, status: string): Promise<Order | null> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      this.logger.warn({
        message: 'Order not found for status update',
        module: 'OrderService',
        action: 'updateOrderStatus',
        orderId: orderId,
        output: {}
      });
      throw new AppError(ERROR_CODES.ORDER_NOT_FOUND);
    }
    order.status = status;
    await order.save();
    this.logger.info({
      message: 'Order status updated',
      module: 'OrderService',
      action: 'updateOrderStatus',
      orderId: orderId,
      newStatus: status,
      output: {}
    });
    return order;
  }

  public async updateOrder(orderId: number, quantity: number): Promise<Order | null> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      this.logger.warn({
        message: 'Order not found for update',
        module: 'OrderService',
        action: 'updateOrder',
        orderId: orderId,
        output: {}
      });
      throw new AppError(ERROR_CODES.ORDER_NOT_FOUND);
    }

    if(order.status === "delivered"){
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, "order already delivered")
    }

    if (quantity !== order.quantity) {
      const product = await this.productRepository.findById(order.productId);
      if (!product) {
        this.logger.error({
          message: 'Associated product not found for order update',
          module: 'OrderService',
          action: 'updateOrder',
          orderId: orderId,
          productId: order.productId,
          output: {}
        });
        throw new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR, 'Associated product not found for order');
      }

      const quantityDifference = quantity - order.quantity;
      if (product.stock < quantityDifference) {
        this.logger.warn({
          message: 'Not enough stock for quantity update',
          module: 'OrderService',
          action: 'updateOrder',
          orderId: orderId,
          productId: product.id,
          requestedQuantity: quantity,
          currentQuantity: order.quantity,
          availableStock: product.stock,
          output: {}
        });
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Not enough stock for this quantity update');
      }

      product.stock -= quantityDifference;
      await product.save();

      const newTotalAmount = product.price * quantity;
      await this.orderRepository.update(orderId, { quantity, totalAmount: newTotalAmount });
      this.logger.info({
        message: 'Order quantity and total amount updated',
        module: 'OrderService',
        action: 'updateOrder',
        orderId: orderId,
        oldQuantity: order.quantity,
        newQuantity: quantity,
        oldTotalAmount: order.totalAmount,
        newTotalAmount: newTotalAmount,
        output: {}
      });
    } else {
      this.logger.info({
        message: 'No quantity change detected for order update',
        module: 'OrderService',
        action: 'updateOrder',
        orderId: orderId,
        output: {}
      });
    }

    return this.orderRepository.findById(orderId); // Fetch updated order
  }

  public async deleteOrder(orderId: number): Promise<boolean> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      this.logger.warn({
        message: 'Order not found for deletion',
        module: 'OrderService',
        action: 'deleteOrder',
        orderId: orderId,
        output: {}
      });
      throw new AppError(ERROR_CODES.ORDER_NOT_FOUND);
    }

    // Restore stock if order is deleted
    const product = await this.productRepository.findById(order.productId);
    if (product) {
      product.stock += order.quantity;
      await product.save();
    }

    const deletedCount = await this.orderRepository.delete(orderId);
    if (deletedCount > 0) {
      this.logger.info({
        message: 'Order deleted successfully',
        module: 'OrderService',
        action: 'deleteOrder',
        orderId: orderId,
        output: {}
      });
    } else {
      this.logger.warn({
        message: 'Order not deleted, possibly not found after initial check',
        module: 'OrderService',
        action: 'deleteOrder',
        orderId: orderId,
        output: {}
      });
    }
    return deletedCount > 0;
  }
}
