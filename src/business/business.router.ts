import BusinessController from './business.controller';

import { Router } from 'express';
export const businessRouter: Router = Router();

businessRouter.route('/business/').get(BusinessController.getAllBusinesses);
businessRouter.route('/business/:alias').get(BusinessController.getBusinessByAlias);

businessRouter.route('/business/').post(BusinessController.addOrUpdateBusiness);