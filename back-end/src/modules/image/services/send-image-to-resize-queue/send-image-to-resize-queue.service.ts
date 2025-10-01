import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ImageDto } from '../../DTOs/image/image.dto';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import Redis from 'ioredis';

@Injectable()
export class SendImageToResizeQueueService {
    private readonly client: ClientProxy;

    constructor(
        @Inject('REDIS_SERVICE')
        private readonly redisService: Redis,
        private readonly configService: ConfigService
    ) {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [this.configService.get<string>('RABBITMQ_URL') as string],
                queue: this.configService.get<string>('RABBITMQ_QUEUE'),
                queueOptions: {
                    durable: true
                }
            }
        });
    }

    async send(image: ImageDto) {
        try {
            const processId = uuidv4();

            this.client.emit(this.configService.get<string>('RABBITMQ_QUEUE'), {
                id: processId,
                fullName: image.fullName,
                image: image.image.toString('base64')
            });

            await this.createStatusOfProcess(processId);

            return {
                status: HttpStatus.OK,
                message: "Image added to the resize queue",
                processId: processId
            }
        } catch (error) {
            throw new BadRequestException("Error processing image");
        }
    }

    private async createStatusOfProcess(processId: string) {
        await this.redisService.set(
            `resize:${processId}`,
            "300",
            'EX',
            300
        );
    }
}