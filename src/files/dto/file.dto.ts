import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '../../core/dto/base.dto';
import { File } from '../entities/file.entity';

export class FileDto extends BaseDto {
  constructor(data: File) {
    super(data);
    this.userId = data.userId;
    this.folderId = data.folderId;
    this.originalName = data.originalName;
    this.name = data.name;
    this.isPublic = data.isPublic;
    this.isDeleted = data.isDeleted;
  }
  @ApiProperty({ type: () => Number, required: true })
  @IsInt()
  @IsNotEmpty()
  readonly userId: number;

  @ApiProperty({ type: () => Number, required: true })
  @IsInt()
  @IsNotEmpty()
  readonly folderId: number;

  @ApiProperty({ type: () => String, required: true })
  @IsString()
  @IsNotEmpty()
  readonly originalName: string;

  @ApiProperty({ type: () => String, required: true })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ type: () => Boolean, required: true })
  @IsBoolean()
  @IsNotEmpty()
  readonly isPublic: boolean;

  @ApiProperty({ type: () => Boolean, required: true })
  @IsBoolean()
  @IsNotEmpty()
  readonly isDeleted: boolean;
}
