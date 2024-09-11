import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { userProvider } from './providers/user.provider';

@Module({
    controllers: [UsersController],
    providers: [UsersService, ...userProvider],
    exports: [UsersService],
})
export class UsersModule {}
