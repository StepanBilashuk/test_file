import * as process from 'process';
import { SequelizeModuleOptions } from '@nestjs/sequelize';

import { SEQUELIZE } from '../resources/database/databaseEntities.constants';
import { User } from '../../users/entities/user.entity';
import { Folder } from '../../folders/entities/folder.entity';
import { File } from '../../files/entities/file.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { LinkCode } from '../../link-codes/entities/linkCode.entity';

export const databaseProviders = [
    {
        provide: SEQUELIZE,
        useFactory: (): SequelizeModuleOptions => ({
            autoLoadModels: true,
            database: process.env.DB_DATABASE,
            dialect: 'mysql',
            host: process.env.DB_HOST,
            models: [User, Folder, File, Permission, LinkCode],
            password: process.env.DB_PASSWORD,
            port: 3306,
            synchronize: true,
            username: process.env.DB_USERNAME,
        }),
    },
];
