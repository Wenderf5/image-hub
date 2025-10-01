import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
  providers: [
    {
      provide: 'REDIS_SERVICE',
      useFactory: async (configService: ConfigService) => {
        const client: Redis = new Redis({
          host: configService.get<string>("REDIS_HOST"),
          port: configService.get<number>("REDIS_PORT"),
          password: configService.get<string>("REDIS_SECRET_KEY")
        });

        return client;
      },
      inject: [ConfigService]
    }
  ],
  exports: ['REDIS_SERVICE']
})
export class RedisModule { }
