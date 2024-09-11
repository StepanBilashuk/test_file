import { LINK_CODE_REPOSITORY } from '../../core/resources/database/databaseEntities.constants';
import { LinkCode } from '../entities/linkCode.entity';

export const linkCodeProvider = [
    {
        provide: LINK_CODE_REPOSITORY,
        useValue: LinkCode,
    },
];
