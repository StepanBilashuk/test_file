import { FOLDER_REPOSITORY } from '../../core/resources/database/databaseEntities.constants';
import { Folder } from '../entities/folder.entity';

export const folderProvider = [
    {
        provide: FOLDER_REPOSITORY,
        useValue: Folder,
    },
];
