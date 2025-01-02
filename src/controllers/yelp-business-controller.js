import { findOneAndUpdate } from '../models/yelp-business.model';
import axios from 'axios';
import { getYelpBusinessInfo, updateBusinessByAlias, updatedSavedBusiness, getAllBusinesses, getBusinessByAlias, updateAllBusinesses, updateIncompleteBusinesses, updateAllBusinessesBasicInfo, deleteAllBusinesses } from '../services/yelp-business.service';
import Bottleneck from 'bottleneck';
import { request } from 'express';

const maxIndex = -1;
const delay = 1000;
const limiter = new Bottleneck({
  maxConcurrent: 5,
  minTime: 333
})

const updateAllIncompleteBusinesses = async (request, response, next) => {
  const businesses = request.businesses;
  businesses.filter(x => !x.name).map(async business => {
    console.log(business);
    try {
      const data = await limiter.schedule(() => getYelpBusinessInfo(business.alias));
      findOneAndUpdate(
        {alias: business.alias},
        data,
        {new: true, upsert: true},
        (error, result) => {
          if (error) {
            console.log('Error: ', error.response.status);
          } else {
            console.log(`Successfully updated ${business.addedIndex}: ${data.name}`);
          }
        }
      )
    } catch(error) {
      console.log(`error for ${business.alias}`, error.response.status);
    }   
    
  });
  response.json('Updates successful');
}

const addOrUpdateBusinessByAlias = async (request, response) => {
  const alias = request.query.alias;
  const updated = await updateBusinessByAlias(alias);
  response.json(updated);
}

const updatedSaved = async (request, response) => {
  const data = request.body;
  const updated = await updatedSavedBusiness(data);
  response.json(updated);
}

const getAll = async (request, response) => {
  const businesses = await getAllBusinesses();
  businesses ?
    response.json(businesses) :
    response.status(400).json(`Error getting all businesses`);          
}

const getByAlias = async (request, response) => {
  const business = await getBusinessByAlias(request.query.alias);
  business ?
    response.json(business) :
    response.status(400).json(`Error getting business with alias ${request.query.alias}`);
}

const updateAll = async (request, response) => {
  try {
    const allBusinesses = await updateAllBusinesses();
    response.json(allBusinesses);
  } catch (error) {
    response.status(400).json(`Error updating all businesses\n${error}`);
  }
}

const updateIncomplete = async (request, response) => {
  const updated = await updateIncompleteBusinesses();
  updated ?
    response.json(updated) :
    response.status(400).json(`Error updated incomplete businesses`);
}

const updateAllBasicInfo = async (request, response) => {
  try {
    const updatedBusinesses = await updateAllBusinessesBasicInfo();
    response.json(updatedBusinesses);
  } catch (error) {
    response.status(400).json(`Error updating all basic info ${error}`);
  }
}

const deleteAll = async (request, response) => {
  try {
    const result = await deleteAllBusinesses();
    response.json(result);
  } catch (error) {
    response.status(400).json(`Error deleting all businesses ${error}`);
  }
}

const YelpBusinessController = async (request, response) => {
  const method = request.method;
  const action = request.query.action;
  
  switch (method) {
    case 'GET':
      switch (action) {
        case 'getAll':
          sgetAll(request, response);
          break;
        case 'getByAlias':
          getByAlias(request, response);
          break;
        default:
          response.status(400).json(`Invalid action ${action} for method ${method}`);
      }
      break;
    case 'PUT':
      switch (action) {
        case 'addOrUpdate':
          addOrUpdateBusinessByAlias(request, response);
          break;
        case 'updateSaved':
          updatedSaved(request, response);
          break;
        case 'updateAll':
          updateAll(request, response);
          break;
        case 'updateIncomplete':
          updateIncomplete(request, response);
          break;
        case 'updateAllBasicInfo':
          updateAllBasicInfo(request, response);
          break;
        default:
          response.status(400).json(`Invalid action ${action} for method ${method}`);
      }
      break;
    case 'DELETE':
      switch (action) {
        case 'deleteAll':
          deleteAll(request, response);
          break;
        default:
          response.status(400).json(`Invalid action ${action} for method ${method}`);
      }
      break;
    default:
      response.status(400).json(`Invalid method: ${method}`);
  }
}

export default YelpBusinessController;