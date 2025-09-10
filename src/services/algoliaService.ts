import { injectable, inject } from 'inversify';
import { TYPES } from '@/types';
import { ILogger } from '@/interfaces/ILogger';
import { IAlgoliaService } from '@/interfaces';
import { Algoliasearch, algoliasearch } from 'algoliasearch';
import { IAlgoliaConfig } from '@/interfaces';

@injectable()
export class AlgoliaService implements IAlgoliaService {
    private client: Algoliasearch;
  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IDefaultAlgoliaConfig) private config: IAlgoliaConfig,
  ) {
    this.client = algoliasearch(this.config.applicationId, this.config.apiKey);
  }
    async insertData(indexName: string, data: any): Promise<void> {
        try {
            // Simulate inserting data to Algolia index
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
            // Here you would have the actual Algolia SDK call to insert data
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
            // throw new AppError('Failed to insert data to Algolia', ERROR_CODES.INTERNAL_SERVER_ERROR);
        }       
    }
}
