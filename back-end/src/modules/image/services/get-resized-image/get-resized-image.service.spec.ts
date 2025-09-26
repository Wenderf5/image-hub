import { Test, TestingModule } from '@nestjs/testing';
import { GetResizedImageService } from './get-resized-image.service';

describe('GetResizedImageService', () => {
  let service: GetResizedImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetResizedImageService],
    }).compile();

    service = module.get<GetResizedImageService>(GetResizedImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
