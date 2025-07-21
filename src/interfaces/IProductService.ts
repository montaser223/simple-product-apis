import { Product } from '@/models/Product';

export interface IProductService {
  getProducts(page?: number, limit?: number): Promise<Product[]>;
  getProductById(id: number): Promise<Product | null>;
  createProduct(product: Partial<Product>): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<[number, Product[]]>;
  deleteProduct(id: number): Promise<number>;
}
