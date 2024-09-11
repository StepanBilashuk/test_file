import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Req,
    HttpStatus,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RedisService } from '../core/redis/redis.service';
import { UsersService } from '../users/users.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { TokenDto } from './dto/token.dto';
import { UserDto } from '../users/dto/user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { GoogleOauthGuard } from './guards/google.guard';
import * as process from 'node:process';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private redisService: RedisService,
        private usersService: UsersService,
    ) {}

    @ApiBody({ type: CreateSessionDto })
    @ApiCreatedResponse({
        description: 'Successfully create token.',
        type: TokenDto,
    })
    @Post('/sessions')
    async signInUser(@Body() body: CreateSessionDto): Promise<TokenDto> {
        const user = await this.authService.validateUser(body);
        const token = await this.authService.generateJWTToken(user.id);
        await this.redisService.addUserAuthToken(user.id, token.accessToken);
        return new TokenDto(token);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('Bearer')
    @Get('me')
    async getProfile(@Request() req) {
        const user = await this.usersService.findOneByPk(req.user.id);
        return new UserDto(user);
    }

    @Get('google')
    @UseGuards(GoogleOauthGuard)
    async googleAuth() {}

    @Get('google/callback')
    @UseGuards(GoogleOauthGuard)
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        const { jwt } = req.user;

        res.setHeader('Authorization', `Bearer ${jwt.accessToken}`);

        return res.redirect(`${process.env.BACKEND_LINK}`);
    }
}
