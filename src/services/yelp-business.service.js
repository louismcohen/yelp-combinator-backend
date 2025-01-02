import { findOneAndUpdate, find, findOne, deleteMany } from '../models/yelp-business.model';
import axios from 'axios';
import { yelpAxiosOptions, YELP_BIZ_API_URI } from '../config/yelp-connection.config';
import Bottleneck from 'bottleneck';
import { find as _find } from '../models/yelp-collection.model';
import GoogleTimeZoneController from '../controllers/google-timezone.controller';
import { getTimeZoneByCoordinates } from '../services/geolocation.service';
import _ from 'lodash';

import { captureException } from "@sentry/node";

const limiter = new Bottleneck({
  maxConcurrent: 5,
  minTime: 500,
})

const getYelpBusinessInfo = async (alias) => {
  try {
    const info = await axios(`${YELP_BIZ_API_URI}${encodeURI(alias)}`, yelpAxiosOptions);
    return info.data;
  } catch (error) {
    captureException(error);
    return error.response.data;
  }
}

const populateBasicBusinessInfo = (collection) => {
  console.log('populateBasicBusinessInfo', collection.title);
  collection.items.forEach((item, index) => {
    const url = item.querySelector('.biz-name').href;
    const alias = decodeURI(url.substring(url.lastIndexOf('/') + 1));
    const note = item.querySelector('.js-info-content').textContent;
    const addedIndex = collection.itemCount - index - 1;
    const yelpCollectionId = collection.yelpCollectionId;
    if (addedIndex < 0) {
      console.log('NEGATIVE ADDEDINDEX');
      console.log({alias, item, index, addedIndex, itemCount: collection.itemCount});
    }
    collection.businesses.push({
        alias,
        note,
        addedIndex,
        yelpCollectionId
    })
  })

  return collection;
}

const applyAddedIndexToCollections = (collections) => {
  return collections.map(
    collection => ({...collection, businesses: collection.businesses.map(
      (biz, idx) => ({...biz, addedIndex: collection.businesses.length - idx - 1})
    )})
  )
}

const updateBusinessById = async (id) => {
  const data = await limiter.schedule(() => getYelpBusinessInfo(id));
  const timeZoneInfo = getTimeZoneByCoordinates(data.coordinates.latitude, data.coordinates.longitude);
  console.log({timeZoneInfo});
  data.location.timezone = timeZoneInfo.timezone;

  const updatedBusiness = await findOneAndUpdate(
    {id: id},
    data,
    {new: true, upsert: true},
    (error, result) => {
      if (error) {
        captureException(error);
        console.log('Error: ', error);
      } else {
        console.log(`Successfully updated ${result.addedIndex}: ${data.name} (${data.alias})`);
        return result;
      }
    }
  ).clone();

  return updatedBusiness;  
}

const updatedSavedBusiness = async (data) => {
  const updatedBusiness = await findOneAndUpdate(
    {alias: data.alias},
    data,
    {new: true, upsert: true},
    (error, result) => {
      if (error) {
        captureException(error);
        console.log('Error: ', error);
      } else {
        console.log(`Successfully updated ${result.addedIndex}: ${data.name} (${data.alias})`);
        return result;
      }
    }
  ).clone();

  return updatedBusiness;
}

const updateBusinessByAlias = async (alias) => {
  const data = await limiter.schedule(() => getYelpBusinessInfo(alias));
  const timeZoneInfo = await getTimeZoneByCoordinates(data.coordinates.latitude, data.coordinates.longitude);
  data.location.timezone = timeZoneInfo.timezone;

  if (!data.error) {
    const updatedBusiness = await findOneAndUpdate(
      {alias: alias},
      data,
      {new: true, upsert: true},
      (error, result) => {
        if (error) {
          captureException(error);
          console.log('Error: ', error);
        } else {
          console.log(`Successfully updated ${result.addedIndex}: ${data.name} (${data.alias})`);
          return result;
        }
      }
    ).clone();
  
    return updatedBusiness;
  } else {
    return null;
  }
}

const updateBusiness = async (business) => {
  console.log({business});
  business = business.toObject();
  if (business._id) {
    delete business._id;
  }
  
  const data = await limiter.schedule(() => getYelpBusinessInfo(business.alias));
  console.log({data});
  const timeZoneInfo = await getTimeZoneByCoordinates(data.coordinates.latitude, data.coordinates.longitude);
  data.location.timezone = timeZoneInfo.timezone;

  if (!data.error) {
    const updatedBusiness = await findOneAndUpdate(
      {alias: business.alias},
      {...data, ...business},
      {new: true, upsert: true},
      (error, result) => {
        if (error) {
          captureException(error);
          console.log('Error: ', error);
        } else {
          console.log(`Successfully updated ${result.addedIndex}: ${data.name} (${data.alias})`);
          return result;
        }
      }
    ).clone();
  
    return updatedBusiness;
  } else {
    return null;
  }  
}

