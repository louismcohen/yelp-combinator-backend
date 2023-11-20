import { Request, Response } from 'express';
import { Business } from './business';

import express from 'express';
import { Router } from 'express';
export const businessRouter: Router = Router();

businessRouter.route('/business').get((req: Request, res: Response) => {
  res.send('response test');
});