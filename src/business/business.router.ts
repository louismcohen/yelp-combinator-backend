import { Request, Response } from 'express';
import { Business } from './business';

const BUSINESS_PATH = '/business'
const router = require('express').Router();

router.route(BUSINESS_PATH).get((req: Request, res: Response) => {
  res.send('response test');
});

module.exports = router;