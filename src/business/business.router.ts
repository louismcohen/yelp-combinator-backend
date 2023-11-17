import { Request, Response } from 'express';
import { Business } from './business';

const businessRouter = require('express').Router();

businessRouter.route('/business').get((req: Request, res: Response) => {
  res.send('response test');
});

module.exports = businessRouter;