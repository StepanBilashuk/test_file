import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { XorValidator } from '../../core/validators/xor.validator';

export class CreateLinkCodeDto {
    @ApiProperty({ type: () => Number, required: true })
    @IsOptional()
    @IsInt()
    readonly fileId?: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsOptional()
    @IsInt()
    readonly folderId?: number;

    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsInt()
    readonly sharedWithId: number;

    @XorValidator('fileId', 'folderId', {
        message: 'Either fileId or folderId must be provided, but not both.',
    })
    readonly field: any;
}
