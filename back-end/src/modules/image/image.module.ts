import { Module } from '@nestjs/common';
import { SendImageToResizeQueueService } from './services/send-image-to-resize-queue/send-image-to-resize-queue.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ImageController } from './image.controller';
import { RedisModule } from '../redis/redis.module';
import { GetProcessService } from './services/get-process/get-process.service';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [SendImageToResizeQueueService, GetProcessService],
  controllers: [ImageController]
})
export class ImageModule { }
