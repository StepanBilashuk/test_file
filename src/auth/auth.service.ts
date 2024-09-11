import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as process from 'process';
import { JwtService } from '@nestjs/jwt';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(body: CreateSessionDto): Promise<User> {
        const user = await this.usersService.findOne([
            { method: ['byEmail', body.email] },
        ]);

        if (!user.password) {
            throw new UnauthorizedException();
        }

        const validateUserPassword = await bcrypt.compare(
            body.password,
            user.password,
        );

        if (!validateUserPassword) {
            throw new UnauthorizedException();
        }

        return user;
    }

    async generateJWTToken(userId: number): Promise<{ accessToken: string }> {
        const payload = { userId };
        return {
            accessToken: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
            }),
        };
    }

    async validateUserByGoogle(googleProfile: any): Promise<any> {
        const { id: googleId, emails } = googleProfile;

        let user: User = await this.usersService.findOne([
            { method: ['byGoogleId', googleId] },
        ]);

        if (!user) {
            user = await this.usersService.createFromGoogleAccount({
                googleId: googleId,
                email: emails[0].value,
            });
        }

        return user;
    }
}
