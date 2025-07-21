import 'reflect-metadata';
import './module-alias'; // Import module-alias setup
import {config as dotenv} from 'dotenv';
dotenv(); // Load environment variables from .env file

import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from '@/inversify.config';
import * as bodyParser from 'body-parser';
import { config } from './config'; // Updated import path for config
import swaggerUi from 'swagger-ui-express';
import { ILogger } from '@/interfaces/ILogger';
import { TYPES } from '@/types';
import { IDatabase } from '@/interfaces/IDatabase';

// Import controllers to ensure they are registered
import '@/controllers/ProductController';
import '@/controllers/HealthController';
import '@/controllers/OrderController';

import { errorHandler } from '@/middlewares/errorHandler';
import swaggerSpec from './swagger';

const database = container.get<IDatabase>(TYPES.IDatabase); // Get database instance from container
const appLogger = container.get<ILogger>(TYPES.ILogger);

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
});

const app = server.build();

// Error handling middleware
app.use(errorHandler);

database.initialize(false).then(() => { // Do not force sync on app startup
  appLogger.info({
    message: `Server started on port ${config.port}`,
    module: 'Index',
    action: 'ServerStart',
    output: { port: config.port }
  });
  appLogger.info({
    message: `Swagger UI available at http://localhost:${config.port}/api-docs`,
    module: 'Index',
    action: 'SwaggerDocs',
    output: { url: `http://localhost:${config.port}/api-docs` }
  });
  app.listen(config.port);
}).catch(err => {
  appLogger.error({
    message: 'Failed to start server due to database error',
    module: 'Index',
    action: 'ServerStart',
    output: {
      error_message: err?.message,
      error: err
    }
  });
  process.exit(1);
});
