import { Container } from 'inversify';
import { TYPES } from '@/types';
import {  ProductRepository } from '@/repositories/ProductRepository';
import { ProductService } from '@/services/ProductService';
import { Product } from '@/models/Product';
import { IProductService, IOrderService, IDatabase, ILogger, IAlgoliaService, IAlgoliaConfig } from '@/interfaces';
import { IZohoAuthService, IZohoCrmService } from '@/interfaces';
import { ZohoAuthService } from '@/services/zohoAuthService';
import { ZohoCrmService } from '@/services/zohoCrmService';
import { OrderService } from '@/services/OrderService';
import { OrderRepository } from '@/repositories/OrderRepository';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { Logger } from '@/utils/logger';
import { Database } from '@/database';
import { AlgoliaService } from './services/algoliaService';
import { config } from './config';

const container = new Container();

container.bind<ProductRepository>(TYPES.IProductRepository).to(ProductRepository);
container.bind<IProductService>(TYPES.IProductService).to(ProductService).inSingletonScope();
container.bind<typeof Product>(TYPES.ProductModel).toConstantValue(Product);
container.bind<IOrderService>(TYPES.IOrderService).to(OrderService).inSingletonScope();
container.bind<OrderRepository>(TYPES.OrderRepository).to(OrderRepository);
container.bind<typeof Order>(TYPES.OrderModel).toConstantValue(Order);
container.bind<typeof User>(TYPES.UserModel).toConstantValue(User);


container.bind<ILogger>(TYPES.ILogger).to(Logger).inSingletonScope();
container.bind<IDatabase>(TYPES.IDatabase).to(Database).inSingletonScope();
container.bind<IAlgoliaService>(TYPES.IAlgoliaService).to(AlgoliaService).inSingletonScope();
container.bind<IAlgoliaConfig>(TYPES.IDefaultAlgoliaConfig).toConstantValue(config.algolia);

container.bind<IZohoAuthService>(TYPES.IZohoAuthService).to(ZohoAuthService).inSingletonScope();
container.bind<IZohoCrmService>(TYPES.IZohoCrmService).to(ZohoCrmService).inSingletonScope();

export { container };
