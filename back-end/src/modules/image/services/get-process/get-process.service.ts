import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/service/prisma/prisma.service';
import Redis from 'ioredis';

@Injectable()
export class GetProcessService {
    constructor(
        @Inject('REDIS_SERVICE')
        private readonly redisService: Redis,
        private readonly prismaService: PrismaService
    ) { }

    async getProcess(processId: string) {
        const result = await this.getStatusOfProcess(processId);

        if (result as unknown as number == 200) {
            const imageDb = await this.getImageFromDb(processId);

            return {
                status: 200,
                message: "Completed",
                imageUrl: imageDb.imageUrl
            }
        }

        if (result as unknown as number == 300) {
            return {
                status: 300,
                message: "In progress"
            }
        }

        return {
            status: 400,
            message: "Failure",
        }
    }

    private async getStatusOfProcess(processId: string) {
        const result = await this.redisService.get(`resize:${processId}`);
        if (!result) {
            throw new NotFoundException("Record not found");
        }

        return result;
    }


    private async getImageFromDb(processId: string) {
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
