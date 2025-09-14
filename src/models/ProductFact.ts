import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface ProductFactAttributes {
  id: number;
  productId: number;
  factType: 'product' | 'order' | 'recommendation' | 'market';
  content: string;
  confidence: number;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFactCreationAttributes extends Optional<ProductFactAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class ProductFact extends Model<ProductFactAttributes, ProductFactCreationAttributes> implements ProductFactAttributes {
  public id!: number;
  public productId!: number;
  public factType!: 'product' | 'order' | 'recommendation' | 'market';
  public content!: string;
  public confidence!: number;
  public metadata!: any;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize: Sequelize): void {
    ProductFact.init(
      {
          id: {
              type: DataTypes.INTEGER.UNSIGNED,
              autoIncrement: true,
              primaryKey: true,
          },
          productId: {
              type: DataTypes.INTEGER.UNSIGNED,
              allowNull: false,
          },
          factType: {
              type: DataTypes.ENUM('product', 'order', 'recommendation', 'market'),
              allowNull: false,
          },
          content: {
              type: DataTypes.TEXT,
              allowNull: false,
          },
          confidence: {
              type: DataTypes.FLOAT,
              allowNull: false,
              defaultValue: 0.8,
          },
          metadata: {
              type: DataTypes.JSON,
              allowNull: true,
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Date.now()
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Date.now()
          }
      },
      {
        tableName: 'product_facts',
        sequelize,
      }
    );
  }
}
