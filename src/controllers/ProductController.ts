import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut, httpDelete, queryParam } from 'inversify-express-utils';
import { IProductService } from '@/interfaces';
import { TYPES } from '@/types';
import { ProductCreationAttributes } from '@/models/Product';
import { validate, validateParams } from '@/middlewares/validationMiddleware';
import { createProductSchema, updateProductSchema } from '@/dtos/productSchema';
import { idSchema } from '@/dtos/idSchema';
import { HTTP_STATUS } from '@/consts';

@controller('/products')
export class ProductController {
  
  constructor(@inject(TYPES.IProductService) private productService: IProductService) {}

  @httpGet('/')
  public async getProducts(
    @queryParam('page') page: number = 1,
    @queryParam('limit') limit: number = 10,
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const products = await this.productService.getProducts(page, limit);
      res.json(products);
    } catch (error: any) {
      next(error);
    }
  }

  @httpGet('/:id', validateParams(idSchema))
  public async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productService.getProductById(id);
      res.json(product);
    } catch (error: any) {
      next(error);
    }
  }

  @httpPost('/', validate(createProductSchema))
  public async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productData: ProductCreationAttributes = req.body;
      const newProduct = await this.productService.createProduct(productData);
      res.status(HTTP_STATUS.CREATED).json(newProduct);
    } catch (error: any) {
      next(error);
    }
  }

  @httpPut('/:id', validateParams(idSchema), validate(updateProductSchema))
  public async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const productData: Partial<ProductCreationAttributes> = req.body;
      const [, affectedRows] = await this.productService.updateProduct(id, productData);
      res.json(affectedRows[0]);
    } catch (error: any) {
      next(error);
    }
  }

  @httpDelete('/:id', validateParams(idSchema))
  public async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.productService.deleteProduct(id);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error: any) {
      next(error);
    }
  }
}
