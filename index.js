const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const https = require('https');
const fs = require('fs');

const yelpParsedCollectionsRouter = require('./routes/yelp-parsed-collections');
const yelpCollectionRouter = require('./routes/yelp-collection');
const yelpBusinessRouter = require('./routes/yelp-business');
const yelpRouter = require('./routes/yelp.router');
const googleRouter = require('./routes/google.router');
const geolocationRouter = require('./routes/geolocation.router');
const aiSearchRouter = require('./routes/ai-search.router');

const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/v1/', yelpParsedCollectionsRouter);
app.use('/v1/', yelpCollectionRouter);
app.use('/v1/', yelpBusinessRouter);
app.use('/v1/', yelpRouter);
app.use('/v1/', googleRouter);
app.use('/v1/', geolocationRouter);
app.use('/v1/', aiSearchRouter);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV == 'development') {
  const options = {
    key: fs.readFileSync('certificates/localhost-key.pem'),
    cert: fs.readFileSync('certificates/localhost.pem'),
  };

  https.createServer(options, app).listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// const revision = require('child_process')
//   .execSync('git rev-parse HEAD')
//   .toString().trim()

Sentry.init({
  dsn: 'https://b8b530bf641b4634a487354b1b824fb4@o1208538.ingest.sentry.io/6341791',
  environment: 'production',
  release: 'yelp-combinator@' + process.env.HEROKU_RELEASE_VERSION,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
  op: 'test',
  name: 'My First Test Transaction',
});

// app.get('/yelp-parsed-collections/scrape/g6DLKiR2ReMs-N5hN6zDwg', (request, response) => {
//   console.log('app response: ', response);
//   response.send('<h1>Hello World!</h1>');
// });
