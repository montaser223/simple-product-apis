import { inject } from 'inversify';
import { controller, httpGet, httpPost, queryParam } from 'inversify-express-utils';
import { TYPES } from '@/types';
import { IZohoCrmService, ZohoProduct } from '@/interfaces';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '@/consts';
import { validate } from '@/middlewares/validationMiddleware';
import { createZohoProductSchema } from '@/dtos/zohoProductSchema';

@controller('/zoho/products')
export class ZohoProductController {
  constructor(@inject(TYPES.IZohoCrmService) private zoho: IZohoCrmService) {}

  @httpGet('/')
  public async list(
    @queryParam('page') page: number = 1,
    @queryParam('perPage') perPage: number = 20,
    @queryParam('q') q: string | undefined,
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = q
        ? await this.zoho.searchProducts(q, { page, perPage })
        : await this.zoho.listProducts({ page, perPage });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @httpPost('/', validate(createZohoProductSchema))
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = req.body as ZohoProduct;
      await this.zoho.createProduct(payload);
      res.status(HTTP_STATUS.CREATED).end();
    } catch (err) {
      next(err);
    }
  }
}


