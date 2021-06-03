import express, { Express, Request, Response } from "express";
import * as http from "http";

import session from "express-session";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import { HttpRequestError } from "./exceptions";

import { Connection } from "./database";

export enum METHOD {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

interface RouteConfigProps {
  method: METHOD;
  path: string;
  status: number;
}

export class Server {
  private readonly _app: Express;

  // @ts-ignore
  get app(): Express {
    return this._app;
  }

  private _server!: http.Server;

  // @ts-ignore
  get server(): http.Server {
    return this._server;
  }

  // @ts-ignore
  constructor(connection: Connection = new Connection()) {
    this._app = express();
    this._app.set('port', process.env.PORT || 5000);
    this.configureMiddleware();
  }

  private configureMiddleware() {
    this._app.use(bodyParser.json());
    this._app.use(bodyParser.urlencoded({ extended: true }));
    this._app.use(fileUpload());
    this._app.set("trust proxy", 1);
    this._app.use(
      session({
        // @ts-ignore
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
          maxAge: 60000,
        },
      })
    );
  }

  public start() {
    this._server = this._app.listen(this._app.get("port"), () => {
      console.log("🚀 Server is running on port " + this._app.get("port"));
    });
  }

  request = ({
               method,
               path,
               status = 200,
             }: RouteConfigProps): MethodDecorator => {
    return (
      _target: object,
      _propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ) => {
      // @ts-ignore
      const response = async (req: Request, res: Response) => {
        try {
          const original = await descriptor.value(req, res);
          const statusCode = original && original.status ? original.status : status;
          res.status(statusCode).send(original);
        } catch (error) {
          console.log("error found", error);
          const responseError = new HttpRequestError(
            500,
            "Server Error",
            error
          );
          return res.status(responseError.status).send(responseError);
        }
      };

      this.app[method](path, response);
    };
  };

  get = (path: any): MethodDecorator =>
    this.request({ method: METHOD.GET, path, status: 200 });

  post = (path: any): MethodDecorator =>
    this.request({ method: METHOD.POST, path, status: 201 });

  put = (path: any): MethodDecorator =>
    this.request({ method: METHOD.PUT, path, status: 200 });

  patch = (path: any): MethodDecorator =>
    this.request({ method: METHOD.PATCH, path, status: 202 });

  delete = (path: any): MethodDecorator =>
    this.request({ method: METHOD.DELETE, path, status: 204 });
}

export default new Server();
