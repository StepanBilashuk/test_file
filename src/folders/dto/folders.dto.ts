import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FolderDto } from './folder.dto';
import { BaseResponsePaginationDto } from '../../core/dto/base-response-pagination.dto';

export class FoldersDto {
  @IsArray()
  @ApiProperty({ isArray: true })
  data: FolderDto[];

  @ApiProperty()
  pagination: BaseResponsePaginationDto;

  constructor(data: any[], pagination: any) {
    this.data = data.map((item) => new FolderDto(item));
    this.pagination = new BaseResponsePaginationDto(pagination);
  }
}

