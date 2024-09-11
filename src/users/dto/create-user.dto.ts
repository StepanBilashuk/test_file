import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ type: () => String, required: true })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({ type: () => String, required: true })
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    readonly password: string;
}
