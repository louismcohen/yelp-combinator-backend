import { Request, Response } from 'express';
import { BusinessDetails } from "./business-details";
import { YELP_AXIOS_OPTIONS } from '../config/config';

import * as config from '../config/config'
import axios from 'axios';
import Bottleneck from 'bottleneck';

const limiter = new Bottleneck({
  maxConcurrent: 5,
  minTime: 333,
})

class BusinessDetailsController {
  getBusinessDetailsByAlias = async (req: Request, res: Response) => {
    const alias: string = req.params.alias;
  
    try {
      const businessDetailsResponse = await axios(`${config.YELP_BIZ_API_URI}${encodeURI(alias)}`, YELP_AXIOS_OPTIONS);
      const businessDetails: BusinessDetails = businessDetailsResponse.data;
      res.send(businessDetails);
  
    } catch (error) {
      console.error({error});
    }
  }
}

export default new BusinessDetailsController();