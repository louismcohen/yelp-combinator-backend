import * as config from './src/config/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
  dotenv.config();
import mongoose from 'mongoose';

const app = express();

const PORT: (string | number) = process.env.PORT || 9000;

import { businessRouter } from './src/business/business.router';
import { collectionRouter } from './src/collection/collection.router';
import { businessDetailsRouter } from './src/yelp-fusion/business-details.router';
import { yelpScrapingRouter } from './src/yelp-scraping/yelp-scraping.router';
import ErrorHandler from './src/util/errorHandler';

app.use(cors());
app.use(express.json());
app.use(config.API_BASE_PATH, businessRouter);
app.use(config.API_BASE_PATH, collectionRouter);
app.use(config.API_BASE_PATH, businessDetailsRouter);
app.use(config.API_BASE_PATH, yelpScrapingRouter);
app.use(ErrorHandler.routeErrorHandler);

const uri: string | undefined = process.env.MONGO_URI;
if (uri) {
  mongoose.connect(uri);
  const connection = mongoose.connection;
  connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
  });
} else {
  console.error(`Invalid Mongo URI: ${uri}`);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});