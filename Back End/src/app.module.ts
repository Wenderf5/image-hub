import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ImageModule } from './modules/image/image.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    PrismaModule,
    ImageModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    RedisModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
