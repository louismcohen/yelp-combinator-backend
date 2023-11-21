import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

class ErrorHandler {
  routeErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

  }

  HTTP_ERROR_MESSAGES = {
    noBusinessAlias: `No business alias provided`,
  }
}

export default new ErrorHandler();