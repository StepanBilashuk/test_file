import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: () => String, required: true })
        name: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ type: () => Number, required: false })
        parentId?: number;
}
