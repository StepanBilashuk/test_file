import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../core/base/base.service';
import { Folder } from './entities/folder.entity';
import { FOLDER_REPOSITORY } from '../core/resources/database/databaseEntities.constants';
import { Transaction } from 'sequelize';
import { CreateFolderDto } from './dto/create-folder.dto';

@Injectable()
export class FoldersService extends BaseService<Folder> {
    constructor(
        @Inject(FOLDER_REPOSITORY) private folderRepository: typeof Folder,
    ) {
        super(folderRepository);
    }

    async create(
        body: CreateFolderDto,
        userId: number,
        transaction?: Transaction,
    ): Promise<Folder> {
        const getRepeatedFolder = await this.findOne([
            { method: ['byName', body.name] },
            { method: ['byUser', userId] },
        ], transaction);

        if (getRepeatedFolder) {
            throw new BadRequestException('Folder already exists');
        }

        if (body.parentId) {
            const parentFolder = await this.findOne([
              { method: ['byId', body.parentId] }, { method: ['byUser', userId] }
            ], transaction);

            if (!parentFolder) {
                throw new BadRequestException('Parent folder doesnt exists');
            }
        }

        return this.folderRepository.create(
            { ...body, userId },
            { transaction },
        );
    }
}
