import 'reflect-metadata';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { container } from '@/inversify.config';
import { ILogger } from '@/interfaces/ILogger';
import { TYPES } from '@/types';
import { IDatabase } from '@/interfaces/IDatabase';

const appLogger = container.get<ILogger>(TYPES.ILogger);
const database = container.get<IDatabase>(TYPES.IDatabase); // Get database instance from container

const seedData = async () => {
    try {
        await database.initialize(true); // Ensure database is synced and forced before seeding

        // Seed data
        await Product.bulkCreate([
            { name: 'Laptop', description: 'Powerful laptop for work and gaming', price: 1200, stock: 50 },
            { name: 'Mouse', description: 'Ergonomic wireless mouse', price: 25, stock: 200 },
            { name: 'Keyboard', description: 'Mechanical keyboard with RGB lighting', price: 75, stock: 100 },
        ]);
        appLogger.info({
            message: 'Products seeded!',
            module: 'SeedScript',
            action: 'SeedProducts',
            output: {}
        });

        await User.bulkCreate([
            { username: 'john_doe', password: 'password123' },
            { username: 'jane_smith', password: 'securepass' },
        ]);
        appLogger.info({
            message: 'Users seeded!',
            module: 'SeedScript',
            action: 'SeedUsers',
            output: {}
        });

        appLogger.info({
            message: 'All data seeded successfully!',
            module: 'SeedScript',
            action: 'SeedAll',
            output: {}
        });

    } catch (error: any) {
        appLogger.error({
            message: 'Error seeding database',
            module: 'SeedScript',
            action: 'SeedAll',
            error: error,
            output: {
                error_message: error?.message,
                error_stack: error?.stack
            }
        });
        process.exit(1);
    } finally {
        await database.close(); // Close the database connection
    }
};

seedData();
