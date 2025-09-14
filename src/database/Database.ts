import { Sequelize } from 'sequelize';
import { injectable, inject } from 'inversify';
import { config } from '@/config';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { Order } from '@/models/Order';
import { ProductFact } from '@/models/ProductFact';
import { ILogger } from '@/interfaces/ILogger';
import { IDatabase } from '@/interfaces/IDatabase';
import { TYPES } from '@/types';
import { ERROR_CODES } from '@/consts';
import { AppError } from '@/utils/appError';

@injectable()
export class Database implements IDatabase {
    private sequelize: Sequelize;
    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: config.database.storage,
            logging: config.database.logging ? (sql: string, timing?: number) => {
                this.logger.debug({
                    message: 'Database query executed',
                    module: 'Database',
                    action: 'Query',
                    output: {
                        query: sql,
                        timing: `${timing}ms`,
                    }
                });
            } : false,
            benchmark: config.database.logging,
        });
    }

    public async initialize(force: boolean = false): Promise<void> {
        try {
            // Initialize models
            Product.initialize(this.sequelize);
            User.initialize(this.sequelize);
            Order.initialize(this.sequelize);
            ProductFact.initialize(this.sequelize);

            // Set up associations
            Order.associate();

            // Sync database
            await this.sequelize.sync({ force: force || config.database.forceSync });
            this.logger.info({
                message: 'Database & tables created/synced successfully!',
                module: 'Database',
                action: 'Initialization',
                output: {}
            });

        } catch (error: any) {
            this.logger.error({
                message: 'Error syncing database',
                module: 'Database',
                action: 'Initialization',
                error: error,
                output: {}
            });
            throw new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR, `Database initialization failed: ${error.message}`);
        }
    }

    public async close(): Promise<void> {
        try {
            await this.sequelize.close();
            this.logger.info({
                message: 'Database connection closed.',
                module: 'Database',
                action: 'Close',
                output: {}
            });
        } catch (error: any) {
            this.logger.error({
                message: 'Error closing database connection',
                module: 'Database',
                action: 'Close',
                error: error,
                output: {}
            });
            throw new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR, `Database closing failed: ${error.message}`);
        }
    }

    public getSequelizeInstance(): Sequelize {
        return this.sequelize;
    }
}
