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
  uri: string;
  constructor(
    uri: any = MONGODB_URI,
    options = new MongoDBOptions(),
    seeder = null
  ) {
    this.options = options;
    this.seeder = seeder;
    this.uri = uri;
  }

  public async connect(options: MongoDBOptions = this.options) {
    if (this.seeder) await this.seed(this.uri);
    await mongoose.connect(this.uri, options);
  }

  private async seed(uri: string) {
    await this.seeder(uri);
  }

  public async close() {
    await mongoose.connection.close();
  }
}

export default new Connection();
