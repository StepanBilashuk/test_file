import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../core/base/base.service';
import { FILE_REPOSITORY } from '../core/resources/database/databaseEntities.constants';
import { Transaction, WhereOptions } from 'sequelize';
import { File } from './entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FilesService extends BaseService<File> {
  constructor(
    @Inject(FILE_REPOSITORY) private fileRepository: typeof File,
  ) {
    super(fileRepository);
  }

  async create(
    body: CreateFileDto,
    userId: number,
    transaction?: Transaction,
  ): Promise<File> {
    return this.fileRepository.create(
      { ...body, userId },
      { transaction },
    );
  }
}
