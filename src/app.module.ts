import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CollectionModule } from './collection/collection.module';
import { BusinessModule } from './business/business.module';
import { YelpScrapingService } from './yelp-scraping/yelp-scraping.service';
import { YelpFusionService } from './yelp-fusion/yelp-fusion.service';
import { BusinessController } from './business/business.controller';
import { BusinessService } from './business/business.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_ATLAS_URI'), 
      })
    }), 
    CollectionModule, 
    BusinessModule
  ],
  controllers: [AppController],
  providers: [AppService, YelpScrapingService, YelpFusionService],
})
export class AppModule {}
