import { Request, Response } from 'express';
import { BusinessDetails } from "./business-details";
import { YELP_AXIOS_OPTIONS } from '../config/config';

import * as config from '../config/config'
import axios, { AxiosResponse } from 'axios';
import Bottleneck from 'bottleneck';
import { BasicBusiness } from '../business/business';

class BusinessDetailsController {
  private limiter = new Bottleneck({
    maxConcurrent: 5,
    minTime: 333,
  })

  getBusinessDetailsByAlias = async (req: Request, res: Response) => {
    const alias: string = req.params.alias;
    const businessDetails = await this.limiter.schedule(() => this.getBusinessDetails(alias));

    res.send(businessDetails);
  }

  getBusinessDetails = async (alias: string) => {
    try {
      const businessDetailsResponse: AxiosResponse = await axios(`${config.YELP_BIZ_API_URI}${encodeURI(alias)}`, YELP_AXIOS_OPTIONS);
      const businessDetails: BusinessDetails = businessDetailsResponse.data;

      return businessDetails;
  
    } catch (error) {
      console.error({error});
      return error;
    }
  }

  getManyBusinessDetailsByAlias = async (req: Request, res: Response) => {
    const businesses: BasicBusiness[] = req.body.businesses;
    const aliases: string[] = businesses
      .filter((business) => !!business.alias)
      .map((business) => business.alias);

    const businessDetails = await Promise.all(aliases.map((alias) => {
      
    }))
  }

  getManyBusinessDetails = async (aliases: string[]): Promise<unknown[]> => {
    const businessDetails = Promise.all(aliases.map(alias => {
      return this.limiter.schedule(() => this.getBusinessDetails(alias));
    }))

    return businessDetails;
  }
}

export default new BusinessDetailsController();