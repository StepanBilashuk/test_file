import { FILE_REPOSITORY } from '../../core/resources/database/databaseEntities.constants';
import { File } from '../entities/file.entity';

export const fileProvider = [
  {
    provide: FILE_REPOSITORY,
    useValue: File,
  },
];
