import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserByGoogleDto {
    @ApiProperty({ type: () => String, required: true })
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({ type: () => String, required: true })
    @IsString()
    @IsNotEmpty()
    readonly googleId: string;
}
