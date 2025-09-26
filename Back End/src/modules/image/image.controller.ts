import { Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ResizeImageService } from './services/resize-image/resize-image.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/image')
export class ImageController {
    constructor(private readonly resizeImageService: ResizeImageService) { }

    @Post('/resize')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor("image"))
    async resizeImage(@UploadedFile() file: Express.Multer.File) {
        const resizeProcessId = await this.resizeImageService.resize({
            fullName: file.originalname,
            image: file.buffer
        });

        return {
            status: HttpStatus.OK,
            message: "Image added to the resize queue",
            resizeProcessId: resizeProcessId
        }
    }
}
