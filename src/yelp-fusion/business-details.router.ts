import { Router } from "express";

const BusinessDetailsController = require('./business-details.controller');

const businessDetailsRouter = require('express').Router();

businessDetailsRouter.route('/business-details/:alias').get(BusinessDetailsController.getBusinessDetailsByAlias);

module.exports = businessDetailsRouter;