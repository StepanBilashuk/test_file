import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail } from 'class-validator';
import { BaseDto } from '../../core/dto/base.dto';
import { User } from '../entities/user.entity';

export class UserDto extends BaseDto {
    constructor(data: User) {
        super(data);
        this.email = data.email;
        this.isDeleted = data.isDeleted;
    }
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsBoolean()
    isDeleted: boolean;
}
