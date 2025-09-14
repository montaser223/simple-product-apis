import { injectable, inject } from 'inversify';
import { IFactGenerationService } from '@/interfaces/IFactGenerationService';
import { ILLMService } from '@/interfaces/ILLMService';
import { ILogger } from '@/interfaces/ILogger';
import { TYPES } from '@/types';
import { type ProductFact, ProductFactCreationAttributes } from '@/models/ProductFact';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { IRepository } from '@/interfaces/IRepository';
import { ERROR_CODES } from '@/consts';
import { AppError } from '@/utils/appError';

@injectable()
export class FactGenerationService implements IFactGenerationService {
    constructor(
        @inject(TYPES.ILLMService) private llmService: ILLMService,
        @inject(TYPES.IProductRepository) private productRepository: IRepository<Product>,
        @inject(TYPES.OrderRepository) private orderRepository: IRepository<Order>,
        @inject(TYPES.ProductFaceRepository) private productFaceRepository: IRepository<ProductFact>,
        @inject(TYPES.ILogger) private logger: ILogger
    ) { }

    public async generateProductFacts(productId: number): Promise<ProductFact[]> {
        try {
            // Get product and its orders data
            const [product, orders] = await Promise.all([
                this.productRepository.findById(productId),
                this.orderRepository.findAll({
                    where: { productId }
                })
            ])

            if (!product) {
                throw new AppError(ERROR_CODES.PRODUCT_NOT_FOUND);
            }


            // Generate facts using LLM
            const facts = await this.llmService.generateProductFacts(product, orders);

            // Save facts to database
            const savedFacts: ProductFactCreationAttributes[] = [];
            for (const factContent of facts) {
                const fact: ProductFactCreationAttributes = {
                    productId,
                    factType: 'product',
                    content: factContent,
                    confidence: 0.8,
                    metadata: {
                        generatedAt: new Date(),
                        orderCount: orders.length,
                        totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0)
                    }
                }

                savedFacts.push(fact);
            }
            this.logger.info({
                message: 'Generated product facts successfully',
                module: 'FactGenerationService',
                action: 'generateProductFacts',
                output: { productId, factsCount: savedFacts.length }
            });
            return this.productFaceRepository.bulkCreate(savedFacts);
        } catch (error: any) {
            this.logger.error({
                message: 'Error generating product facts',
                module: 'FactGenerationService',
                action: 'generateProductFacts',
                error: error,
                output: { productId }
            });
            throw error;
        }
    }

    public async generateOrderInsights(): Promise<ProductFact[]> {
        try {
            // Get all orders
            const orders = await this.orderRepository.findAll();

            // Generate insights using LLM
            const insights = await this.llmService.generateOrderInsights(orders);

            // Save insights to database
            const savedFacts: ProductFactCreationAttributes[] = [];
            for (const insightContent of insights) {
                const fact: ProductFactCreationAttributes = {
                    productId: 0, // Global insight, not tied to specific product
                    factType: 'order',
                    content: insightContent,
                    confidence: 0.8,
                    metadata: {
                        generatedAt: new Date(),
                        totalOrders: orders.length,
                        totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0)
                    }
                };
                savedFacts.push(fact);
            }

            this.logger.info({
                message: 'Generated order insights successfully',
                module: 'FactGenerationService',
                action: 'generateOrderInsights',
                output: { factsCount: savedFacts.length }
            });

            return this.productFaceRepository.bulkCreate(savedFacts);
        } catch (error: any) {
            this.logger.error({
                message: 'Error generating order insights',
                module: 'FactGenerationService',
                action: 'generateOrderInsights',
                error: error,
                output: {}
            });
            throw error;
        }
    }

    public async generateProductRecommendations(): Promise<ProductFact[]> {
        try {
            // Get all products and orders
            const [products, orders] = await Promise.all([
                this.productRepository.findAll(),
                this.orderRepository.findAll()
            ]);

            // Generate recommendations using LLM
            const recommendations = await this.llmService.generateProductRecommendations(products, orders);

            // Save recommendations to database
            const savedFacts: ProductFactCreationAttributes[] = [];
            for (const recommendationContent of recommendations) {
                const fact: ProductFactCreationAttributes = {
                    productId: 0, // Global recommendation, not tied to specific product
                    factType: 'recommendation',
                    content: recommendationContent,
                    confidence: 0.8,
                    metadata: {
                        generatedAt: new Date(),
                        totalProducts: products.length,
                        totalOrders: orders.length
                    }
                };
                savedFacts.push(fact);
            }

            this.logger.info({
                message: 'Generated product recommendations successfully',
                module: 'FactGenerationService',
                action: 'generateProductRecommendations',
                output: { factsCount: savedFacts.length }
            });

            return this.productFaceRepository.bulkCreate(savedFacts);
        } catch (error: any) {
            this.logger.error({
                message: 'Error generating product recommendations',
                module: 'FactGenerationService',
                action: 'generateProductRecommendations',
                error: error,
                output: {}
            });
            throw error;
        }
    }

    public async generateMarketAnalysis(): Promise<ProductFact[]> {
        try {
            // Get all products and orders
            // Get all products and orders
            const [products, orders] = await Promise.all([
                this.productRepository.findAll(),
                this.orderRepository.findAll()
            ]);

            // Generate market analysis using LLM
            const analysis = await this.llmService.generateMarketAnalysis(products, orders);

            // Save analysis to database
            const savedFacts: ProductFactCreationAttributes[] = [];
            for (const analysisContent of analysis) {
                const fact: ProductFactCreationAttributes = {
                    productId: 0, // Global analysis, not tied to specific product
                    factType: 'market',
                    content: analysisContent,
                    confidence: 0.8,
                    metadata: {
                        generatedAt: new Date(),
                        totalProducts: products.length,
                        totalOrders: orders.length
                    }
                };
                savedFacts.push(fact);
            }

            this.logger.info({
                message: 'Generated market analysis successfully',
                module: 'FactGenerationService',
                action: 'generateMarketAnalysis',
                output: { factsCount: savedFacts.length }
            });

            return this.productFaceRepository.bulkCreate(savedFacts);
        } catch (error: any) {
            this.logger.error({
                message: 'Error generating market analysis',
                module: 'FactGenerationService',
                action: 'generateMarketAnalysis',
                error: error,
                output: {}
            });
            throw error;
        }
    }

    public async getFactsByType(factType: 'product' | 'order' | 'recommendation' | 'market', productId?: number): Promise<ProductFact[]> {
        try {
            const whereClause: any = { factType };
            if (productId) {
                whereClause.productId = productId;
            }

            const facts = await this.productFaceRepository.findAll({
                where: whereClause,
                order: [['createdAt', 'DESC']]
            });

            this.logger.info({
                message: 'Retrieved facts by type successfully',
                module: 'FactGenerationService',
                action: 'getFactsByType',
                output: { factType, productId, factsCount: facts.length }
            });

            return facts;
        } catch (error: any) {
            this.logger.error({
                message: 'Error retrieving facts by type',
                module: 'FactGenerationService',
                action: 'getFactsByType',
                error: error,
                output: { factType, productId }
            });
            throw error;
        }
    }

    public async deleteFact(factId: number): Promise<boolean> {
        try {
            const deletedCount = await this.productFaceRepository.delete(factId);

            const success = deletedCount > 0;

            this.logger.info({
                message: success ? 'Fact deleted successfully' : 'Fact not found',
                module: 'FactGenerationService',
                action: 'deleteFact',
                output: { factId, success }
            });

            return success;
        } catch (error: any) {
            this.logger.error({
                message: 'Error deleting fact',
                module: 'FactGenerationService',
                action: 'deleteFact',
                error: error,
                output: { factId }
            });
            throw error;
        }
    }
}
