export interface IDatabase {
    initialize(force?: boolean): Promise<void>;
    close(): Promise<void>;
}
