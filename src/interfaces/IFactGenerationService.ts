import { ProductFact } from '@/models/ProductFact';

export interface IFactGenerationService {
  generateProductFacts(productId: number): Promise<ProductFact[]>;
  generateOrderInsights(): Promise<ProductFact[]>;
  generateProductRecommendations(): Promise<ProductFact[]>;
  generateMarketAnalysis(): Promise<ProductFact[]>;
  getFactsByType(factType: 'product' | 'order' | 'recommendation' | 'market', productId?: number): Promise<ProductFact[]>;
  deleteFact(factId: number): Promise<boolean>;
}
