import { IsNotEmpty, IsString } from "class-validator";

export class ImageDto {
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsNotEmpty()
    image: Buffer;
}
