export interface ILLMService {
  generateProductFacts(productData: any, orderData: any[]): Promise<string[]>;
  generateOrderInsights(orderData: any[]): Promise<string[]>;
  generateProductRecommendations(productData: any[], orderData: any[]): Promise<string[]>;
  generateMarketAnalysis(productData: any[], orderData: any[]): Promise<string[]>;
}
