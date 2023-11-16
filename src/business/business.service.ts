import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Business } from './schemas/business.schema';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name) 
    private businessModel: Model<Business>
  ) {}

  create(createBusinessDto: CreateBusinessDto) {
    const createdBusiness = new this.businessModel(createBusinessDto);
    return createdBusiness;
    // return 'This action adds a new business';
  }

  findAll() {
    const allBusinesses = this.businessModel.find().exec();
    return allBusinesses;
    // return `This action returns all business`;
  }

  findOne(id: number) {
    return `This action returns a #${id} business`;
  }

  update(id: number, updateBusinessDto: UpdateBusinessDto) {
    return `This action updates a #${id} business`;
  }

  remove(id: number) {
    return `This action removes a #${id} business`;
  }
}
