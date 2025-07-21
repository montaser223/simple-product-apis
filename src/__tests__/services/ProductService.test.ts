import 'reflect-metadata';
import { ProductService } from '@/services/ProductService';
import { ProductRepository } from '@/repositories/ProductRepository';
import { ILogger } from '@/interfaces/ILogger';
import { Product } from '@/models/Product';
import { AppError } from '@/utils/appError';
import { ERROR_CODES } from '../../consts';

// Mock the entire ProductRepository module
jest.mock('@/repositories/ProductRepository');

// Mock the ILogger interface
const mockLogger: jest.Mocked<ILogger> = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

// Helper to create a mock Product instance that satisfies the Product type
const createMockProduct = (data: { id: number; name: string; description: string; price: number; stock: number }): Product => {
  return {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Product;
};

describe('ProductService', () => {
  let productService: ProductService;
  // Get the mocked constructor of ProductRepository
  const MockProductRepository = ProductRepository as jest.MockedClass<typeof ProductRepository>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock the constructor of ProductRepository
    MockProductRepository.mockClear();
    MockProductRepository.mockImplementation((model) => {
      return {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        model: model,
      } as unknown as ProductRepository;
    });

    // Instantiate the service, which will create a new mocked ProductRepository
    productService = new ProductService(new MockProductRepository(Product), mockLogger);
  });

  describe('getProducts', () => {
    it('should return a list of products', async () => {
      const products = [
        createMockProduct({ id: 1, name: 'Product 1', description: 'Desc 1', price: 10, stock: 100 }),
        createMockProduct({ id: 2, name: 'Product 2', description: 'Desc 2', price: 20, stock: 200 }),
      ];
      const productRepositoryInstance = (productService as any).productRepository as jest.Mocked<ProductRepository>;
      productRepositoryInstance.findAll.mockResolvedValue(products);

      const result = await productService.getProducts();

      expect(productRepositoryInstance.findAll).toHaveBeenCalledWith({ limit: 10, offset: 0 });
      expect(mockLogger.info).toHaveBeenCalled();
      expect(result).toEqual(products);
    });

    it('should return an empty array if no products are found', async () => {
      const productRepositoryInstance = (productService as any).productRepository as jest.Mocked<ProductRepository>;
      productRepositoryInstance.findAll.mockResolvedValue([]);

      const result = await productService.getProducts();

      expect(productRepositoryInstance.findAll).toHaveBeenCalledWith({ limit: 10, offset: 0 });
      expect(mockLogger.info).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should handle pagination correctly', async () => {
      const products = [
        createMockProduct({ id: 3, name: 'Product 3', description: 'Desc 3', price: 30, stock: 300 }),
      ];
      const productRepositoryInstance = (productService as any).productRepository as jest.Mocked<ProductRepository>;
      productRepositoryInstance.findAll.mockResolvedValue(products);

      const result = await productService.getProducts(2, 5);

      expect(productRepositoryInstance.findAll).toHaveBeenCalledWith({ limit: 5, offset: 5 });
      expect(mockLogger.info).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });

  describe('getProductById', () => {
    it('should return a product if found', async () => {
      const product = createMockProduct({ id: 1, name: 'Product 1', description: 'Desc 1', price: 10, stock: 100 });
      const productRepositoryInstance = (productService as any).productRepository as jest.Mocked<ProductRepository>;
      productRepositoryInstance.findById.mockResolvedValue(product);

      const result = await productService.getProductById(1);

      expect(productRepositoryInstance.findById).toHaveBeenCalledWith(1);
      expect(mockLogger.info).toHaveBeenCalled();
      expect(result).toEqual(product);
    });

    it('should throw AppError if product not found', async () => {
      const productRepositoryInstance = (productService as any).productRepository as jest.Mocked<ProductRepository>;
      productRepositoryInstance.findById.mockResolvedValue(null);

      await expect(productService.getProductById(999)).rejects.toThrow(
        new AppError(ERROR_CODES.PRODUCT_NOT_FOUND)
      );
      expect(productRepositoryInstance.findById).toHaveBeenCalledWith(999);
      expect(mockLogger.info).toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('createProduct', () => {
    it('should create and return a new product', async () => {
      const productData = { name: 'New Product', description: 'New Desc', price: 50, stock: 500 };
      const newProduct = createMockProduct({ id: 1, ...productData });
      const productRepositoryInstance = (productService as any).productRepository as jest.Mocked<ProductRepository>;
      productRepositoryInstance.create.mockResolvedValue(newProduct);

      const result = await productService.createProduct(productData);

      expect(productRepositoryInstance.create).toHaveBeenCalledWith(productData);
      expect(mockLogger.info).toHaveBeenCalled();
      expect(result).toEqual(newProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update and return the affected product', async () => {
      const productData = { name: 'Updated Product', price: 15 };
      const updatedProduct = createMockProduct({ id: 1, name: 'Updated Product', description: 'Desc 1', price: 15, stock: 100 });
      const productRepositoryInstance = (productService as any).productRepository as jest.Mocked<ProductRepository>;
      productRepositoryInstance.update.mockResolvedValue([1, [updatedProduct]]);

      const result = await productService.updateProduct(1, productData);

      expect(productRepositoryInstance.update).toHaveBeenCalledWith(1, productData);
      expect(mockLogger.info).toHaveBeenCalled();
      expect(result).toEqual([1, [updatedProduct]]);
    });

    it('should throw AppError if product not found for update', async () => {
      const productRepositoryInstance = (productService as any).productRepository as jest.Mocked<ProductRepository>;
      productRepositoryInstance.update.mockResolvedValue([0, []]);

      await expect(productService.updateProduct(999, { name: 'Non Existent' })).rejects.toThrow(
        new AppError(ERROR_CODES.PRODUCT_NOT_FOUND)
      );
      expect(productRepositoryInstance.update).toHaveBeenCalledWith(999, { name: 'Non Existent' });
      expect(mockLogger.info).toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return affected count', async () => {
      const productRepositoryInstance = (productService as any).productRepository as jest.Mocked<ProductRepository>;
      productRepositoryInstance.delete.mockResolvedValue(1);

      const result = await productService.deleteProduct(1);

      expect(productRepositoryInstance.delete).toHaveBeenCalledWith(1);
      expect(mockLogger.info).toHaveBeenCalled();
      expect(result).toEqual(1);
    });

    it('should throw AppError if product not found for deletion', async () => {
      const productRepositoryInstance = (productService as any).productRepository as jest.Mocked<ProductRepository>;
      productRepositoryInstance.delete.mockResolvedValue(0);

      await expect(productService.deleteProduct(999)).rejects.toThrow(
        new AppError(ERROR_CODES.PRODUCT_NOT_FOUND)
      );
      expect(productRepositoryInstance.delete).toHaveBeenCalledWith(999);
      expect(mockLogger.info).toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });
});
