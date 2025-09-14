import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, httpDelete, requestParam, queryParam } from 'inversify-express-utils';
import { IFactGenerationService } from '@/interfaces/IFactGenerationService';
import { TYPES } from '@/types';
import { validateParams } from '@/middlewares/validationMiddleware';
import { idSchema } from '@/dtos/idSchema';
import { HTTP_STATUS } from '@/consts';

@controller('/facts')
export class FactController {
  
  constructor(@inject(TYPES.IFactGenerationService) private factService: IFactGenerationService) {}

  @httpPost('/product/:id', validateParams(idSchema))
  public async generateProductFacts(
    @requestParam('id') productId: number,
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const facts = await this.factService.generateProductFacts(productId);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: facts,
        message: `Generated ${facts.length} facts for product ${productId}`
      });
    } catch (error: any) {
      next(error);
    }
  }

  @httpPost('/insights')
  public async generateOrderInsights(
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const insights = await this.factService.generateOrderInsights();
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: insights,
        message: `Generated ${insights.length} order insights`
      });
    } catch (error: any) {
      next(error);
    }
  }

  @httpPost('/recommendations')
  public async generateProductRecommendations(
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const recommendations = await this.factService.generateProductRecommendations();
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: recommendations,
        message: `Generated ${recommendations.length} product recommendations`
      });
    } catch (error: any) {
      next(error);
    }
  }

  @httpPost('/market-analysis')
  public async generateMarketAnalysis(
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const analysis = await this.factService.generateMarketAnalysis();
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: analysis,
        message: `Generated ${analysis.length} market analysis insights`
      });
    } catch (error: any) {
      next(error);
    }
  }

  @httpGet('/')
  public async getFacts(
    @queryParam('type') type: 'product' | 'order' | 'recommendation' | 'market',
    @queryParam('productId') productId: number | undefined,
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!type) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Type parameter is required'
        });
        return;
      }

      const facts = await this.factService.getFactsByType(type, productId);
      res.json({
        success: true,
        data: facts,
        message: `Retrieved ${facts.length} facts of type ${type}`
      });
    } catch (error: any) {
      next(error);
    }
  }

  @httpDelete('/:id', validateParams(idSchema))
  public async deleteFact(
    @requestParam('id') factId: number,
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const success = await this.factService.deleteFact(factId);
      if (success) {
        res.json({
          success: true,
          message: 'Fact deleted successfully'
        });
      } else {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Fact not found'
        });
      }
    } catch (error: any) {
      next(error);
    }
  }
}
