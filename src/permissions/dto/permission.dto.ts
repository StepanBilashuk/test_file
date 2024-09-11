import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDto } from '../../core/dto/base.dto';
import { Permission } from '../entities/permission.entity';

export class PermissionDto extends BaseDto {
    constructor(data: Permission) {
        super(data);
        this.userId = data.userId;
        this.fileId = data.fileId;
        this.folderId = data.folderId;
        this.permissionLevel = data.permissionLevel;
        this.grantedBy = data.grantedBy;
    }

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    readonly userId: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsInt()
    readonly fileId?: number;

    @ApiProperty({ type: () => Number, required: false })
    @IsOptional()
    @IsInt()
    readonly folderId?: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    readonly permissionLevel: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    readonly grantedBy: number;
}
