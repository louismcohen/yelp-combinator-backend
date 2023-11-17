import { Request, Response } from 'express';
import { Collection } from './collection';

const router = require('express').Router();

router.route('/collection/').get((req: Request, res: Response) => {
  res.send('collection response');
});

module.exports = router;