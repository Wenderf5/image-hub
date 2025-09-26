import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/service/prisma/prisma.service';
import Redis from 'ioredis';

@Injectable()
export class GetResizedImageService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject('REDIS_SERVICE')
        private readonly redisService: Redis
    ) { }

    async getResizedImage(processId: string) {
        const result = await this.verifyProcess(processId);

        if (result === "completed") {
            const imageDb = await this.getImageDb(processId);

            return {
                status: "completed",
                imageUrl: imageDb.imageUrl
            }
        }

        if (result === "in progress") {
            return {
                status: "in progress"
            }
        }

        if (result === "failed") {
            return {
                status: "failed"
            }
        }
    }

    private async verifyProcess(processId: string) {
        const result = await this.redisService.get(`resize:${processId}`);
        if (!result) {
            throw new NotFoundException("Record not found");
        }

        return result;
    }


    private async getImageDb(processId: string) {
        const imageDb = await this.prismaService.images.findUnique({
            where: {
                id: processId
            }
        });

        if (!imageDb) {
            throw new NotFoundException("Image not found");
        }

        return imageDb;
    }
}
