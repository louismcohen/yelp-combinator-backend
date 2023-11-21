import { Business } from "./business";
import { BusinessModel } from "./business.model";

class BusinessService {
  getBusinessByAlias = async (alias: string): Promise<Business | any | null> => {
    try {
      const business: Business | null = await BusinessModel.findOne({alias});
      return business;

    } catch (error: any) {
      throw error;
    }
  }

  getAllBusinesses = async (): Promise<Business[] | any | null> => {
    try {
      const businesses: Business[] | null = await BusinessModel.find();
      return businesses;
    } catch (error: any) {
      throw error;
    }
  }

  addOrUpdatedBusiness = async (business: Business): Promise<Business | any> => {
    try {
      const savedBusiness = await BusinessModel.findOneAndUpdate(
        {alias: business.alias},
        business,
        { new: true, upsert: true },
      );

      return savedBusiness;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new BusinessService();