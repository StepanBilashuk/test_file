import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class BaseDto {
    @ApiProperty({ type: () => Number, required: true })
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    @ApiProperty({ type: () => Date, required: true })
    @IsDate()
    @IsNotEmpty()
    readonly createdAt: Date;

    @ApiProperty({ type: () => Date, required: true })
    @IsDate()
    @IsNotEmpty()
    readonly updatedAt: Date;

    constructor(entity) {
        this.id = entity.id;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
    }
}
