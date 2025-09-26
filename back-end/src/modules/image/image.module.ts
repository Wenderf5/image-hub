import { Module } from '@nestjs/common';
import { ResizeImageService } from './services/resize-image/resize-image.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ImageController } from './image.controller';
import { RedisModule } from '../redis/redis.module';
import { ImageGateway } from './image.gateway';
import { GetResizedImageService } from './services/get-resized-image/get-resized-image.service';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [ResizeImageService, ImageGateway, GetResizedImageService],
  controllers: [ImageController]
})
export class ImageModule { }
