import { Router } from "express";

import BusinessDetailsController from './business-details.controller';
export const businessDetailsRouter: Router = Router();

businessDetailsRouter.route('/business-details/:alias').get(BusinessDetailsController.getBusinessDetailsByAlias);