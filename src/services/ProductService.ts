import { injectable, inject } from 'inversify';
import { Product, ProductCreationAttributes } from '@/models/Product';
import { IProductService, IAlgoliaService } from '@/interfaces';
import { TYPES } from '@/types';
import { ProductRepository } from '@/repositories/ProductRepository';
import { ILogger } from '@/interfaces/ILogger';
import { ERROR_CODES } from '@/consts';
import { AppError } from '@/utils/appError';

@injectable()
export class ProductService implements IProductService {

  constructor(
    @inject(TYPES.IProductRepository) private productRepository: ProductRepository,
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IAlgoliaService) private algoliaService: IAlgoliaService,
  ) {}

  public async getProducts(params: {page: number, limit: number, q: string}): Promise<Product[]> {
    const { page, limit, q } = params;

    this.logger.info({
      message: 'Fetching all products',
      module: 'ProductService',
      action: 'getProducts',
      page: page,
      limit: limit,
      output: {}
    });
    if (q) return this.algoliaService.searchObjects({indexName: 'products', query: q, page, hits: limit}) as Promise<Product[]>;
    return this.algoliaService.listObjects({indexName: 'products', page, hits: limit}) as Promise<Product[]>;
  }

  public async getProductById(id: number): Promise<Product | null> {
    this.logger.info({
      message: 'Fetching product by ID',
      module: 'ProductService',
      action: 'getProductById',
      productId: id,
      output: {}
    });
    const product = await this.productRepository.findById(id);
    if (!product) {
      this.logger.warn({
        message: 'Product not found by ID',
        module: 'ProductService',
        action: 'getProductById',
        productId: id,
        output: {}
      });
      throw new AppError(ERROR_CODES.PRODUCT_NOT_FOUND);
    }
    return product;
  }

  public async createProduct(productData: ProductCreationAttributes): Promise<Product> {
    this.logger.info({
      message: 'Creating new product',
      module: 'ProductService',
      action: 'createProduct',
      productData: productData,
      output: {}
    });
    const [response]  = await Promise.all([
      this.productRepository.create(productData),
      this.algoliaService.insertData('products', productData)
    ]);
    return response;
  }

  public async updateProduct(id: number, productData: Partial<Product>): Promise<[number, Product[]]> {
    this.logger.info({
      message: 'Updating product',
      module: 'ProductService',
      action: 'updateProduct',
      productId: id,
      productData: productData,
      output: {}
    });
    const [affectedCount, affectedRows] = await this.productRepository.update(id, productData);
    if (affectedCount === 0) {
      this.logger.warn({
        message: 'Product not found for update',
        module: 'ProductService',
        action: 'updateProduct',
        productId: id,
        productData: productData,
        output: {}
      });
      throw new AppError(ERROR_CODES.PRODUCT_NOT_FOUND);
    }
    return [affectedCount, affectedRows];
  }

  public async deleteProduct(id: number): Promise<number> {
    this.logger.info({
      message: 'Deleting product',
      module: 'ProductService',
      action: 'deleteProduct',
      productId: id,
      output: {}
    });
    const affectedCount = await this.productRepository.delete(id);
    if (affectedCount === 0) {
      this.logger.warn({
        message: 'Product not found for deletion',
        module: 'ProductService',
        action: 'deleteProduct',
        productId: id,
        output: {}
      });
      throw new AppError(ERROR_CODES.PRODUCT_NOT_FOUND);
    }
    return affectedCount;
  }
}