const checkAndUpdateIncompleteBusinesses = async (collections) => {
  console.log('checkAndUpdateIncompleteBusinesses');
  const allBusinesses = collections.map(collection => collection.businesses).reduce((a, b) => a.concat(b));
  const incompleteBusinesses = allBusinesses.filter(biz => !biz.name);
  console.log({updatedCollections: collections});
  console.log({allBusinesses});
  console.log({incompleteBusinesses});
  const updatedBusinesses = await Promise.all(
    incompleteBusinesses.map(async business => {
      const updatedBusiness = await updateBusiness(business);
      console.log({updatedBusiness});
      return updatedBusiness;
    })
  )
  
  console.log({updatedBusinesses});
  return updatedBusinesses;
}

const updateAllBusinesses = async () => {
  try {
    const businesses = await find();
    const updatedBusinesses = Promise.all(
      businesses.map(async business => {
        const updated = await updateBusinessByAlias(business.alias);
        console.log({updated});
        if (updated) {
          console.log('in updated');
          business = updated.data;
        }    
      })
    )
    return updatedBusinesses;
  } catch {
    captureException(error);
    return {error: error};
  }
}

const updateBusinessBasicInfo = async (business) => {
  try {
    const updatedBusiness = await findOneAndUpdate(
      {alias: business.alias},
      {
        alias: business.alias,
        note: business.note,
        addedIndex: business.addedIndex,
        yelpCollectionId: business.yelpCollectionId
      },
      {new: true, upsert: true},
      (error, result) => {
        if (error) {
          captureException(error);
          console.log(`Error updating basic business info for ${business.alias}: `, error);
        } else {
          console.log(`Updated basic info for ${business.alias}: addedIndex ${business.addedIndex}`);
          return result;
        }
      }
    ).clone();

    return updatedBusiness;
  } catch (error) {
    captureException(error);
    return {error: error};
  }
}

const updateAllBusinessesBasicInfo = async () => {
  try {
    const collections = await _find();
    const collectionsObject = collections.map(collection => collection.toObject());
    const updatedCollections = applyAddedIndexToCollections(collectionsObject);
    const businesses = updatedCollections.map(collection => collection.businesses).reduce((a, b) => a.concat(b));
    const updatedBusinesses = Promise.all(
      businesses.map(async business => {
        const updatedBusiness = updateBusinessBasicInfo(business);
        return updatedBusiness;
      })
    )

    return updatedBusinesses;
  } catch (error) {
    captureException(error);
    return error;
  }
}

const updateIncompleteBusinesses = async () => {
  try {
    const businesses = await find();
    const incomplete = businesses.filter(business => !business.name);
    const updatedBusinesses = Promise.all(
      incomplete.map(async business => {
        const updated = await updateBusinessByAlias(business.alias);
        if (updated) {
          business = updated.data;
          return business;
        }
      })
    )
    return updatedBusinesses;
  } catch {
    captureException(error);
    return {error: error};
  }
}

const getAllBusinesses = async () => {
  try {
    const businesses = await find();
    return businesses;
  } catch (error) {
    captureException(error);
    return {error: error};
  }
}

const getBusinessByAlias = async (alias) => {
  try {
    const business = findOne({alias});
    return business;
  } catch {
    captureException(error);
    return {error: error};
  }
}

const deleteAllBusinesses = async () => {
  try {
    const result = await deleteMany({});
    console.log(`Deleted all businesses (${result.deletedCount})`);
    return result;
  } catch (error) {
    captureException(error);
    return {error: error};
  }
}

const YelpBusinessService =  {
  getAllBusinesses,
  getBusinessByAlias,
  getYelpBusinessInfo,
  updateBusinessBasicInfo,
  updateAllBusinessesBasicInfo,
  updateBusinessByAlias,
  updatedSavedBusiness,
  updateBusinessById,
  updateAllBusinesses,
  updateAllBusinessesBasicInfo,
  updateIncompleteBusinesses,
  checkAndUpdateIncompleteBusinesses,
  populateBasicBusinessInfo,
  deleteAllBusinesses,
}

export default YelpBusinessService;