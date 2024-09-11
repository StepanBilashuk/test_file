import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFileDto {
    @ApiProperty({ type: () => String, required: true })
    @IsString()
    readonly originalName: string;

    @ApiProperty({ type: () => String, required: true })
    @IsString()
    readonly name: string;

    @ApiProperty({ type: () => Boolean, required: true })
    @IsBoolean()
    readonly isPublic: boolean;

    @ApiProperty({ type: () => Number, required: true })
    @IsNumber()
    @Type(() => Number)
    readonly folderId: number;
}
