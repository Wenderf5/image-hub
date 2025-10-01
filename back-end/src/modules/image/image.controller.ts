import { Controller, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SendImageToResizeQueueService } from './services/send-image-to-resize-queue/send-image-to-resize-queue.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetProcessService } from './services/get-process/get-process.service';

@Controller('/image/resize')
export class ImageController {
    constructor(
        private readonly sendImageToResizeQueueService: SendImageToResizeQueueService,
        private readonly getProcessService: GetProcessService
    ) { }

    @Post()
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor("image"))
    resizeImage(@UploadedFile() file: Express.Multer.File) {
        return this.sendImageToResizeQueueService.send({
            fullName: file.originalname,
            image: file.buffer
        });
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    getRisizedImage(@Param('id') id: string) {
        return this.getProcessService.getProcess(id);
    }
}
