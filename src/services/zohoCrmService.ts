import { inject, injectable } from "inversify";
import { TYPES } from "@/types";
import { IZohoAuthService } from "@/interfaces/IZohoAuthService";
import { IZohoCrmService, ZohoProduct } from "@/interfaces/IZohoCrmService";
import { config } from "@/config";
import axios from "axios";
import { AppError } from "@/utils/appError";
import { ERROR_CODES } from "@/consts";
import { ILogger } from "@/interfaces";

@injectable()
export class ZohoCrmService implements IZohoCrmService {
  constructor(@inject(TYPES.IZohoAuthService) private auth: IZohoAuthService, @inject(TYPES.ILogger) private logger: ILogger) {}

  public async listProducts(
    params: { page?: number; perPage?: number } = {}
  ): Promise<ZohoProduct[]> {
    try {
      const accessToken = await this.auth.getAccessToken();
      const { page = 1, perPage = 20 } = params;
      const url = `${config.zoho.endpoints.crmApiBase}/crm/v8/Products?page=${page}&per_page=${perPage}&fields=Qty_in_Stock,Unit_Price,Product_Name,Description`;
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return (data.data ?? []) as ZohoProduct[];
    } catch (error) {
      this.logger.error({
        message: 'Error listing products from Zoho CRM',
        module: 'ZohoCrmService',
        action: 'listProducts',
        output: {
          error_message: (error as any).message,
          zoho_error: (error as any)?.response?.data?.data || {},
        }
      });
      this.handleApiError(error);
    }
  }

  public async searchProducts(
    term: string,
    params: { page?: number; perPage?: number } = {}
  ): Promise<ZohoProduct[]> {
    try {
      const accessToken = await this.auth.getAccessToken();
      const { page = 1, perPage = 20 } = params;
      const url = `${config.zoho.endpoints.crmApiBase}/crm/v8/Products/search?word=${encodeURIComponent(term)}&page=${page}&per_page=${perPage}&fields=Qty_in_Stock,Unit_Price,Product_Name,Description`;
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return (data.data ?? []) as ZohoProduct[];
    } catch (error:any) {
      this.logger.error({
        message: 'Error searching products in Zoho CRM',
        module: 'ZohoCrmService',
        action: 'searchProducts',
        output: {
          error_message: error.message,
          zoho_error: error?.response?.data?.data || {},
        }
      });
      this.handleApiError(error);
    }
  }

  public async createProduct(product: ZohoProduct): Promise<void> {
    try {
      this.logger.info({
        message: 'Creating product in Zoho CRM',
        module: 'ZohoCrmService',
        action: 'createProduct', 
        output: {
          product,
        }
      });
      const accessToken = await this.auth.getAccessToken();
      const url = `${config.zoho.endpoints.crmApiBase}/crm/v8/Products`;
      const { data } = await axios.post(
        url,
        { data: [product] },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.data && data.data[0] && data.data[0].code === "SUCCESS") {
        this.logger.info({
          message: 'Product created successfully in Zoho CRM',
          module: 'ZohoCrmService',
          action: 'createProduct',
          output: {
            zoho_response: data.data[0],
          }
        });
        return;
      }
    } catch (error: any) {
      this.logger.error({
        message: 'Error creating product in Zoho CRM',
        module: 'ZohoCrmService',
        action: 'createProduct',
        output: {
          error_message: error.message,
          zoho_error: error?.response?.data?.data || {},
        }
      });
      this.handleApiError(error);
    }
  }

  private handleApiError(error: any): never {
    if(error.response?.data) {
        const errorCode = error.response?.data.data[0]?.code;
        const errorData = ERROR_CODES[errorCode as keyof typeof ERROR_CODES] || ERROR_CODES.INTERNAL_SERVER_ERROR;
        throw new AppError(errorData);
      }
      throw new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR);
  }

}
