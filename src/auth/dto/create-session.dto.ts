import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX } from '../../core/resources/regex/session-regex.constants';

export class CreateSessionDto implements ISession {
    @ApiProperty()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Matches(PASSWORD_REGEX)
    readonly password: string;
}
