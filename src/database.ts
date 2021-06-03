import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 10000,
};

export class Connection {
  constructor(uri = MONGODB_URI, seeder = null) {
    mongoose.Promise = global.Promise;
    if (seeder) {
      // @ts-ignore
      seeder(uri).then(() => {
        // @ts-ignore
        return this.connect(uri);
      });
    } else {
      // @ts-ignore
      this.connect(uri);
    }
  }

  private connect(uri: string) {
    mongoose
      .connect(uri, options)
      // tslint:disable-next-line: only-arrow-functions
      .then(function () {
        console.log("MongoDB is connected");
      })
      // tslint:disable-next-line: only-arrow-functions
      .catch(function (err) {
        console.log(err);
      });
  }
}

export default new Connection();
