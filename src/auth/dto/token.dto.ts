import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenDto {
    @ApiProperty({
        type: String,
        description: 'Token',
    })
    @IsNotEmpty()
    @IsString()
    readonly accessToken: string;

    constructor(token: { accessToken: string }) {
        this.accessToken = token.accessToken;
    }
}
