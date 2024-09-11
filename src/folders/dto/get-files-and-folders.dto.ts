import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FolderDto } from './folder.dto';
import { FileDto } from '../../files/dto/file.dto';
import { Folder } from '../entities/folder.entity';
import { BaseResponsePaginationDto } from '../../core/dto/base-response-pagination.dto';

export class GetFilesAndFoldersDto {
  @IsArray()
  @ApiProperty({ isArray: true })
  folders?: FolderDto[];

  @IsArray()
  @ApiProperty({ isArray: true })
  files?: FileDto[];

  @ApiProperty()
  pagination: BaseResponsePaginationDto;

  constructor(data: Folder, pagination: BaseResponsePaginationDto) {
    if (data) {
      this.folders = data.childFolders?.length
        ? data.childFolders?.map((item) => new FolderDto(item))
        : [];
      this.files = data.files?.length
        ? data.files.map((item) => new FileDto(item))
        : [];

      this.pagination = pagination;
    }
  }
}

