import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, } from 'class-validator';

export class UpdateFileDto {
  @ApiProperty({ type: () => String, required: true })
  @IsString()
  readonly originalName: string;

  @ApiProperty({ type: () => Boolean, required: true })
  @IsBoolean()
  readonly isPublic: boolean;
}
