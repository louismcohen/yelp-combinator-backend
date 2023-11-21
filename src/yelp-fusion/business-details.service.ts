import axios, { AxiosResponse } from "axios";
import { YELP_BIZ_API_URI, YELP_AXIOS_OPTIONS } from '../config/config'
import { BusinessDetails } from "./business-details";
import Bottleneck from 'bottleneck';

class BusinessDetailsService {
  private limiter = new Bottleneck({
    maxConcurrent: 5,
    minTime: 333,
  })

  getBusinessDetailsByAlias = async (alias: string): Promise<BusinessDetails> => {
    try {
      const businessDetailsResponse: AxiosResponse = await this.limiter.schedule(() => axios(`${YELP_BIZ_API_URI}${encodeURI(alias)}`, YELP_AXIOS_OPTIONS));
      const businessDetails: BusinessDetails = businessDetailsResponse.data;

      return businessDetails;
    } catch (error: any) {
      // const reportedError = {
      //   ...error.response.data,
      //   status: error.response.status,
      //   url: error.config.url,
      // }
      // console.log({error}, error.response.data);
      // throw {error, reportedError};
      throw error;
    }
  }
}

export default new BusinessDetailsService();