import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ImageDto } from '../../DTOs/image/image.dto';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import Redis from 'ioredis';

@Injectable()
export class ResizeImageService {
    constructor(
        @Inject('REDIS_SERVICE')
        private readonly redisService: Redis,
        private readonly configService: ConfigService
    ) { }

    @Client({
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://USER:PASSWORD@HOST:PORT/VHOST'],
            queue: "QUEUE_NAME",
            queueOptions: {
                durable: true
            }
        }
    })
    private readonly client: ClientProxy;

    async resize(image: ImageDto) {
        try {
            const resizeProcessId = uuidv4();

            this.client.emit("image-resize-queue", {
                id: resizeProcessId,
                fullName: image.fullName,
                image: image.image.toString('base64')
            });

            await this.redisService.set(
                `resize:${resizeProcessId}`,
                "in progress",
                'EX',
                300
            );

            return resizeProcessId;
        } catch (error) {
            throw new BadRequestException("Error processing image");
        }
    }
}