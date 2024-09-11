import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { XorValidator } from '../../core/validators/xor.validator';
import { PermissionTypes } from '../../core/resources/permissions/permissionTypes';

export class CreatePermissionDto {
    @ApiProperty({ type: () => Number, required: true })
    @IsOptional()
    @IsInt()
    readonly fileId?: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsOptional()
    @IsInt()
    readonly folderId?: number;

    @ApiProperty({ type: () => String, required: true })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly sharedEmail: string;

    @ApiProperty({ type: () => Number, required: true, enum: PermissionTypes })
    @IsNotEmpty()
    @IsInt()
    readonly permissionLevel: number;

    @XorValidator('fileId', 'folderId', {
        message: 'Either fileId or folderId must be provided, but not both.',
    })
    readonly field: any;
}
