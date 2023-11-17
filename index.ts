const config = require('./src/config/config');

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();

const PORT: (String | Number) = process.env.PORT || 9000;

const business = require('./src/business/business.router');
const collection = require('./src/collection/collection.router');
const businessDetails = require('./src/yelp-fusion/business-details.router');

app.use(cors());
app.use(express.json());
app.use(config.API_BASE_PATH, business);
app.use(config.API_BASE_PATH, collection);
app.use(config.API_BASE_PATH, businessDetails);

const uri: (String | void) = process.env.MONGO_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});