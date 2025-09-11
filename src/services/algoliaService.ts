import { injectable, inject } from 'inversify';
import { TYPES } from '@/types';
import { ILogger } from '@/interfaces/ILogger';
import { IAlgoliaService } from '@/interfaces';
import { Algoliasearch, algoliasearch, Hit } from 'algoliasearch';
import { IAlgoliaConfig } from '@/interfaces';
import { Product } from '@/models/Product';

@injectable()
export class AlgoliaService implements IAlgoliaService {
    private client: Algoliasearch;
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IDefaultAlgoliaConfig) private config: IAlgoliaConfig,
  ) {
    this.client = algoliasearch(this.config.applicationId, this.config.apiKey);
  }

    async listObjects(params: {indexName: string, page: number, hits: number}): Promise<Hit<Product>[]> {
       const {indexName, page, hits} = params;
       try {
         const response = await this.client.browseObjects<Product>({
            indexName,
            aggregator: (hits) => hits,     
            browseParams: {page, hitsPerPage: hits}
        },{cacheable: true});
        this.logger.info({
            message: `Objects listed from index ${indexName} successfully`,
            action: 'listObjects',
            module: 'AlgoliaService',
            output: {
                indexName,
                hits_count: response.hits.length,
            }
        });
        return response.hits;
       } catch (error) {
        this.logger.error({
            message: `Failed to list objects from Algolia index ${indexName}`,
            action: 'listObjects',  
            module: 'AlgoliaService',
            output:{
                indexName,
                error_message: (error as any).message
            }
        });
        return [];
       }
    }

    async searchObjects(params: {indexName: string, query: string, page: number, hits: number}): Promise<Hit<Product>[] | undefined> {
        const {indexName, query, page, hits} = params;
        try {
            const response = await this.client.searchSingleIndex<Product>({indexName, 
                searchParams: {query, page, hitsPerPage: hits}},
                {cacheable: true});
            this.logger.info({
                message: `Search in index ${indexName} with query "${query}" executed successfully`,    
                action: 'searchObjects',
                module: 'AlgoliaService',
                output: {
                    indexName,
                    query,
                    hits_count:response.hits.length,
                    processingTimeMS:response.processingTimeMS,
                    nbHits:response.nbHits,
                }
            });
            return response.hits;
        } catch (error) {
            this.logger.error({
                message: `Failed to search objects in Algolia index ${indexName} with query "${query}"`,
                action: 'searchObjects',
                module: 'AlgoliaService',
                output:{
                    indexName,  
                    query,
                    error_message: (error as any).message
                }
            });
            return [];
        }
    }

    async insertData(indexName: string, data: any): Promise<void> {
        try {
           const response = await this.client.saveObject({indexName, body: data});
            this.logger.info({
                message: `Data inserted to index ${indexName} successfully`,
                action: 'insertData',
                module: 'AlgoliaService',
                output: {
                    indexName,
                    objectID: response.objectID,
                    response
                }
            });
        } catch (error) {
            this.logger.error({
                message: `Failed to insert data to Algolia index ${indexName}`,
                action: 'insertData',
                module: 'AlgoliaService',
                output:{
                    indexName,
                    error_message: (error as any).message
                }
            });
        }       
    }
}
