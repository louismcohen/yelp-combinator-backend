import * as config from './src/config/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
  dotenv.config();
import mongoose from 'mongoose';

import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from "@sentry/profiling-node";

const app = express();

const PORT: (string | number) = process.env.PORT || 9000;

import { businessRouter } from './src/business/business.router';
import { collectionRouter } from './src/collection/collection.router';
import { businessDetailsRouter } from './src/yelp-fusion/business-details.router';
import { yelpScrapingRouter } from './src/yelp-scraping/yelp-scraping.router';
import ErrorHandler from './src/util/error-handler';

Sentry.init({
  dsn: 'https://ac28fc0beef9caa30425faf6996647b5@o1208538.ingest.sentry.io/4506262460366848',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(cors());
app.use(express.json());
app.use(config.API_BASE_PATH, businessRouter);
app.use(config.API_BASE_PATH, collectionRouter);
app.use(config.API_BASE_PATH, businessDetailsRouter);
app.use(config.API_BASE_PATH, yelpScrapingRouter);
app.use(Sentry.Handlers.errorHandler());
// app.use(ErrorHandler.logger);
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