import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Transaction } from 'sequelize';

import { BaseService } from '../core/base/base.service';
import {
  FILE_REPOSITORY,
  FOLDER_REPOSITORY,
  PERMISSION_REPOSITORY,
} from '../core/resources/database/databaseEntities.constants';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UsersService } from '../users/users.service';
import { Folder } from '../folders/entities/folder.entity';
import { File } from '../files/entities/file.entity';
import { PermissionTypes } from '../core/resources/permissions/permissionTypes';

@Injectable()
export class PermissionsService extends BaseService<Permission> {
  constructor(
    @Inject(FOLDER_REPOSITORY) private folderRepository: typeof Folder,
    @Inject(FILE_REPOSITORY) private fileRepository: typeof File,

    @Inject(PERMISSION_REPOSITORY) private permissionRepository: typeof Permission,
    private readonly usersService: UsersService,
  ) {
    super(permissionRepository);
  }

  async createAdminPermission (
    userId: number,
    folderId?: number,
    fileId?: number,
    transaction?: Transaction): Promise<Permission> {
    return this.permissionRepository.create(
      {

        permissionLevel: PermissionTypes.admin,
        grantedBy: userId,
        userId: userId,
        folderId,
        fileId
      },
      { transaction },
    );
  }

  async create(
    body: CreatePermissionDto,
    userId: number,
    transaction?: Transaction,
  ): Promise<Permission> {
    const user = await this.usersService.findOne([
      { method: ['byEmail', body.sharedEmail ]},
      'notDeleted'
    ])

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (body.folderId) {
      await this.validateFolderAccess(body.folderId, userId, PermissionTypes.admin, transaction);
    }

    if (body.fileId) {
      await this.validateFileAccess(body.fileId, userId, PermissionTypes.admin, undefined, transaction);
    }

    return this.permissionRepository.create(
      { ...body, grantedBy: userId, userId: user.id },
      { transaction },
    );
  }

  async validateFolderAccess(folderId: number, userId: number, types: number|number[], transaction?: Transaction): Promise<void> {
    const folder = await this.folderRepository
      .scope([
        { method: ['byId', folderId] },
        'notDeleted'
      ])
      .findOne({ transaction })

    if (!folder) {
      throw new BadRequestException('Folder not found');
    }

    const permission = await this.findOne([
      { method: ['byUser', userId] },
      { method: ['byFolder', folderId] },
      { method: ['byPermissionLevel', types] }
    ]);

    if (!permission) {
      throw new UnauthorizedException('Permission not found')
    }
  }

  async validateFileAccess(fileId: number, userId: number, types: number|number[], fileFolderId?: number, transaction?: Transaction): Promise<void> {
    const file = await this.fileRepository
      .scope([
        { method: ['byId', fileId] },
        'notDeleted'
      ])
      .findOne({ transaction })

    if (!file) {
      throw new BadRequestException('File not found');
    }

    const scopes = [
      { method: ['byUser', userId] },
      { method: ['byPermissionLevel', types] }
    ];

    fileFolderId
      ? scopes.push({ method: ['byFileOrFolder', fileId, fileFolderId] })
      : scopes.push({ method: ['byFileId', fileId] })

    const permission = await this.findOne(scopes);

    if (!permission) {
      throw new UnauthorizedException('Permission not found')
    }
  }
}
