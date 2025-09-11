// i need to add contract for algoli that the service will implement it.

import { Product } from "@/models/Product";
import { Hit } from "algoliasearch";

// so we need to add method for inserting data to algolia index using index name and data to be inserted.
export interface IAlgoliaService {
    insertData(indexName: string, data: any): Promise<void>;
    listObjects(params: {indexName: string, page: number, hits: number}): Promise<Hit<Product>[]>;
    searchObjects(params: {indexName: string, query: string, page?: number, hits?: number}): Promise<Hit<Product>[] | undefined>;
}