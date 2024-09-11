import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { FoldersModule } from './folders/folders.module';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './core/database/database.provider';
import { DatabaseModule } from './core/database/database.module';
import { RedisModule } from './core/redis/redis.module';
import { LinkCodesModule } from './link-codes/link-codes.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        UsersModule,
        AuthModule,
        FilesModule,
        FoldersModule,
        DatabaseModule,
        RedisModule,
        PermissionsModule,
        LinkCodesModule,
    ],
    controllers: [AppController],
    providers: [AppService, ...databaseProviders],
})
export class AppModule {}
