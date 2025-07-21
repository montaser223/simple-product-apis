import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from '@/models/User';
import { Product } from '@/models/Product';

export class Order extends Model {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public quantity!: number;
  public totalAmount!: number;
  public status!: string; // e.g., 'pending', 'completed', 'cancelled'

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize: Sequelize): void {
    Order.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: User,
            key: 'id',
          },
        },
        productId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: Product,
            key: 'id',
          },
        },
        quantity: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        totalAmount: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        status: {
          type: new DataTypes.STRING(50),
          allowNull: false,
          defaultValue: 'pending',
        },
      },
      {
        tableName: 'orders',
        sequelize: sequelize,
      }
    );
  }

  public static associate(): void {
    Order.belongsTo(User, { foreignKey: 'userId' });
    Order.belongsTo(Product, { foreignKey: 'productId' });
  }
}
