import { Test, TestingModule } from '@nestjs/testing';
import { YelpScrapingService } from './yelp-scraping.service';

describe('YelpScrapingService', () => {
  let service: YelpScrapingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YelpScrapingService],
    }).compile();

    service = module.get<YelpScrapingService>(YelpScrapingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
