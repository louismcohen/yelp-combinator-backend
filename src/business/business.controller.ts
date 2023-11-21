import { Request, Response } from 'express';
import { Business } from './business';
import BusinessService from './business.service';
import ErrorHandler from '../util/errorHandler';

class BusinessController {
  getBusinessByAlias = async (req: Request, res: Response): Promise<Business | any> => {
    const alias: string = req.params.alias;

    try {
      if (!alias) {
        res.status(400).send(ErrorHandler.HTTP_ERROR_MESSAGES.noBusinessAlias);
      } else {
        const business = await BusinessService.getBusinessByAlias(alias);
        res.send(business);
      }

    } catch (error) {
      res.status(500).send(error);
    }
  }

  getAllBusinesses = async (req: Request, res: Response): Promise<Business[] | any> => {
    try {
      const businesses = await BusinessService.getAllBusinesses();
      res.send(businesses);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  addOrUpdateBusiness = async (req: Request, res: Response): Promise<Business | any> => {
    const business: Business = req.body;

    try {
      if (!business.alias) {
        res.status(400).send(ErrorHandler.HTTP_ERROR_MESSAGES.noBusinessAlias);
      } else {
        const savedBusiness = await BusinessService.addOrUpdatedBusiness(business);
        res.send(savedBusiness);
      }
      
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

export default new BusinessController();