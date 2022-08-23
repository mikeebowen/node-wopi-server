import { Request } from 'express';

export interface ICustomRequest extends Request {
  rawBody?: Buffer;
}
