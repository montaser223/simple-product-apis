import { injectable, inject } from 'inversify';
import { ILLMService } from '@/interfaces/ILLMService';
import { ILogger } from '@/interfaces/ILogger';
import { TYPES } from '@/types';
import { OpenAI } from 'openai';
import { config } from '@/config';
import { sanitizeLLMResponse } from '@/utils/contentSanitizer';

@injectable()
export class LLMService implements ILLMService {
  private openai: OpenAI;

  constructor(@inject(TYPES.ILogger) private logger: ILogger) {
    this.openai = new OpenAI({
      apiKey: config.openAi.apiKey,
    });
  }

  public async generateProductFacts(productData: any, orderData: any[]): Promise<string[]> {
    try {
      const prompt = this.buildProductFactsPrompt(productData, orderData);
      
      const response = await this.openai.chat.completions.create({
        model: config.openAi.model,
        messages: [
          {
            role: "system",
            content: "You are an expert business analyst. Generate interesting, data-driven facts about products based on their attributes and order history. Return facts as a JSON array of strings."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }
      
      const sanitizedContent = sanitizeLLMResponse(content);
      const facts = JSON.parse(sanitizedContent);
      
      this.logger.info({
        message: 'Generated product facts successfully',
        module: 'LLMService',
        action: 'generateProductFacts',
        output: { factsCount: facts.length }
      });
      return facts;
    } catch (error: any) {
      this.logger.error({
        message: 'Error generating product facts',
        module: 'LLMService',
        action: 'generateProductFacts',
        error: error.message,
        output: {}
      });
      throw error;
    }
  }

  public async generateOrderInsights(orderData: any[]): Promise<string[]> {
    try {
      const prompt = this.buildOrderInsightsPrompt(orderData);
      
      const response = await this.openai.chat.completions.create({
        model: config.openAi.model,
        messages: [
          {
            role: "system",
            content: "You are an expert business analyst. Generate insights about order patterns, trends, and customer behavior. Return insights as a JSON array of strings."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }
      const sanitizedContent = sanitizeLLMResponse(content);

      const insights = JSON.parse(sanitizedContent);
      this.logger.info({
        message: 'Generated order insights successfully',
        module: 'LLMService',
        action: 'generateOrderInsights',
        output: { insightsCount: insights.length }
      });

      return insights;
    } catch (error: any) {
      this.logger.error({
        message: 'Error generating order insights',
        module: 'LLMService',
        action: 'generateOrderInsights',
        error: error,
        output: {}
      });
      throw error;
    }
  }

  public async generateProductRecommendations(productData: any[], orderData: any[]): Promise<string[]> {
    try {
      const prompt = this.buildProductRecommendationsPrompt(productData, orderData);
      
      const response = await this.openai.chat.completions.create({
        model: config.openAi.model,
        messages: [
          {
            role: "system",
            content: "You are an expert business analyst. Generate product recommendations based on inventory, pricing, and order patterns. Return recommendations as a JSON array of strings."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }
      
      const sanitizedContent = sanitizeLLMResponse(content);
      const recommendations = JSON.parse(sanitizedContent);
      this.logger.info({
        message: 'Generated product recommendations successfully',
        module: 'LLMService',
        action: 'generateProductRecommendations',
        output: { recommendationsCount: recommendations.length }
      });

      return recommendations;
    } catch (error: any) {
      this.logger.error({
        message: 'Error generating product recommendations',
        module: 'LLMService',
        action: 'generateProductRecommendations',
        error: error,
        output: {}
      });
      throw error;
    }
  }

  public async generateMarketAnalysis(productData: any[], orderData: any[]): Promise<string[]> {
    try {
      const prompt = this.buildMarketAnalysisPrompt(productData, orderData);
      
      const response = await this.openai.chat.completions.create({
        model: config.openAi.model,
        messages: [
          {
            role: "system",
            content: "You are an expert market analyst. Generate market analysis insights based on product performance and order data. Return analysis as a JSON array of strings."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const sanitizedContent = sanitizeLLMResponse(content);
      const analysis = JSON.parse(sanitizedContent);
      this.logger.info({
        message: 'Generated market analysis successfully',
        module: 'LLMService',
        action: 'generateMarketAnalysis',
        output: { analysisCount: analysis.length }
      });

      return analysis;
    } catch (error: any) {
      this.logger.error({
        message: 'Error generating market analysis',
        module: 'LLMService',
        action: 'generateMarketAnalysis',
        error: error,
        output: {}
      });
      throw error;
    }
  }

  private buildProductFactsPrompt(productData: any, orderData: any[]): string {
    const orderStats = this.calculateOrderStats(orderData);
    
    return `
    Analyze this product and generate 5-7 interesting facts about it based on its data and order history:

    Product Information:
    - Name: ${productData.name}
    - Description: ${productData.description}
    - Price: $${productData.price}
    - Stock: ${productData.stock}
    - Created: ${productData.createdAt}

    Order Statistics:
    - Total Orders: ${orderStats.totalOrders}
    - Total Quantity Sold: ${orderStats.totalQuantity}
    - Total Revenue: $${orderStats.totalRevenue}
    - Average Order Value: $${orderStats.avgOrderValue}
    - Order Status Distribution: ${JSON.stringify(orderStats.statusDistribution)}

    Generate facts that highlight interesting patterns, performance metrics, or business insights about this product.
    `;
  }

  private buildOrderInsightsPrompt(orderData: any[]): string {
    const insights = this.calculateOrderInsights(orderData);
    
    return `
    Analyze this order data and generate 5-7 business insights:

    Order Data Summary:
    - Total Orders: ${insights.totalOrders}
    - Total Revenue: $${insights.totalRevenue}
    - Average Order Value: $${insights.avgOrderValue}
    - Most Popular Products: ${JSON.stringify(insights.topProducts)}
    - Order Status Distribution: ${JSON.stringify(insights.statusDistribution)}
    - Revenue by Month: ${JSON.stringify(insights.monthlyRevenue)}
    - Average Items per Order: ${insights.avgItemsPerOrder}

    Generate insights about customer behavior, sales patterns, seasonal trends, and business opportunities.
    `;
  }

  private buildProductRecommendationsPrompt(productData: any[], orderData: any[]): string {
    const recommendations = this.calculateProductMetrics(productData, orderData);
    
    return `
    Analyze this product catalog and order data to generate 5-7 actionable recommendations:

    Product Catalog Summary:
    - Total Products: ${productData.length}
    - Average Price: $${recommendations.avgPrice}
    - Total Inventory Value: $${recommendations.totalInventoryValue}
    - Low Stock Products: ${recommendations.lowStockProducts.length}
    - High Stock Products: ${recommendations.highStockProducts.length}

    Order Performance:
    - Best Selling Products: ${JSON.stringify(recommendations.bestSelling)}
    - Underperforming Products: ${JSON.stringify(recommendations.underperforming)}
    - Price Range Analysis: ${JSON.stringify(recommendations.priceRanges)}

    Generate recommendations for inventory management, pricing strategies, marketing focus, and product development.
    `;
  }

  private buildMarketAnalysisPrompt(productData: any[], orderData: any[]): string {
    const analysis = this.calculateMarketMetrics(productData, orderData);
    
    return `
    Analyze this market data and generate 5-7 market analysis insights:

    Market Overview:
    - Total Products: ${productData.length}
    - Total Orders: ${analysis.totalOrders}
    - Total Revenue: $${analysis.totalRevenue}
    - Market Growth Rate: ${analysis.growthRate}%
    - Customer Acquisition: ${analysis.newCustomers}

    Product Performance:
    - Market Leaders: ${JSON.stringify(analysis.marketLeaders)}
    - Emerging Products: ${JSON.stringify(analysis.emergingProducts)}
    - Price Competitiveness: ${JSON.stringify(analysis.priceAnalysis)}

    Generate insights about market trends, competitive positioning, growth opportunities, and strategic recommendations.
    `;
  }

  private calculateOrderStats(orderData: any[]): any {
    const totalOrders = orderData.length;
    const totalQuantity = orderData.reduce((sum, order) => sum + order.quantity, 0);
    const totalRevenue = orderData.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const statusDistribution = orderData.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalOrders,
      totalQuantity,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      statusDistribution
    };
  }

  private calculateOrderInsights(orderData: any[]): any {
    const totalOrders = orderData.length;
    const totalRevenue = orderData.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const productCounts = orderData.reduce((acc, order) => {
      acc[order.productId] = (acc[order.productId] || 0) + order.quantity;
      return acc;
    }, {});

    const topProducts = Object.entries(productCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([productId, quantity]) => ({ productId, quantity }));

    const statusDistribution = orderData.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const monthlyRevenue = orderData.reduce((acc, order) => {
      const month = new Date(order.createdAt).toISOString().substring(0, 7);
      acc[month] = (acc[month] || 0) + order.totalAmount;
      return acc;
    }, {});

    const avgItemsPerOrder = totalOrders > 0 ? orderData.reduce((sum, order) => sum + order.quantity, 0) / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      topProducts,
      statusDistribution,
      monthlyRevenue,
      avgItemsPerOrder: Math.round(avgItemsPerOrder * 100) / 100
    };
  }

  private calculateProductMetrics(productData: any[], orderData: any[]): any {
    const totalProducts = productData.length;
    const avgPrice = productData.reduce((sum, product) => sum + product.price, 0) / totalProducts;
    const totalInventoryValue = productData.reduce((sum, product) => sum + (product.price * product.stock), 0);
    
    const lowStockProducts = productData.filter(p => p.stock < 10);
    const highStockProducts = productData.filter(p => p.stock > 100);

    const productSales = orderData.reduce((acc, order) => {
      acc[order.productId] = (acc[order.productId] || 0) + order.quantity;
      return acc;
    }, {});

    const bestSelling = Object.entries(productSales)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([productId, quantity]) => ({ productId, quantity }));

    const underperforming = productData
      .filter(p => !productSales[p.id] || productSales[p.id] < 5)
      .slice(0, 5)
      .map(p => ({ id: p.id, name: p.name, sales: productSales[p.id] || 0 }));

    const priceRanges = {
      low: productData.filter(p => p.price < 50).length,
      medium: productData.filter(p => p.price >= 50 && p.price < 200).length,
      high: productData.filter(p => p.price >= 200).length
    };

    return {
      avgPrice: Math.round(avgPrice * 100) / 100,
      totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
      lowStockProducts,
      highStockProducts,
      bestSelling,
      underperforming,
      priceRanges
    };
  }

  private calculateMarketMetrics(productData: any[], orderData: any[]): any {
    const totalProducts = productData.length;
    const totalOrders = orderData.length;
    const totalRevenue = orderData.reduce((sum, order) => sum + order.totalAmount, 0);
    
    const productSales = orderData.reduce((acc, order) => {
      acc[order.productId] = (acc[order.productId] || 0) + order.quantity;
      return acc;
    }, {});

    const marketLeaders = Object.entries(productSales)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([productId, quantity]) => ({ productId, quantity }));

    const emergingProducts = productData
      .filter(p => productSales[p.id] && productSales[p.id] > 0 && productSales[p.id] < 10)
      .slice(0, 3)
      .map(p => ({ id: p.id, name: p.name, sales: productSales[p.id] }));

    const priceAnalysis = {
      minPrice: Math.min(...productData.map(p => p.price)),
      maxPrice: Math.max(...productData.map(p => p.price)),
      avgPrice: productData.reduce((sum, p) => sum + p.price, 0) / totalProducts
    };

    // Calculate growth rate (simplified - comparing last month to previous month)
    const currentMonth = new Date();
    const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const twoMonthsAgo = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 2, 1);
    
    const lastMonthRevenue = orderData
      .filter(order => new Date(order.createdAt) >= lastMonth && new Date(order.createdAt) < currentMonth)
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    const twoMonthsAgoRevenue = orderData
      .filter(order => new Date(order.createdAt) >= twoMonthsAgo && new Date(order.createdAt) < lastMonth)
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const growthRate = twoMonthsAgoRevenue > 0 ? ((lastMonthRevenue - twoMonthsAgoRevenue) / twoMonthsAgoRevenue) * 100 : 0;

    // Calculate new customers (simplified - unique users in last month)
    const newCustomers = new Set(
      orderData
        .filter(order => new Date(order.createdAt) >= lastMonth)
        .map(order => order.userId)
    ).size;

    return {
      totalProducts,
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      marketLeaders,
      emergingProducts,
      priceAnalysis: {
        minPrice: Math.round(priceAnalysis.minPrice * 100) / 100,
        maxPrice: Math.round(priceAnalysis.maxPrice * 100) / 100,
        avgPrice: Math.round(priceAnalysis.avgPrice * 100) / 100
      },
      growthRate: Math.round(growthRate * 100) / 100,
      newCustomers
    };
  }
}
