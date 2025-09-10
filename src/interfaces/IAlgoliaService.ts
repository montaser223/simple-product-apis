// i need to add contract for algoli that the service will implement it.
// so we need to add method for inserting data to algolia index using index name and data to be inserted.
export interface IAlgoliaService {
    insertData(indexName: string, data: any): Promise<void>;
}