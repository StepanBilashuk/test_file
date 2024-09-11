import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponsePaginationDto } from '../../core/dto/base-response-pagination.dto';
import { UserDto } from './user.dto';

export class UsersDto {
    @IsArray()
    @ApiProperty({ isArray: true })
        data: UserDto[];

    @ApiProperty()
        pagination: BaseResponsePaginationDto;

    constructor(data: any[], pagination: any) {
        this.data = data.map((item) => new UserDto(item));
        this.pagination = new BaseResponsePaginationDto(pagination);
    }
}
