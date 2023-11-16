import { Test, TestingModule } from '@nestjs/testing';
import { YelpFusionService } from './yelp-fusion.service';

describe('YelpFusionService', () => {
  let service: YelpFusionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YelpFusionService],
    }).compile();

    service = module.get<YelpFusionService>(YelpFusionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
