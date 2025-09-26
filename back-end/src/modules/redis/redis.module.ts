import { Module } from '@nestjs/common';
import Redis from 'ioredis';

@Module({
  providers: [
    {
      provide: 'REDIS_SERVICE',
      useFactory: async () => {
        const client: Redis = new Redis({
          host: "HOST",
          port: "PORT",
          password: "SECRET_KEY"
        });

        // client.on('error', (err) => {
        //   throw new Error('Redis Client Error: ', err);
        // });

        // await new Promise<void>((resolve, reject) => {
        //   client.once('ready', () => resolve());
        //   client.once('error', (err) => reject(err));
        // });

        return client;
      }
    }
  ],
  exports: ['REDIS_SERVICE']
})
export class RedisModule { }
