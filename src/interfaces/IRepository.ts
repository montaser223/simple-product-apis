import { Model, CreationAttributes, WhereOptions } from 'sequelize';

export interface Identifiable {
  id?: number;
}

export interface IRepository<T extends Model<any, any> & Identifiable> {
  findAll(options?: { where?: WhereOptions<T>; limit?: number; offset?: number }): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(item: CreationAttributes<T>): Promise<T>;
  update(id: number, item: Partial<CreationAttributes<T>>): Promise<[number, T[]]>;
  delete(id: number): Promise<number>;
}
