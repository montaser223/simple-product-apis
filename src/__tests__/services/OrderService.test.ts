import 'reflect-metadata';
import { OrderService } from '@/services/OrderService';
import { IRepository } from '@/interfaces/IRepository';
import { ILogger } from '@/interfaces/ILogger';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { AppError } from '@/utils/appError';
import { ERROR_CODES } from '@/consts';

// Mock the IRepository interface for Order
const mockOrderRepository: jest.Mocked<IRepository<Order>> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Mock the IRepository interface for Product
const mockProductRepository: jest.Mocked<IRepository<Product>> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Mock the ILogger interface
const mockLogger: jest.Mocked<ILogger> = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

// Helper to create a mock Product instance that satisfies the Product type
const createMockProduct = (data: Partial<Product>): Product => {
  return {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn().mockResolvedValue(undefined), // Mock the save method
  } as Product;
};

// Helper to create a mock Order instance that satisfies the Order type
const createMockOrder = (data: Partial<Order>): Order => {
  return {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn().mockResolvedValue(undefined), // Mock the save method
  } as Order;
};

describe('OrderService', () => {
  let orderService: OrderService;

  beforeEach(() => {
    jest.clearAllMocks();
    orderService = new OrderService(mockOrderRepository, mockProductRepository, mockLogger);
  });

  describe('createOrder', () => {
    it('should create an order successfully and update product stock', async () => {
      const product = createMockProduct({ id: 1, name: 'Test Product', price: 10, stock: 100 });
      mockProductRepository.findById.mockResolvedValue(product);
      const order = createMockOrder({ id: 1, userId: 1, productId: 1, quantity: 10, totalAmount: 100, status: 'pending' });
      mockOrderRepository.create.mockResolvedValue(order);

      const result = await orderService.createOrder(1, 1, 10);

      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
      expect(mockOrderRepository.create).toHaveBeenCalledWith({
        userId: 1,
        productId: 1,
        quantity: 10,
        totalAmount: 100,
        status: 'pending',
      });
      expect(product.stock).toBe(90);
      expect(product.save).toHaveBeenCalled();
      expect(mockLogger.warn).not.toHaveBeenCalled();
      expect(result).toEqual(order);
    });

    it('should throw AppError if product not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(orderService.createOrder(1, 999, 10)).rejects.toThrow(
        new AppError(ERROR_CODES.PRODUCT_NOT_FOUND)
      );
      expect(mockProductRepository.findById).toHaveBeenCalledWith(999);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Product not found during order creation',
      }));
      expect(mockOrderRepository.create).not.toHaveBeenCalled();
    });

    it('should throw AppError if not enough stock', async () => {
      const product = createMockProduct({ id: 1, name: 'Test Product', price: 10, stock: 5 });
      mockProductRepository.findById.mockResolvedValue(product);

      await expect(orderService.createOrder(1, 1, 10)).rejects.toThrow(
        new AppError(ERROR_CODES.VALIDATION_ERROR, 'Not enough stock for this product')
      );
      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Not enough stock for product during order creation',
      }));
      expect(mockOrderRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getOrdersByUserId', () => {
    it('should return a list of orders for a given user ID', async () => {
      const orders = [
        createMockOrder({ id: 1, userId: 1, productId: 1, quantity: 5, totalAmount: 50, status: 'completed' }),
        createMockOrder({ id: 2, userId: 1, productId: 2, quantity: 2, totalAmount: 40, status: 'pending' }),
      ];
      mockOrderRepository.findAll.mockResolvedValue(orders);

      const result = await orderService.getOrdersByUserId(1);

      expect(mockOrderRepository.findAll).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(mockLogger.info).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Fetched orders by user ID',
        userId: 1,
        orderCount: 2,
      }));
      expect(result).toEqual(orders);
    });

    it('should return an empty array if no orders found for user ID', async () => {
      mockOrderRepository.findAll.mockResolvedValue([]);

      const result = await orderService.getOrdersByUserId(999);

      expect(mockOrderRepository.findAll).toHaveBeenCalledWith({ where: { userId: 999 } });
      expect(mockLogger.info).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Fetched orders by user ID',
        userId: 999,
        orderCount: 0,
      }));
      expect(result).toEqual([]);
    });
  });

  describe('getOrderById', () => {
    it('should return an order if found', async () => {
      const order = createMockOrder({ id: 1, userId: 1, productId: 1, quantity: 10, totalAmount: 100, status: 'pending' });
      mockOrderRepository.findById.mockResolvedValue(order);

      const result = await orderService.getOrderById(1);

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(1);
      expect(mockLogger.info).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Fetched order by ID',
        orderId: 1,
      }));
      expect(result).toEqual(order);
    });

    it('should throw AppError if order not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.getOrderById(999)).rejects.toThrow(
        new AppError(ERROR_CODES.ORDER_NOT_FOUND)
      );
      expect(mockOrderRepository.findById).toHaveBeenCalledWith(999);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Order not found by ID',
      }));
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      const order = createMockOrder({ id: 1, userId: 1, productId: 1, quantity: 10, totalAmount: 100, status: 'pending' });
      mockOrderRepository.findById.mockResolvedValue(order);

      const result = await orderService.updateOrderStatus(1, 'completed');

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(1);
      expect(order.status).toBe('completed');
      expect(order.save).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Order status updated',
        orderId: 1,
        newStatus: 'completed',
      }));
      expect(result).toEqual(order);
    });

    it('should throw AppError if order not found for status update', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.updateOrderStatus(999, 'completed')).rejects.toThrow(
        new AppError(ERROR_CODES.ORDER_NOT_FOUND)
      );
      expect(mockOrderRepository.findById).toHaveBeenCalledWith(999);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Order not found for status update',
      }));
    });
  });

  describe('updateOrder', () => {
    it('should update order quantity and total amount successfully', async () => {
      const order = createMockOrder({ id: 1, userId: 1, productId: 1, quantity: 10, totalAmount: 100, status: 'pending' });
      const product = createMockProduct({ id: 1, name: 'Test Product', price: 10, stock: 100 });
      mockOrderRepository.findById.mockResolvedValue(order);
      mockProductRepository.findById.mockResolvedValue(product);
      mockOrderRepository.update.mockResolvedValue([1, [createMockOrder({ ...order, quantity: 15, totalAmount: 150 })]]);
      mockOrderRepository.findById.mockResolvedValueOnce(order).mockResolvedValueOnce(createMockOrder({ ...order, quantity: 15, totalAmount: 150 }));


      const result = await orderService.updateOrder(1, 15);

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(1);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
      expect(product.stock).toBe(95); // 100 - (15-10) = 95
      expect(product.save).toHaveBeenCalled();
      expect(mockOrderRepository.update).toHaveBeenCalledWith(1, { quantity: 15, totalAmount: 150 });
      expect(mockLogger.info).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Order quantity and total amount updated',
        orderId: 1,
        newQuantity: 15,
        newTotalAmount: 150,
      }));
      expect(result?.quantity).toBe(15);
      expect(result?.totalAmount).toBe(150);
    });

    it('should throw AppError if order not found for update', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.updateOrder(999, 10)).rejects.toThrow(
        new AppError(ERROR_CODES.ORDER_NOT_FOUND)
      );
      expect(mockOrderRepository.findById).toHaveBeenCalledWith(999);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Order not found for update',
      }));
    });

    it('should throw AppError if order status is delivered', async () => {
      const order = createMockOrder({ id: 1, userId: 1, productId: 1, quantity: 10, totalAmount: 100, status: 'delivered' });
      mockOrderRepository.findById.mockResolvedValue(order);

      await expect(orderService.updateOrder(1, 15)).rejects.toThrow(
        new AppError(ERROR_CODES.VALIDATION_ERROR, 'order already delivered')
      );
      expect(mockOrderRepository.findById).toHaveBeenCalledWith(1);
      expect(mockLogger.warn).not.toHaveBeenCalled(); // No warn for delivered status
    });

    it('should throw AppError if associated product not found during update', async () => {
      const order = createMockOrder({ id: 1, userId: 1, productId: 999, quantity: 10, totalAmount: 100, status: 'pending' });
      mockOrderRepository.findById.mockResolvedValue(order);
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(orderService.updateOrder(1, 15)).rejects.toThrow(
        new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR, 'Associated product not found for order')
      );
      expect(mockOrderRepository.findById).toHaveBeenCalledWith(1);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(999);
      expect(mockLogger.error).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Associated product not found for order update',
      }));
    });

    it('should throw AppError if not enough stock for quantity update', async () => {
      const order = createMockOrder({ id: 1, userId: 1, productId: 1, quantity: 10, totalAmount: 100, status: 'pending' });
      const product = createMockProduct({ id: 1, name: 'Test Product', price: 10, stock: 2 }); // Not enough stock for +5
      mockOrderRepository.findById.mockResolvedValue(order);
      mockProductRepository.findById.mockResolvedValue(product);

      await expect(orderService.updateOrder(1, 15)).rejects.toThrow(
        new AppError(ERROR_CODES.VALIDATION_ERROR, 'Not enough stock for this quantity update')
      );
      expect(mockOrderRepository.findById).toHaveBeenCalledWith(1);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Not enough stock for quantity update',
      }));
      expect(product.save).not.toHaveBeenCalled();
      expect(mockOrderRepository.update).not.toHaveBeenCalled();
    });

    it('should not update if quantity is the same', async () => {
      const order = createMockOrder({ id: 1, userId: 1, productId: 1, quantity: 10, totalAmount: 100, status: 'pending' });
      mockOrderRepository.findById.mockResolvedValue(order);

      const result = await orderService.updateOrder(1, 10);

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(1);
      expect(mockProductRepository.findById).not.toHaveBeenCalled();
      expect(order.save).not.toHaveBeenCalled();
      expect(mockOrderRepository.update).not.toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith(expect.objectContaining({
        message: 'No quantity change detected for order update',
      }));
      expect(result).toEqual(order);
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order and restore product stock', async () => {
      const product = createMockProduct({ id: 1, name: 'Test Product', price: 10, stock: 90 });
      const order = createMockOrder({ id: 1, userId: 1, productId: 1, quantity: 10, totalAmount: 100, status: 'completed' });
      mockOrderRepository.findById.mockResolvedValue(order);
      mockProductRepository.findById.mockResolvedValue(product);
      mockOrderRepository.delete.mockResolvedValue(1);

      const result = await orderService.deleteOrder(1);

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(1);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
      expect(product.stock).toBe(100); // 90 + 10 = 100
      expect(product.save).toHaveBeenCalled();
      expect(mockOrderRepository.delete).toHaveBeenCalledWith(1);
      expect(mockLogger.info).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Order deleted successfully',
      }));
      expect(result).toBe(true);
    });

    it('should throw AppError if order not found for deletion', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.deleteOrder(999)).rejects.toThrow(
        new AppError(ERROR_CODES.ORDER_NOT_FOUND)
      );
      expect(mockOrderRepository.findById).toHaveBeenCalledWith(999);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Order not found for deletion',
      }));
      expect(mockProductRepository.findById).not.toHaveBeenCalled();
      expect(mockOrderRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle product not found during stock restoration gracefully', async () => {
      const order = createMockOrder({ id: 1, userId: 1, productId: 999, quantity: 10, totalAmount: 100, status: 'completed' });
      mockOrderRepository.findById.mockResolvedValue(order);
      mockProductRepository.findById.mockResolvedValue(null); // Product not found
      mockOrderRepository.delete.mockResolvedValue(1);

      const result = await orderService.deleteOrder(1);

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(1);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(999);
      expect(mockOrderRepository.delete).toHaveBeenCalledWith(1);
      expect(mockLogger.info).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Order deleted successfully',
      }));
      expect(result).toBe(true);
    });

    it('should return false if order deletion fails after initial check', async () => {
      const product = createMockProduct({ id: 1, name: 'Test Product', price: 10, stock: 90 });
      const order = createMockOrder({ id: 1, userId: 1, productId: 1, quantity: 10, totalAmount: 100, status: 'completed' });
      mockOrderRepository.findById.mockResolvedValue(order);
      mockProductRepository.findById.mockResolvedValue(product);
      mockOrderRepository.delete.mockResolvedValue(0); // Deletion fails

      const result = await orderService.deleteOrder(1);

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(1);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
      expect(product.stock).toBe(100); // Stock still restored
      expect(product.save).toHaveBeenCalled();
      expect(mockOrderRepository.delete).toHaveBeenCalledWith(1);
      expect(mockLogger.warn).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Order not deleted, possibly not found after initial check',
      }));
      expect(result).toBe(false);
    });
  });
});
