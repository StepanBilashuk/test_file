import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseEntityByIdDto {
  @ApiProperty({ type: () => Number, required: true })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly id: number;
}
