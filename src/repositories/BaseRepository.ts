import { injectable } from 'inversify';
import { Model, CreationAttributes, WhereOptions, ModelStatic } from 'sequelize';
import { IRepository, Identifiable } from '@/interfaces';

@injectable()
export class BaseRepository<T extends Model<any, any> & Identifiable> implements IRepository<T> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  public async findAll(options?: { where?: WhereOptions<T>; limit?: number; offset?: number }): Promise<T[]> {
    return this.model.findAll(options);
  }

  public async findById(id: number): Promise<T | null> {
    return this.model.findByPk(id);
  }

  public async create(item: CreationAttributes<T>): Promise<T> {
    return this.model.create(item);
  }

  public async update(id: number, item: Partial<CreationAttributes<T>>): Promise<[number, T[]]> {
    const [affectedCount, affectedRows] = await this.model.update(item, {
      where: { id: id } as WhereOptions<T>,
      returning: true,
    });
    return [affectedCount, affectedRows as T[]];
  }

  public async delete(id: number): Promise<number> {
    return this.model.destroy({
      where: { id: id } as WhereOptions<T>,
    });
  }
}
