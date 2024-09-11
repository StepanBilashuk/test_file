import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BaseRequestPaginationDto {
    @ApiProperty({ type: () => Number, required: true, default: 0 })
    @Type(() => Number)
    readonly offset: number;

    @ApiProperty({ type: () => Number, required: true, default: 100 })
    @Type(() => Number)
    readonly limit: number;
}
