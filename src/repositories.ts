import mongoose from 'mongoose';
import { HttpRequestError } from './exceptions';

export class BaseRepository {
  model!: any;
  constructor(model: any) {
    this.model = model;
  }

  // @ts-ignore
  filter(query: any, paginated: boolean = true) {
    const { skip = 0, limit = 10, ...args } = query;

    for (const item of Object.keys(args)) {
      args[item] = new RegExp(args[item], 'i');
    }

    if (args._id) {
      try {
        args._id = new mongoose.mongo.ObjectId(args._id);
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.log('not able to generate mongoose id with content', args._id);
      }
    }

    return this.model.find(args).skip(skip).limit(limit);
  }

  get(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return new HttpRequestError(400, `Invalid id ${id}`);
    return this.model.findById(id);
  }

  async create(data: any) {
    const item: any = await this.model.create(data);
    if (!item) return new HttpRequestError(400, 'Failed creating item');
    return item;
  }

  async update(id: string, data: any) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return new HttpRequestError(400, `Invalid id ${id}`);
    const item = await this.model.findById(id);
    if (!item) return new HttpRequestError(404, `Item not found with id ${id}`);
    Object.keys(data).forEach((key) => {
      item[key] = data[key];
    });
    return item.save();
  }

  // @ts-ignore
  async delete(id: string) {
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted)
      return new HttpRequestError(404, `Item not found with id ${id}`);
  }
}
