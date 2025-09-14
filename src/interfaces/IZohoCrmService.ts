export interface ZohoProduct {
  id?: string;
  Product_Name: string;
  Description?: string;
  Unit_Price?: number;
  Qty_in_Stock?: number;
}

export interface IZohoCrmService {
  listProducts(params: { page?: number; perPage?: number }): Promise<ZohoProduct[]>;
  searchProducts(term: string, params: { page?: number; perPage?: number }): Promise<ZohoProduct[]>;
  createProduct(product: ZohoProduct): Promise<void>;
}


