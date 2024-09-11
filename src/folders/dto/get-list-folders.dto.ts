import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseRequestPaginationDto } from '../../core/dto/base-request-pagination.dto';

export class GetListFoldersDto extends BaseRequestPaginationDto {
  @ApiProperty({ type: () => String, required: false })
  @IsString()
  @IsOptional()
  readonly query?: string;
}
