import { Request, Response } from 'express';
import { BusinessDetails } from "./business-details";
import { YELP_AXIOS_OPTIONS } from '../config/config';

const config = require('../config/config');
const axios = require('axios');

const getBusinessDetailsByAlias = async (req: Request, res: Response) => {
  const alias = req.params.alias;

  try {
    const businessDetailsResponse = await axios(`${config.YELP_BIZ_API_URI}${encodeURI(alias)}`, YELP_AXIOS_OPTIONS);
    const businessDetails: BusinessDetails = businessDetailsResponse.data;
    res.send(businessDetails);

  } catch (error) {
    console.error({error});
  }
}

module.exports = {
  getBusinessDetailsByAlias,
}