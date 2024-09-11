import { USER_REPOSITORY } from '../../core/resources/database/databaseEntities.constants';
import { User } from '../entities/user.entity';

export const userProvider = [
    {
        provide: USER_REPOSITORY,
        useValue: User,
    },
];
