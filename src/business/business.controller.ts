import { NextFunction, Request, Response } from 'express';
import { Business } from './business';
import BusinessService from './business.service';
import ErrorHandler from '../util/errorHandler';

class BusinessController {
  getBusinessByAlias = async (req: Request, res: Response, next: NextFunction): Promise<Business | any> => {
    const alias: string = req.params.alias;

    try {
      const business = await BusinessService.getBusinessByAlias(alias);
      res.send(business);

    } catch (error) {
      next(error);
    }
  }

  getAllBusinesses = async (req: Request, res: Response, next: NextFunction): Promise<Business[] | any> => {
    try {
      const businesses = await BusinessService.getAllBusinesses();
      res.send(businesses);
    } catch (error) {
      next(error);
    }
  }

  addOrUpdateBusiness = async (req: Request, res: Response, next: NextFunction): Promise<Business | any> => {
    const business: Business = req.body;

    try {
      if (!business.alias) {
        next({type: 'noBusinessAlias'});
      } else {
        const savedBusiness = await BusinessService.addOrUpdatedBusiness(business);
        res.send(savedBusiness);
      }
      
    } catch (error) {
      next(error);
    }
  }
}

export default new BusinessController();