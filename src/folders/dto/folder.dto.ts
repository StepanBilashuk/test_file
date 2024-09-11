import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseDto } from '../../core/dto/base.dto';
import { Folder } from '../entities/folder.entity';
import { FileDto } from '../../files/dto/file.dto';

export class FolderDto extends BaseDto {
    constructor(data: Folder) {
        super(data);
        this.name = data.name;
        this.childFolders = data.childFolders?.length
            ? data.childFolders.map((folder) => new FolderDto(folder))
            : undefined;
        this.files = data.files?.length
            ? data.files.map((file) => new FileDto(file))
            : undefined;
    }
    @ApiProperty({ type: () => String, required: true })
    @IsString()
        name: string;

    @ApiProperty()
    @IsArray()
        childFolders?: FolderDto[];

    @ApiProperty()
    @IsArray()
        files?: FileDto[];
}
