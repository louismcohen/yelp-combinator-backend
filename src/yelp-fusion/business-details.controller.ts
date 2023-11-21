import { NextFunction, Request, Response } from 'express';
import { BusinessDetails } from "./business-details";

import { BasicBusiness } from '../business/business';
import BusinessDetailsService from './business-details.service';

class BusinessDetailsController {
  getBusinessDetailsByAlias = async (req: Request, res: Response, next: NextFunction) => {
    const alias: string = req.params.alias;
    try {
      const businessDetails: BusinessDetails = await BusinessDetailsService.getBusinessDetailsByAlias(alias);
      res.send(businessDetails);

    } catch (error) {
      next(error);
    }
  }


  getManyBusinessDetailsByAlias = async (req: Request, res: Response, next: NextFunction) => {
    const businesses: BasicBusiness[] = req.body.businesses;
    const aliases: string[] = businesses
      .filter((business) => !!business.alias)
      .map((business) => business.alias);

    const businessDetails = await Promise.all(aliases.map((alias) => {
      
    }))
  }

  getManyBusinessDetails = async (aliases: string[]): Promise<unknown[]> => {
    const businessDetails = Promise.all(aliases.map(alias => {
      // return this.limiter.schedule(() => this.getBusinessDetails(alias));
    }))

    return businessDetails;
  }
}

export default new BusinessDetailsController();