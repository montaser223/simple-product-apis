import { Model, DataTypes, Sequelize } from 'sequelize';

export class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string; // In a real app, this would be hashed

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize: Sequelize): void {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: new DataTypes.STRING(128),
          allowNull: false,
          unique: true,
        },
        password: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
      },
      {
        tableName: 'users',
        sequelize: sequelize,
      }
    );
  }
}
