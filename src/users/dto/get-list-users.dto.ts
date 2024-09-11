import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';
import { BaseRequestPaginationDto } from '../../core/dto/base-request-pagination.dto';

export class GetListUsersDto extends BaseRequestPaginationDto{
  @ApiProperty({ type: () => String, required: true })
  @IsString()
  readonly query: string;
}
