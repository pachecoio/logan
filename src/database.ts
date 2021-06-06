import mongoose from 'mongoose';

const { MONGODB_URI } = process.env;

export class MongoDBOptions {
  public useNewUrlParser: boolean = true;
  public useFindAndModify: boolean = false;
  public useCreateIndex: boolean = true;
  public useUnifiedTopology: boolean = true;
  public reconnectTries: number = Number.MAX_VALUE;
  public reconnectInterval: number = 500;
  public connectTimeoutMS: number = 10000;
}

export class Connection {
  protected seeder: any;
  protected options: MongoDBOptions;
  constructor(
    uri: any = MONGODB_URI,
    options = new MongoDBOptions(),
    seeder = null
  ) {
    this.options = options;
    this.seeder = seeder;
    this.connect(uri, options);
  }

  private async connect(uri: string, options: MongoDBOptions = this.options) {
    if (this.seeder) await this.seed(uri);
    await mongoose.connect(uri, options);
  }

  private async seed(uri: string) {
    await this.seeder(uri);
  }

  private async close() {
    await mongoose.connection.close();
  }
}

export default new Connection();
