import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { YELP_BIZ_API_URI } from '../config/config';
import { YelpFusionError } from './yelp-fusion-error';

class ErrorHandler {
  routeErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error.type === 'noBusinessAlias') {
      res.status(400).send({
        message: 'No business alias provided',
      })
    } else {
      const url: string = error?.config?.url;

      if (url?.includes(YELP_BIZ_API_URI)) {
        const status = error.response.status;
        const yelpErrorMessage = error.response.data.error;
  
        const yelpError: YelpFusionError = {
          yelpErrorMessage,
          url,
        }
  
        res.status(status).send(yelpError);
      } else {
        console.log({error});
        res.send(error);
      }
    }    
  }
}

export default new ErrorHandler();