import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { databaseProviders } from './database.provider';

@Module({
    imports: [
        SequelizeModule.forRootAsync({
            useFactory: () => databaseProviders[0].useFactory(),
        }),
    ],
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule {}
