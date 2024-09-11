import { PERMISSION_REPOSITORY } from '../../core/resources/database/databaseEntities.constants';
import { Permission } from '../entities/permission.entity';

export const permissionProvider = [
    {
        provide: PERMISSION_REPOSITORY,
        useValue: Permission,
    },
];
