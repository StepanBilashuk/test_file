import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { BaseDto } from '../../core/dto/base.dto';
import { LinkCode } from '../entities/linkCode.entity';
import * as process from 'node:process';

export class LinkCodeDto extends BaseDto {
    constructor(data: LinkCode) {
        const entity = data.fileId ? 'files' : 'folders';

        super(data);
        this.code = data.code;
        this.isActive = data.isActive;
        this.userId = data.userId;
        this.folderId = data.folderId;
        this.fileId = data.folderId;
        this.sharedWithId = data.sharedWithId;

        this.link = `${process.env.BACKEND_LINK}${entity}/${data.code}/code`;
    }

    @ApiProperty({ type: () => String, required: true })
    @IsString()
    readonly code: string;

    @ApiProperty({ type: () => Boolean, required: true })
    @IsBoolean()
    readonly isActive: boolean;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    readonly userId: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsOptional()
    @IsInt()
    readonly fileId?: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsOptional()
    @IsInt()
    readonly folderId?: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsOptional()
    @IsInt()
    readonly sharedWithId?: number;

    @ApiProperty({ type: () => String, required: true })
    @IsString()
    readonly link: string;
}
